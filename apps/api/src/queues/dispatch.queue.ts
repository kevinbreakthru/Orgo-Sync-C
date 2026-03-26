import { Queue } from "bullmq";
import { getQueueConnectionOpts } from "./connection.js";
import type { CanonicalEvent } from "@orgo-sync/schemas";

export const DISPATCH_QUEUE_NAME = "webhook-dispatch";

export interface DispatchJobData {
  delivery_id: string;
  subscription_id: string;
  endpoint_url: string;
  signing_secret: string;
  event_type: "event.created" | "event.updated" | "event.deleted";
  publisher: {
    partner_id: string;
    org_name: string;
  };
  data: CanonicalEvent | { external_id: string };
}

let queue: Queue | null = null;

function getDispatchQueue(): Queue {
  if (queue) return queue;
  queue = new Queue(DISPATCH_QUEUE_NAME, {
    connection: getQueueConnectionOpts(),
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: { age: 86400 },
      removeOnFail: { age: 604800 * 2 },
    },
  });
  return queue;
}

export async function enqueueDispatch(job: DispatchJobData): Promise<void> {
  const q = getDispatchQueue();
  await q.add(job.delivery_id, job, { jobId: job.delivery_id });
}

export async function enqueueDispatchBulk(jobs: DispatchJobData[]): Promise<void> {
  if (jobs.length === 0) return;
  const q = getDispatchQueue();
  await q.addBulk(
    jobs.map((j) => ({
      name: j.delivery_id,
      data: j,
      opts: { jobId: j.delivery_id },
    }))
  );
}

export { getDispatchQueue };
