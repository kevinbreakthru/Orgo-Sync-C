import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { createHash } from "node:crypto";
import { getRedis } from "../lib/redis.js";
import { getServiceClient } from "../lib/supabase.js";

interface AuthCacheEntry {
  partner_id: string;
  rate_limit_per_minute: number;
  is_sandbox: boolean;
  tier: string;
  partner_type: string;
}

const AUTH_CACHE_TTL_SECONDS = 300;
const UNPROTECTED_ROUTES = new Set(["/health", "/documentation/json"]);

function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

async function resolveApiKey(
  keyHash: string
): Promise<AuthCacheEntry | null> {
  const redis = getRedis();
  const cacheKey = `auth:${keyHash}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached) as AuthCacheEntry;

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("partner_id, is_sandbox, rate_limit_per_minute, partners(tier, partner_type)")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .single();

  if (error || !data) return null;

  const partnerData = data.partners as unknown as { tier: string; partner_type: string } | null;

  const entry: AuthCacheEntry = {
    partner_id: data.partner_id,
    rate_limit_per_minute: data.rate_limit_per_minute,
    is_sandbox: data.is_sandbox,
    tier: partnerData?.tier ?? "sandbox",
    partner_type: partnerData?.partner_type ?? "platform",
  };

  await redis.set(cacheKey, JSON.stringify(entry), "EX", AUTH_CACHE_TTL_SECONDS);

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", keyHash);

  return entry;
}

async function authenticateRequest(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (UNPROTECTED_ROUTES.has(request.url)) return;
  if (request.url.startsWith("/documentation")) return;
  if (request.url.match(/^\/v1\/feeds\/[^/]+(\.ics)?$/)) return;

  const apiKey = request.headers["x-api-key"] as string | undefined;
  if (!apiKey) {
    return reply.status(401).send({
      error: {
        code: "MISSING_API_KEY",
        message: "X-API-Key header is required",
      },
    });
  }

  const keyHash = hashApiKey(apiKey);
  const auth = await resolveApiKey(keyHash);

  if (!auth) {
    return reply.status(401).send({
      error: {
        code: "INVALID_API_KEY",
        message: "The provided API key is invalid or has been revoked",
      },
    });
  }

  request.partnerAuth = auth;
}

declare module "fastify" {
  interface FastifyRequest {
    partnerAuth?: AuthCacheEntry;
  }
}

export async function registerApiKeyAuth(server: FastifyInstance) {
  server.register(fp(async (instance) => {
    instance.addHook("onRequest", authenticateRequest);
  }));
}
