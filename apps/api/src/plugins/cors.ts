import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { loadEnv } from "../config/env.js";

export async function registerCors(server: FastifyInstance) {
  const env = loadEnv();
  await server.register(cors, {
    origin: [env.PORTAL_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
    credentials: true,
  });
}
