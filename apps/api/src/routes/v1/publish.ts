import type { FastifyInstance } from "fastify";
import { randomUUID, createHash } from "node:crypto";
import pino from "pino";
import { PublishRequestSchema } from "@orgo-sync/schemas";
import type { PublishRequest, CanonicalEvent } from "@orgo-sync/schemas";
import { resolveAdapter } from "../../adapters/index.js";
import { enqueueDispatchBulk, type DispatchJobData } from "../../queues/dispatch.queue.js";
import { getRedis } from "../../lib/redis.js";
import { getServiceClient } from "../../lib/supabase.js";
import { logApiUsage } from "../../lib/usage-logger.js";

const logger = pino({ name: "publish-route" });

const IDEMPOTENCY_TTL_SECONDS = 3600;
const SUBSCRIPTION_CACHE_TTL_SECONDS = 60;

interface CachedSubscription {
  id: string;
  endpoint_url: string;
  signing_secret: string;
  event_filters: string[];
  subscriber_org: string;
}

async function getActiveSubscriptions(publisherId: string): Promise<CachedSubscription[]> {
  const redis = getRedis();
  const cacheKey = `subs:${publisherId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached) as CachedSubscription[];

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("webhook_subscriptions")
    .select("id, endpoint_url, signing_secret, event_filters, partners!webhook_subscriptions_subscriber_id_fkey(org_name)")
    .eq("publisher_id", publisherId)
    .eq("is_active", true)
    .eq("approval_status", "approved")
    .is("disabled_at", null);

  if (error || !data) return [];

  const subs: CachedSubscription[] = data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    endpoint_url: row.endpoint_url as string,
    signing_secret: row.signing_secret as string,
    event_filters: row.event_filters as string[],
    subscriber_org: ((row.partners as Record<string, unknown>)?.org_name as string) ?? "Unknown",
  }));

  await redis.set(cacheKey, JSON.stringify(subs), "EX", SUBSCRIPTION_CACHE_TTL_SECONDS);
  return subs;
}

function matchesFilter(eventType: string, filters: string[]): boolean {
  return filters.includes("*") || filters.includes(eventType);
}

export async function registerPublishRoute(server: FastifyInstance) {
  server.post("/v1/publish", {
    schema: {
      tags: ["publish"],
      description: "Publish CRUD schedule events for real-time fan-out to subscribed builders. Operates in normalize-only mode (no enrichment).",
      body: PublishRequestSchema,
    },
  }, async (request, reply) => {
    const startTime = Date.now();
    const input = request.body as PublishRequest;
    const auth = request.partnerAuth!;

    if (auth.partner_type !== "platform") {
      return reply.status(403).send({
        error: {
          code: "FORBIDDEN",
          message: "Only platform partners can publish events",
        },
      });
    }

    const redis = getRedis();
    const supabase = getServiceClient();

    const { data: publisher } = await supabase
      .from("partners")
      .select("org_name")
      .eq("id", auth.partner_id)
      .single();

    const publisherInfo = {
      partner_id: auth.partner_id,
      org_name: (publisher?.org_name as string) ?? "Unknown",
    };

    const normalizedEvents: Array<{
      action: "created" | "updated" | "deleted";
      events: CanonicalEvent[];
      deleteIds: string[];
    }> = [];

    let duplicatesSkipped = 0;
    let totalEventCount = 0;

    for (const evt of input.events) {
      const idempotencyKey = evt.idempotency_key ??
        createHash("sha256")
          .update(`${auth.partner_id}:${evt.action}:${JSON.stringify(evt.payload)}`)
          .digest("hex");

      const dedupKey = `idemp:${idempotencyKey}`;
      const wasSet = await redis.set(dedupKey, "1", "EX", IDEMPOTENCY_TTL_SECONDS, "NX");

      if (!wasSet) {
        duplicatesSkipped++;
        continue;
      }

      if (evt.action === "deleted") {
        const externalId = typeof evt.payload === "string"
          ? evt.payload
          : (evt.payload?.external_id ?? evt.payload?.id ?? "");

        normalizedEvents.push({ action: "deleted", events: [], deleteIds: [String(externalId)] });
        totalEventCount++;
        continue;
      }

      const adapter = resolveAdapter(evt.source);
      if (!adapter) {
        return reply.status(400).send({
          error: {
            code: "UNKNOWN_ADAPTER",
            message: `No adapter for source "${evt.source}". Supported: teamsnap, ics, json`,
          },
        });
      }

      const { events: canonical } = await adapter.normalize(evt.payload);
      normalizedEvents.push({ action: evt.action, events: canonical, deleteIds: [] });
      totalEventCount += canonical.length;
    }

    const subscriptions = await getActiveSubscriptions(auth.partner_id);

    const dispatchJobs: DispatchJobData[] = [];

    for (const group of normalizedEvents) {
      const eventType = `event.${group.action}` as DispatchJobData["event_type"];

      for (const sub of subscriptions) {
        if (!matchesFilter(eventType, sub.event_filters)) continue;

        if (group.action === "deleted") {
          for (const extId of group.deleteIds) {
            dispatchJobs.push({
              delivery_id: `del_${randomUUID()}`,
              subscription_id: sub.id,
              endpoint_url: sub.endpoint_url,
              signing_secret: sub.signing_secret,
              event_type: eventType,
              publisher: publisherInfo,
              data: { external_id: extId },
            });
          }
        } else {
          for (const event of group.events) {
            dispatchJobs.push({
              delivery_id: `del_${randomUUID()}`,
              subscription_id: sub.id,
              endpoint_url: sub.endpoint_url,
              signing_secret: sub.signing_secret,
              event_type: eventType,
              publisher: publisherInfo,
              data: event,
            });
          }
        }
      }
    }

    await enqueueDispatchBulk(dispatchJobs);

    const latencyMs = Date.now() - startTime;
    logApiUsage({
      api_key_id: "",
      partner_id: auth.partner_id,
      endpoint: "/v1/publish",
      status_code: 202,
      latency_ms: latencyMs,
      event_count: totalEventCount,
      cached: false,
      normalize_only: true,
    }).catch(() => {});

    logger.info({
      partnerId: auth.partner_id,
      eventCount: totalEventCount,
      subscribersNotified: subscriptions.length,
      dispatchJobs: dispatchJobs.length,
      duplicatesSkipped,
      latencyMs,
    }, "Publish accepted");

    return reply.status(202).send({
      accepted: true,
      event_count: totalEventCount,
      subscribers_notified: subscriptions.length,
      request_id: randomUUID(),
      duplicates_skipped: duplicatesSkipped,
    });
  });
}
