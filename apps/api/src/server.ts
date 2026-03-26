import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { loadEnv } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { registerSwagger } from "./plugins/swagger.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerApiKeyAuth } from "./plugins/api-key-auth.js";
import { registerRateLimit } from "./plugins/rate-limit.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerParseRoute } from "./routes/v1/parse.js";
import { registerEnrichRoute } from "./routes/v1/enrich.js";
import { registerIngestRoute } from "./routes/v1/ingest.js";
import { registerEnrichBatchRoute } from "./routes/v1/enrich-batch.js";
import { registerEnrichStatusRoute } from "./routes/v1/enrich-status.js";
import { registerFeedRoutes } from "./routes/v1/feeds.js";
import { registerPublishRoute } from "./routes/v1/publish.js";
import { registerSubscriptionRoutes } from "./routes/v1/subscriptions.js";

const env = loadEnv();

const server = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === "development" && {
      transport: { target: "pino-pretty" },
    }),
  },
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

await registerCors(server);
await registerSwagger(server);
await registerErrorHandler(server);
await registerApiKeyAuth(server);
await registerRateLimit(server);

await registerHealthRoute(server);
await registerParseRoute(server);
await registerEnrichRoute(server);
await registerIngestRoute(server);
await registerEnrichBatchRoute(server);
await registerEnrichStatusRoute(server);
await registerFeedRoutes(server);
await registerPublishRoute(server);
await registerSubscriptionRoutes(server);

await server.ready();

const address = await server.listen({ port: env.PORT, host: "0.0.0.0" });
server.log.info(`Orgo Sync API running at ${address}`);
