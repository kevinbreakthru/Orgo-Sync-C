import { getServiceClient } from "./supabase.js";

interface UsageEntry {
  api_key_id: string;
  partner_id: string;
  endpoint: string;
  status_code: number;
  latency_ms: number;
  event_count: number;
  cached: boolean;
  normalize_only?: boolean;
}

export async function logApiUsage(entry: UsageEntry): Promise<void> {
  const supabase = getServiceClient();
  await supabase.from("api_usage_log").insert({
    api_key_id: entry.api_key_id || undefined,
    partner_id: entry.partner_id,
    endpoint: entry.endpoint,
    status_code: entry.status_code,
    latency_ms: entry.latency_ms,
    event_count: entry.event_count,
    cached: entry.cached,
    normalize_only: entry.normalize_only ?? false,
  });
}
