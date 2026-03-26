import { Worker, type Job } from "bullmq";
import { createHmac } from "node:crypto";
import pino from "pino";
import { getQueueConnectionOpts } from "../queues/connection.js";
import { DISPATCH_QUEUE_NAME, type DispatchJobData } from "../queues/dispatch.queue.js";
import { getServiceClient } from "../lib/supabase.js";

const logger = pino({ name: "dispatch-worker" });

const DELIVERY_TIMEOUT_MS = 10_000;
const CIRCUIT_BREAKER_THRESHOLD = 10;

async function processDispatch(job: Job<DispatchJobData>): Promise<void> {
  const {
    delivery_id,
    subscription_id,
    endpoint_url,
    signing_secret,
    event_type,
    publisher,
    data,
  } = job.data;

  const body = JSON.stringify({
    event_type,
    delivery_id,
    subscription_id,
    publisher,
    data,
    timestamp: new Date().toISOString(),
  });

  const signature = createHmac("sha256", signing_secret)
    .update(body)
    .digest("hex");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  try {
    const res = await fetch(endpoint_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Orgo-Signature": `sha256=${signature}`,
        "X-Orgo-Delivery-Id": delivery_id,
        "X-Orgo-Event-Type": event_type,
        "User-Agent": "OrgoSync-Webhook/1.0",
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      await recordDelivery(delivery_id, subscription_id, event_type, "delivered", job.attemptsMade + 1, res.status, null, body.length);
      await resetFailureCount(subscription_id);
      logger.info({ delivery_id, subscription_id, status: res.status }, "Webhook delivered");
      return;
    }

    const errorBody = await res.text().catch(() => "");
    const errorMsg = `HTTP ${res.status}: ${errorBody.slice(0, 200)}`;

    if (isLastAttempt(job)) {
      await recordDelivery(delivery_id, subscription_id, event_type, "exhausted", job.attemptsMade + 1, res.status, errorMsg, body.length);
      await incrementFailureCount(subscription_id);
      logger.error({ delivery_id, subscription_id, status: res.status }, "Webhook exhausted all retries");
      return;
    }

    logger.warn({ delivery_id, subscription_id, status: res.status, attempt: job.attemptsMade + 1 }, "Webhook delivery failed, will retry");
    throw new Error(errorMsg);
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof Error && err.name === "AbortError") {
      const errorMsg = `Timeout after ${DELIVERY_TIMEOUT_MS}ms`;
      if (isLastAttempt(job)) {
        await recordDelivery(delivery_id, subscription_id, event_type, "exhausted", job.attemptsMade + 1, null, errorMsg, body.length);
        await incrementFailureCount(subscription_id);
        logger.error({ delivery_id, subscription_id }, "Webhook timed out, exhausted");
        return;
      }
      logger.warn({ delivery_id, subscription_id, attempt: job.attemptsMade + 1 }, "Webhook timed out, will retry");
      throw new Error(errorMsg);
    }

    if (isLastAttempt(job)) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      await recordDelivery(delivery_id, subscription_id, event_type, "exhausted", job.attemptsMade + 1, null, errorMsg, body.length);
      await incrementFailureCount(subscription_id);
    }

    throw err;
  }
}

function isLastAttempt(job: Job): boolean {
  const maxAttempts = job.opts?.attempts ?? 5;
  return job.attemptsMade + 1 >= maxAttempts;
}

async function recordDelivery(
  deliveryId: string,
  subscriptionId: string,
  eventType: string,
  status: string,
  attempts: number,
  statusCode: number | null,
  error: string | null,
  payloadSize: number,
): Promise<void> {
  try {
    const supabase = getServiceClient();
    await supabase.from("webhook_deliveries").upsert({
      delivery_id: deliveryId,
      subscription_id: subscriptionId,
      event_type: eventType,
      status,
      attempts,
      last_status_code: statusCode,
      last_error: error,
      payload_size_bytes: payloadSize,
      ...(status === "delivered" && { delivered_at: new Date().toISOString() }),
    }, { onConflict: "delivery_id" });
  } catch (err) {
    logger.error({ deliveryId, err }, "Failed to record delivery log");
  }
}

async function resetFailureCount(subscriptionId: string): Promise<void> {
  try {
    const supabase = getServiceClient();
    await supabase
      .from("webhook_subscriptions")
      .update({ failure_count: 0 })
      .eq("id", subscriptionId);
  } catch (err) {
    logger.error({ subscriptionId, err }, "Failed to reset failure count");
  }
}

async function incrementFailureCount(subscriptionId: string): Promise<void> {
  try {
    const supabase = getServiceClient();

    const { data } = await supabase
      .from("webhook_subscriptions")
      .select("failure_count")
      .eq("id", subscriptionId)
      .single();

    const newCount = (data?.failure_count ?? 0) + 1;
    const updates: Record<string, unknown> = { failure_count: newCount };

    if (newCount >= CIRCUIT_BREAKER_THRESHOLD) {
      updates.disabled_at = new Date().toISOString();
      updates.is_active = false;
      logger.warn({ subscriptionId, failureCount: newCount }, "Circuit breaker tripped — subscription disabled");
    }

    await supabase
      .from("webhook_subscriptions")
      .update(updates)
      .eq("id", subscriptionId);
  } catch (err) {
    logger.error({ subscriptionId, err }, "Failed to increment failure count");
  }
}

export function startDispatchWorker(): Worker {
  const worker = new Worker<DispatchJobData>(
    DISPATCH_QUEUE_NAME,
    processDispatch,
    {
      connection: getQueueConnectionOpts(),
      concurrency: 10,
    }
  );

  worker.on("completed", (job) => {
    logger.debug({ deliveryId: job.data.delivery_id }, "Dispatch job completed");
  });

  worker.on("failed", (job, err) => {
    logger.error({ deliveryId: job?.data?.delivery_id, error: err.message }, "Dispatch job failed");
  });

  worker.on("stalled", (jobId) => {
    logger.warn({ jobId }, "Dispatch job stalled — will be retried");
  });

  return worker;
}
