import type { FastifyInstance } from "fastify";
import { z } from "zod";

const HealthResponseSchema = z.object({
  status: z.string(),
  version: z.string(),
  uptime: z.number(),
});

export async function registerHealthRoute(server: FastifyInstance) {
  server.get("/health", {
    schema: {
      tags: ["health"],
      description: "Service health check",
      response: { 200: HealthResponseSchema },
    },
  }, async () => {
    return {
      status: "healthy",
      version: "1.0.0",
      uptime: process.uptime(),
    };
  });
}
