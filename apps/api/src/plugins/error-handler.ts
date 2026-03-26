import type { FastifyInstance, FastifyError } from "fastify";
import { ZodError } from "zod";

export async function registerErrorHandler(server: FastifyInstance) {
  server.setErrorHandler((rawError: FastifyError | Error, _request, reply) => {
    if (rawError instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: rawError.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }

    const error = rawError as FastifyError;

    const isRateLimited =
      error.statusCode === 429 ||
      reply.statusCode === 429 ||
      error.code === "FST_ERR_RATE_LIMIT_EXCEEDED";

    if (isRateLimited) {
      return reply.status(429).send({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: error.message || "Too many requests. Check Retry-After header.",
        },
      });
    }

    const statusCode = error.statusCode ?? reply.statusCode ?? 500;
    const isInternal = statusCode >= 500;

    if (isInternal) {
      server.log.error(error, "Unhandled server error");
    }

    return reply.status(statusCode).send({
      error: {
        code: isInternal ? "INTERNAL_ERROR" : error.code ?? "REQUEST_ERROR",
        message: isInternal
          ? "An unexpected error occurred"
          : error.message,
      },
    });
  });
}
