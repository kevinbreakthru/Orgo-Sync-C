import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ENDPOINTS = [
  { path: "/v1/enrich", weight: 45 },
  { path: "/v1/ingest", weight: 35 },
  { path: "/v1/enrich/batch", weight: 15 },
  { path: "/v1/parse", weight: 5 },
];

function pickEndpoint(): string {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const ep of ENDPOINTS) {
    cumulative += ep.weight;
    if (roll < cumulative) return ep.path;
  }
  return ENDPOINTS[0].path;
}

function randomLatency(cached: boolean): number {
  if (cached) return Math.floor(Math.random() * 15) + 3;
  const spike = Math.random() < 0.08;
  if (spike) return Math.floor(Math.random() * 400) + 200;
  return Math.floor(Math.random() * 60) + 25;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // Look up the demo partner
  const { data: partner, error: partnerErr } = await supabase
    .from("partners")
    .select("id, org_name")
    .eq("org_name", "Orgo Demo")
    .single();

  if (partnerErr || !partner) {
    console.error("Could not find demo partner:", partnerErr?.message);
    process.exit(1);
  }

  console.log(`Found partner: ${partner.org_name} (${partner.id})`);

  // Find an API key for this partner
  const { data: apiKey, error: keyErr } = await supabase
    .from("api_keys")
    .select("id")
    .eq("partner_id", partner.id)
    .is("revoked_at", null)
    .limit(1)
    .single();

  if (keyErr || !apiKey) {
    console.error("Could not find an active API key:", keyErr?.message);
    process.exit(1);
  }

  console.log(`Using API key: ${apiKey.id}`);

  // Clear existing seed data to avoid duplicates
  const { count: existingCount } = await supabase
    .from("api_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", partner.id);

  if (existingCount && existingCount > 50) {
    console.log(`Clearing ${existingCount} existing rows...`);
    await supabase
      .from("api_usage_log")
      .delete()
      .eq("partner_id", partner.id);
  }

  const rows: Array<Record<string, unknown>> = [];
  const now = new Date();

  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const day = new Date(now);
    day.setDate(day.getDate() - daysAgo);
    day.setHours(0, 0, 0, 0);

    // Weekdays get more traffic than weekends
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const baseRequests = isWeekend ? randomBetween(8, 18) : randomBetween(20, 45);

    // Trend upward over the 14 days (organic growth)
    const growthMultiplier = 1 + (14 - daysAgo) * 0.04;
    const requestCount = Math.round(baseRequests * growthMultiplier);

    for (let i = 0; i < requestCount; i++) {
      const hour = randomBetween(8, 22);
      const minute = randomBetween(0, 59);
      const second = randomBetween(0, 59);

      const timestamp = new Date(day);
      timestamp.setHours(hour, minute, second);

      const endpoint = pickEndpoint();
      const cached = Math.random() < 0.4;
      const latency = randomLatency(cached);

      const isBatch = endpoint === "/v1/enrich/batch";
      const eventCount = isBatch ? randomBetween(3, 12) : 1;

      const isError = Math.random() < 0.03;
      const statusCode = isError ? (Math.random() < 0.5 ? 400 : 429) : 200;

      rows.push({
        api_key_id: apiKey.id,
        partner_id: partner.id,
        endpoint,
        status_code: statusCode,
        latency_ms: latency,
        event_count: eventCount,
        cached,
        created_at: timestamp.toISOString(),
      });
    }
  }

  // Insert in batches of 200
  const BATCH_SIZE = 200;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error: insertErr } = await supabase
      .from("api_usage_log")
      .insert(batch);
    if (insertErr) {
      console.error(`Batch insert failed at row ${i}:`, insertErr.message);
      process.exit(1);
    }
    inserted += batch.length;
  }

  console.log(`\nSeeded ${inserted} usage log entries across 14 days.`);

  // Summary
  const cachedCount = rows.filter((r) => r.cached).length;
  const billableCount = rows.filter((r) => !r.cached).length;
  const avgLatency = Math.round(
    rows.reduce((sum, r) => sum + (r.latency_ms as number), 0) / rows.length
  );
  const errorCount = rows.filter((r) => (r.status_code as number) >= 400).length;

  console.log(`  Total:    ${inserted}`);
  console.log(`  Billable: ${billableCount} (${Math.round((billableCount / inserted) * 100)}%)`);
  console.log(`  Cached:   ${cachedCount} (${Math.round((cachedCount / inserted) * 100)}%)`);
  console.log(`  Errors:   ${errorCount}`);
  console.log(`  Avg ms:   ${avgLatency}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
