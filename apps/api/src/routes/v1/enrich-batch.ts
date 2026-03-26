import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { EnrichBatchRequestSchema, type CanonicalEvent } from "@orgo-sync/schemas";
import { enqueueBatchEnrichment } from "../../queues/enrich.queue.js";
import { logApiUsage } from "../../lib/usage-logger.js";

function toCanonicalEvent(input: import("@orgo-sync/schemas").EnrichRequest): CanonicalEvent {
  return {
    source: { platform: "api", external_id: randomUUID() },
    title: input.title,
    description: input.description ?? null,
    start: input.start,
    end: input.end,
    duration_minutes: Math.round(
      (new Date(input.end).getTime() - new Date(input.start).getTime()) / 60000
    ),
    all_day: false,
    is_tbd: false,
    is_canceled: false,
    status: "confirmed",
    timezone: input.timezone ?? null,
    location: {
      raw: input.location ?? null,
      venue_name: null,
      address: input.location ?? null,
      coordinates: null,
      additional_details: null,
    },
    sport: {
      event_type: (input.sport?.event_type as CanonicalEvent["sport"]["event_type"]) ?? null,
      team_name: input.sport?.team_name ?? null,
      opponent_name: input.sport?.opponent_name ?? null,
      uniform: input.sport?.uniform ?? null,
      early_arrival_minutes: input.sport?.early_arrival_minutes ?? 0,
      label: null,
      is_game: input.sport?.event_type === "game",
    },
    participants: [],
    recurrence: null,
    notes: null,
  };
}

export async function registerEnrichBatchRoute(server: FastifyInstance) {
  server.post("/v1/enrich/batch", {
    schema: {
      tags: ["enrich"],
      description: "Enrich multiple events asynchronously via background queue. Set `enrich: false` to normalize all events synchronously without external API calls.",
      body: EnrichBatchRequestSchema,
    },
  }, async (request, reply) => {
    const startTime = Date.now();
    const input = request.body as import("@orgo-sync/schemas").EnrichBatchRequest;
    const auth = request.partnerAuth!;
    const normalizeOnly = input.enrich === false;

    if (normalizeOnly) {
      const events = input.events.map(toCanonicalEvent);
      const latencyMs = Date.now() - startTime;

      logApiUsage({
        api_key_id: "",
        partner_id: auth.partner_id,
        endpoint: "/v1/enrich/batch",
        status_code: 200,
        latency_ms: latencyMs,
        event_count: events.length,
        cached: false,
        normalize_only: true,
      }).catch(() => {});

      return reply.status(200).send({
        success: true,
        events,
        event_count: events.length,
        request_id: randomUUID(),
        normalize_only: true,
      });
    }

    const jobId = randomUUID();

    await enqueueBatchEnrichment(jobId, input.events, {
      origin: input.origin,
      webhookUrl: input.webhook_url,
      partnerId: auth.partner_id,
      isSandbox: auth.is_sandbox,
    });

    logApiUsage({
      api_key_id: "",
      partner_id: auth.partner_id,
      endpoint: "/v1/enrich/batch",
      status_code: 202,
      latency_ms: Date.now() - startTime,
      event_count: input.events.length,
      cached: false,
      normalize_only: false,
    }).catch(() => {});

    return reply.status(202).send({
      success: true,
      job_id: jobId,
      status: "queued",
      total_events: input.events.length,
      webhook_url: input.webhook_url ?? null,
    });
  });
}
