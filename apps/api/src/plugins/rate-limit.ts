import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { getRedis } from "../lib/redis.js";

export async function registerRateLimit(server: FastifyInstance) {
  await server.register(rateLimit, {
    global: true,
    max: (request) => {
      return request.partnerAuth?.rate_limit_per_minute ?? 60;
    },
    timeWindow: "1 minute",
    redis: getRedis(),
    keyGenerator: (request) => {
      const apiKey = request.headers["x-api-key"] as string | undefined;
      return apiKey ?? request.ip;
    },
    errorResponseBuilder: (_request, context) => ({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: `Rate limit exceeded. Retry in ${Math.ceil(context.ttl / 1000)} seconds.`,
      },
    }),
  });
}
