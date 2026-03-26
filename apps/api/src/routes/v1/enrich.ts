import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { EnrichRequestSchema, type CanonicalEvent } from "@orgo-sync/schemas";
import { runEnrichmentPipeline } from "../../pipeline/enrichment-pipeline.js";
import { generateSandboxLogisticsObject } from "../../pipeline/sandbox-mock.js";
import { logApiUsage } from "../../lib/usage-logger.js";

export async function registerEnrichRoute(server: FastifyInstance) {
  server.post("/v1/enrich", {
    schema: {
      tags: ["enrich"],
      description: "Enrich a single event with geocoding, drive time, weather, timeline, and conflict detection. Set `enrich: false` to normalize only.",
      body: EnrichRequestSchema,
    },
  }, async (request, reply) => {
    const startTime = Date.now();
    const input = request.body as import("@orgo-sync/schemas").EnrichRequest;
    const auth = request.partnerAuth!;

    const canonicalEvent: CanonicalEvent = {
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

    const requestId = randomUUID();
    const normalizeOnly = input.enrich === false;

    if (normalizeOnly) {
      const latencyMs = Date.now() - startTime;

      logApiUsage({
        api_key_id: "",
        partner_id: auth.partner_id,
        endpoint: "/v1/enrich",
        status_code: 200,
        latency_ms: latencyMs,
        event_count: 1,
        cached: false,
        normalize_only: true,
      }).catch(() => {});

      return reply.status(200).send({
        success: true,
        events: [canonicalEvent],
        event_count: 1,
        request_id: requestId,
        normalize_only: true,
      });
    }

    const logistics = auth.is_sandbox
      ? generateSandboxLogisticsObject(canonicalEvent)
      : await runEnrichmentPipeline(
          {
            event: canonicalEvent,
            origin: input.origin,
            otherEvents: input.other_events,
          },
          false
        );

    const latencyMs = Date.now() - startTime;

    logApiUsage({
      api_key_id: "",
      partner_id: auth.partner_id,
      endpoint: "/v1/enrich",
      status_code: 200,
      latency_ms: latencyMs,
      event_count: 1,
      cached: false,
      normalize_only: false,
    }).catch(() => {});

    return reply.status(200).send({
      success: true,
      data: logistics,
      request_id: requestId,
    });
  });
}
