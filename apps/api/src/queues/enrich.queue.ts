import { Queue } from "bullmq";
import { getQueueConnectionOpts } from "./connection.js";
import type { EnrichRequest } from "@orgo-sync/schemas";

export const ENRICHMENT_QUEUE_NAME = "enrichment-pipeline";

export interface EnrichmentJobData {
  jobId: string;
  events: EnrichRequest[];
  origin?: { address?: string; coordinates?: { lat: number; lng: number } };
  webhookUrl?: string;
  partnerId: string;
  isSandbox: boolean;
}

let queue: Queue | null = null;

function getEnrichQueue(): Queue {
  if (queue) return queue;
  queue = new Queue(ENRICHMENT_QUEUE_NAME, {
    connection: getQueueConnectionOpts(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { age: 86400 },
      removeOnFail: { age: 604800 },
    },
  });
  return queue;
}

export async function enqueueBatchEnrichment(
  jobId: string,
  events: EnrichRequest[],
  opts: {
    origin?: EnrichmentJobData["origin"];
    webhookUrl?: string;
    partnerId: string;
    isSandbox: boolean;
  }
): Promise<void> {
  const q = getEnrichQueue();
  await q.add(jobId, {
    jobId,
    events,
    origin: opts.origin,
    webhookUrl: opts.webhookUrl,
    partnerId: opts.partnerId,
    isSandbox: opts.isSandbox,
  } satisfies EnrichmentJobData, { jobId });
}

export { getEnrichQueue };
