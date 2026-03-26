import { createServer } from "node:http";
import pino from "pino";
import { loadEnv } from "./config/env.js";
import { startEnrichWorker } from "./workers/enrich.worker.js";
import { startDispatchWorker } from "./workers/dispatch.worker.js";
import { setupGracefulShutdown } from "./workers/shared/graceful-shutdown.js";
import { ENRICHMENT_QUEUE_NAME } from "./queues/enrich.queue.js";
import { DISPATCH_QUEUE_NAME } from "./queues/dispatch.queue.js";

const env = loadEnv();
const logger = pino({ level: env.LOG_LEVEL, name: "worker-main" });

logger.info("Worker service initializing...");

const enrichWorker = startEnrichWorker();
const dispatchWorker = startDispatchWorker();
setupGracefulShutdown([enrichWorker, dispatchWorker]);

logger.info(
  { queues: [ENRICHMENT_QUEUE_NAME, DISPATCH_QUEUE_NAME], env: env.NODE_ENV },
  "Workers attached to Redis and awaiting jobs"
);

const HEALTH_PORT = parseInt(process.env.PORT || "3002", 10);
const healthServer = createServer((_req, res) => {
  const enrichRunning = enrichWorker.isRunning();
  const dispatchRunning = dispatchWorker.isRunning();
  const allHealthy = enrichRunning && dispatchRunning;
  res.writeHead(allHealthy ? 200 : 503, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: allHealthy ? "healthy" : "degraded",
    service: "orgo-sync-worker",
    queues: {
      [ENRICHMENT_QUEUE_NAME]: enrichRunning ? "running" : "stopped",
      [DISPATCH_QUEUE_NAME]: dispatchRunning ? "running" : "stopped",
    },
    uptime: process.uptime(),
  }));
});

healthServer.listen(HEALTH_PORT, "0.0.0.0", () => {
  logger.info({ port: HEALTH_PORT }, "Worker health check listening");
});
