import Redis from "ioredis";
import { loadEnv } from "../config/env.js";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (redis) return redis;
  const env = loadEnv();
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },
  });
  return redis;
}
