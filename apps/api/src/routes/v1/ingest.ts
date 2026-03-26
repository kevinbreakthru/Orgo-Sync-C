import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { IngestRequestSchema } from "@orgo-sync/schemas";
import { resolveAdapter } from "../../adapters/index.js";
import { runEnrichmentPipeline } from "../../pipeline/enrichment-pipeline.js";
import { generateSandboxLogisticsObject } from "../../pipeline/sandbox-mock.js";
import { logApiUsage } from "../../lib/usage-logger.js";

export async function registerIngestRoute(server: FastifyInstance) {
  server.post("/v1/ingest", {
    schema: {
      tags: ["ingest"],
      description: "Ingest native JSON from a platform adapter (TeamSnap, ICS, raw JSON). Set `enrich: false` to normalize only.",
      body: IngestRequestSchema,
    },
  }, async (request, reply) => {
    const startTime = Date.now();
    const input = request.body as import("@orgo-sync/schemas").IngestRequest;
    const auth = request.partnerAuth!;

    const adapter = resolveAdapter(input.source);
    if (!adapter) {
      return reply.status(400).send({
        error: {
          code: "UNKNOWN_ADAPTER",
          message: `No adapter registered for source "${input.source}". Supported: teamsnap, ics, json`,
        },
      });
    }

    const { events, warnings } = await adapter.normalize(input.payload);

    if (!input.enrich) {
      const latencyMs = Date.now() - startTime;

      logApiUsage({
        api_key_id: "",
        partner_id: auth.partner_id,
        endpoint: "/v1/ingest",
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
        source: input.source,
        request_id: randomUUID(),
        normalize_only: true,
        ...(warnings.length > 0 && { warnings }),
      });
    }

    if (events.length === 1) {
      const logistics = auth.is_sandbox
        ? generateSandboxLogisticsObject(events[0])
        : await runEnrichmentPipeline(
            { event: events[0], origin: input.origin },
            false
          );

      logApiUsage({
        api_key_id: "",
        partner_id: auth.partner_id,
        endpoint: "/v1/ingest",
        status_code: 200,
        latency_ms: Date.now() - startTime,
        event_count: 1,
        cached: false,
        normalize_only: false,
      }).catch(() => {});

      return reply.status(200).send({
        success: true,
        data: logistics,
        request_id: randomUUID(),
      });
    }

    const results = [];
    for (const event of events) {
      const logistics = auth.is_sandbox
        ? generateSandboxLogisticsObject(event)
        : await runEnrichmentPipeline(
            { event, origin: input.origin },
            false
          );
      results.push(logistics);
    }

    logApiUsage({
      api_key_id: "",
      partner_id: auth.partner_id,
      endpoint: "/v1/ingest",
      status_code: 200,
      latency_ms: Date.now() - startTime,
      event_count: events.length,
      cached: false,
      normalize_only: false,
    }).catch(() => {});

    return reply.status(200).send({
      success: true,
      data: results,
      event_count: results.length,
      request_id: randomUUID(),
      ...(warnings.length > 0 && { warnings }),
    });
  });
}
