import type { ConnectionOptions } from "bullmq";
import { loadEnv } from "../config/env.js";

let cached: ConnectionOptions | null = null;

export function getQueueConnectionOpts(): ConnectionOptions {
  if (cached) return cached;
  const env = loadEnv();
  const url = new URL(env.REDIS_URL);

  cached = {
    host: url.hostname,
    port: parseInt(url.port || "6379", 10),
    password: url.password || undefined,
    username: url.username !== "default" ? url.username : undefined,
    maxRetriesPerRequest: null,
  };
  return cached;
}
