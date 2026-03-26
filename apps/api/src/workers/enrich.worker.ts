import { Worker, type Job } from "bullmq";
import { randomUUID, createHmac } from "node:crypto";
import pino from "pino";
import type { CanonicalEvent, LogisticsObject } from "@orgo-sync/schemas";
import { getQueueConnectionOpts } from "../queues/connection.js";
import { ENRICHMENT_QUEUE_NAME, type EnrichmentJobData } from "../queues/enrich.queue.js";
import { runEnrichmentPipeline } from "../pipeline/enrichment-pipeline.js";
import { generateSandboxLogisticsObject } from "../pipeline/sandbox-mock.js";

const logger = pino({ name: "enrich-worker" });

function toCanonicalEvent(input: EnrichmentJobData["events"][number]): CanonicalEvent {
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

async function processBatchEnrichment(job: Job<EnrichmentJobData>): Promise<LogisticsObject[]> {
  const { events, origin, isSandbox, jobId } = job.data;
  const results: LogisticsObject[] = [];

  logger.info({ jobId, eventCount: events.length, isSandbox }, "Processing batch enrichment");

  for (let i = 0; i < events.length; i++) {
    const canonicalEvent = toCanonicalEvent(events[i]);

    const logistics = isSandbox
      ? generateSandboxLogisticsObject(canonicalEvent)
      : await runEnrichmentPipeline({ event: canonicalEvent, origin }, false);

    results.push(logistics);

    const progress = Math.round(((i + 1) / events.length) * 100);
    await job.updateProgress(progress);

    logger.debug({ jobId, event: i + 1, total: events.length, progress }, "Event enriched");
  }

  logger.info({ jobId, resultCount: results.length }, "Batch enrichment complete");

  if (job.data.webhookUrl) {
    await deliverWebhook(job.data.webhookUrl, jobId, results);
  }

  return results;
}

async function deliverWebhook(
  url: string,
  jobId: string,
  results: LogisticsObject[]
): Promise<void> {
  const body = JSON.stringify({
    job_id: jobId,
    status: "completed",
    total_events: results.length,
    results,
    delivered_at: new Date().toISOString(),
  });

  const signature = createHmac("sha256", jobId).update(body).digest("hex");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Orgo-Signature": signature,
        "X-Orgo-Job-Id": jobId,
      },
      body,
    });
    logger.info({ jobId, webhookUrl: url, status: res.status }, "Webhook delivered");
  } catch (err) {
    logger.error({ jobId, webhookUrl: url, err }, "Webhook delivery failed");
  }
}

export function startEnrichWorker(): Worker {
  const worker = new Worker<EnrichmentJobData, LogisticsObject[]>(
    ENRICHMENT_QUEUE_NAME,
    processBatchEnrichment,
    {
      connection: getQueueConnectionOpts(),
      concurrency: 3,
    }
  );

  worker.on("completed", (job) => {
    logger.info({ jobId: job.data.jobId, events: job.data.events.length }, "Job completed");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.data?.jobId, error: err.message }, "Job failed");
  });

  worker.on("stalled", (jobId) => {
    logger.warn({ jobId }, "Job stalled — will be retried");
  });

  return worker;
}
