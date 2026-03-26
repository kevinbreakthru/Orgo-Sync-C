import swagger from "@fastify/swagger";
import type { FastifyInstance } from "fastify";

export async function registerSwagger(server: FastifyInstance) {
  await server.register(swagger, {
    openapi: {
      info: {
        title: "Orgo Sync API",
        description: "Scheduling Intelligence API — Enrich any sports event with logistics, weather, and conflict data.",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-Key",
          },
        },
      },
      security: [{ ApiKeyAuth: [] }],
      tags: [
        { name: "health", description: "Service health" },
        { name: "enrich", description: "Event enrichment" },
        { name: "ingest", description: "Native data ingestion" },
        { name: "parse", description: "ICS parsing" },
      ],
    },
  });
}
