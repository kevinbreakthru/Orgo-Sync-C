import type { Worker } from "bullmq";
import pino from "pino";

const logger = pino({ name: "graceful-shutdown" });

export function setupGracefulShutdown(workers: Worker[]) {
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info({ signal, workerCount: workers.length }, "Shutdown signal received, draining workers...");

    const timeout = setTimeout(() => {
      logger.error("Graceful shutdown timed out after 30s, forcing exit");
      process.exit(1);
    }, 30_000);

    try {
      await Promise.all(workers.map((w) => w.close()));
      logger.info("All workers closed cleanly");
    } catch (err) {
      logger.error({ err }, "Error during worker shutdown");
    }

    clearTimeout(timeout);
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
