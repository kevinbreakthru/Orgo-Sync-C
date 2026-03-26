import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getEnrichQueue } from "../../queues/enrich.queue.js";

const JOB_STATE_MAP: Record<string, string> = {
  completed: "completed",
  failed: "failed",
  active: "processing",
  waiting: "queued",
  delayed: "queued",
  "waiting-children": "queued",
  prioritized: "queued",
};

export async function registerEnrichStatusRoute(server: FastifyInstance) {
  server.get("/v1/enrich/:jobId", {
    schema: {
      tags: ["enrich"],
      description: "Poll the status of an async enrichment job",
      params: z.object({ jobId: z.string().uuid() }),
    },
  }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const queue = getEnrichQueue();

    const job = await queue.getJob(jobId);

    if (!job) {
      return reply.status(404).send({
        error: {
          code: "JOB_NOT_FOUND",
          message: `No enrichment job found with ID "${jobId}"`,
        },
      });
    }

    const state = await job.getState();
    const progress = typeof job.progress === "number" ? job.progress : 0;
    const totalEvents = job.data?.events?.length ?? 0;

    const response: Record<string, unknown> = {
      job_id: jobId,
      state: JOB_STATE_MAP[state] ?? "unknown",
      progress,
      total_events: totalEvents,
      completed_events: Math.round((progress / 100) * totalEvents),
    };

    if (state === "completed" && job.returnvalue) {
      response.result = job.returnvalue;
    }

    if (state === "failed") {
      response.error = job.failedReason ?? "Unknown failure";
    }

    return reply.status(200).send(response);
  });
}
