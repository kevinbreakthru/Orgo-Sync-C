import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadEnv } from "../config/env.js";

let client: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (client) return client;
  const env = loadEnv();
  client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  return client;
}
