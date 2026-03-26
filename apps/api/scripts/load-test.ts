import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const API_BASE =
  process.env.API_URL ?? "https://orgo-sync-production.up.railway.app";
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface RequestResult {
  status: number;
  latencyMs: number;
  ok: boolean;
  error?: string;
}

function makePayload(i: number) {
  const hour = 8 + (i % 12);
  return {
    title: `Load Test Game ${i}`,
    description: "Stress test event",
    start: `2026-04-10T${String(hour).padStart(2, "0")}:00:00-05:00`,
    end: `2026-04-10T${String(hour + 1).padStart(2, "0")}:30:00-05:00`,
    location: `${1000 + i} Test Field Rd, Austin, TX 78702`,
    timezone: "America/Chicago",
    sport: {
      event_type: "game",
      team_name: "Load Panthers",
      opponent_name: `Opponent ${i}`,
    },
  };
}

function makeBatchPayload(count: number) {
  return {
    events: Array.from({ length: count }, (_, i) => makePayload(i)),
    enrich: false,
  };
}

async function timedFetch(
  url: string,
  opts: RequestInit
): Promise<RequestResult> {
  const start = performance.now();
  try {
    const res = await fetch(url, opts);
    const latencyMs = Math.round(performance.now() - start);
    let error: string | undefined;
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      error = body.slice(0, 200);
    } else {
      await res.text();
    }
    return { status: res.status, latencyMs, ok: res.ok, error };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      status: 0,
      latencyMs,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function reportPhase(name: string, results: RequestResult[]) {
  const total = results.length;
  const successes = results.filter((r) => r.ok).length;
  const failures = total - successes;
  const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
  const rateLimited = results.filter((r) => r.status === 429).length;
  const serverErrors = results.filter(
    (r) => r.status >= 500 && r.status < 600
  ).length;
  const timeouts = results.filter((r) => r.status === 0).length;

  const avg = Math.round(latencies.reduce((s, l) => s + l, 0) / total);
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${name}`);
  console.log(`${"═".repeat(60)}`);
  console.log(`  Total requests:    ${total}`);
  console.log(
    `  Success:           ${successes} (${((successes / total) * 100).toFixed(1)}%)`
  );
  console.log(
    `  Failures:          ${failures} (${((failures / total) * 100).toFixed(1)}%)`
  );
  if (rateLimited > 0) console.log(`    └─ Rate limited: ${rateLimited}`);
  if (serverErrors > 0) console.log(`    └─ 5xx errors:   ${serverErrors}`);
  if (timeouts > 0) console.log(`    └─ Timeouts:     ${timeouts}`);
  console.log(`  ──────────────────────────────`);
  console.log(`  Latency (ms):`);
  console.log(`    Min:             ${min}ms`);
  console.log(`    Avg:             ${avg}ms`);
  console.log(`    p50:             ${p50}ms`);
  console.log(`    p95:             ${p95}ms`);
  console.log(`    p99:             ${p99}ms`);
  console.log(`    Max:             ${max}ms`);
  console.log(
    `  Throughput:        ${((total / (max / 1000)) || 0).toFixed(1)} req/s (wall-clock)`
  );

  const errorSamples = results.filter((r) => !r.ok).slice(0, 3);
  if (errorSamples.length > 0) {
    console.log(`  ──────────────────────────────`);
    console.log(`  Error samples:`);
    for (const e of errorSamples) {
      console.log(`    [${e.status}] ${e.error?.slice(0, 120)}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Phase runners                                                      */
/* ------------------------------------------------------------------ */

async function runConcurrentBatch(
  apiKey: string,
  endpoint: string,
  method: string,
  bodyFn: (i: number) => unknown,
  concurrency: number,
  total: number
): Promise<RequestResult[]> {
  const results: RequestResult[] = [];
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };

  let sent = 0;

  async function worker() {
    while (sent < total) {
      const i = sent++;
      const body = bodyFn(i);
      const opts: RequestInit = { method, headers };
      if (body) opts.body = JSON.stringify(body);
      const r = await timedFetch(`${API_BASE}${endpoint}`, opts);
      results.push(r);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, total) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}

/* ------------------------------------------------------------------ */
/*  Provision a load-test API key                                      */
/* ------------------------------------------------------------------ */

async function provisionLoadTestKey(): Promise<string> {
  const { data: partner } = await supabase
    .from("partners")
    .select("id")
    .eq("org_name", "Orgo Demo")
    .single();

  if (!partner) {
    console.error("No 'Orgo Demo' partner found in Supabase");
    process.exit(1);
  }

  const suffix = randomUUID().replace(/-/g, "").slice(0, 20);
  const rawKey = `sk_test_lt_${suffix}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12) + "...";

  const { data: existing } = await supabase
    .from("api_keys")
    .select("id")
    .eq("name", "load-test-runner")
    .is("revoked_at", null)
    .single();

  if (existing) {
    await supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", existing.id);
  }

  const { error } = await supabase.from("api_keys").insert({
    partner_id: partner.id,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    name: "load-test-runner",
    is_sandbox: true,
    rate_limit_per_minute: 300,
  });

  if (error) {
    console.error("Failed to provision load test key:", error.message);
    process.exit(1);
  }

  return rawKey;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log(`\n  Orgo Sync — Load Test Suite`);
  console.log(`  Target: ${API_BASE}`);
  console.log(`  Time:   ${new Date().toISOString()}\n`);

  // Provision a dedicated sandbox key with higher rate limit
  console.log("  Provisioning load-test API key...");
  const apiKey = await provisionLoadTestKey();
  console.log(`  Key:    ${apiKey.slice(0, 16)}...`);

  // ── Phase 0: Health check baseline ──
  console.log("\n  Running Phase 0: Health check warm-up...");
  const healthResults = await runConcurrentBatch(
    apiKey,
    "/health",
    "GET",
    () => null,
    5,
    20
  );
  reportPhase("Phase 0 — Health Check Baseline (20 reqs, 5 concurrent)", healthResults);

  // ── Phase 1: Light load — 10 concurrent enrich requests ──
  console.log("\n  Running Phase 1: Light sustained load...");
  const phase1 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => makePayload(i),
    10,
    50
  );
  reportPhase("Phase 1 — Light Load (50 reqs, 10 concurrent, /v1/enrich sandbox)", phase1);

  // ── Phase 2: Medium load — 25 concurrent ──
  console.log("\n  Running Phase 2: Medium sustained load...");
  const phase2 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => makePayload(i),
    25,
    100
  );
  reportPhase("Phase 2 — Medium Load (100 reqs, 25 concurrent, /v1/enrich sandbox)", phase2);

  // ── Phase 3: Heavy load — 50 concurrent ──
  console.log("\n  Running Phase 3: Heavy sustained load...");
  const phase3 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => makePayload(i),
    50,
    200
  );
  reportPhase("Phase 3 — Heavy Load (200 reqs, 50 concurrent, /v1/enrich sandbox)", phase3);

  // ── Phase 4: Normalize-only burst — lightweight path ──
  console.log("\n  Running Phase 4: Normalize-only burst...");
  const phase4 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => ({ ...makePayload(i), enrich: false }),
    50,
    200
  );
  reportPhase("Phase 4 — Normalize-Only Burst (200 reqs, 50 concurrent, enrich=false)", phase4);

  // ── Phase 5: Batch endpoint — 10 events per request ──
  console.log("\n  Running Phase 5: Batch normalize-only...");
  const phase5 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich/batch",
    "POST",
    () => makeBatchPayload(10),
    20,
    50
  );
  reportPhase("Phase 5 — Batch Normalize (50 reqs × 10 events, 20 concurrent)", phase5);

  // ── Phase 6: Spike test — 100 concurrent all at once ──
  console.log("\n  Running Phase 6: Spike test...");
  const phase6 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => makePayload(i),
    100,
    100
  );
  reportPhase("Phase 6 — Spike (100 reqs, 100 concurrent, instant burst)", phase6);

  // ── Phase 7: Rate limit verification ──
  console.log("\n  Running Phase 7: Rate limit verification...");
  const phase7 = await runConcurrentBatch(
    apiKey,
    "/v1/enrich",
    "POST",
    (i) => makePayload(i),
    100,
    400
  );
  const rateLimited7 = phase7.filter((r) => r.status === 429).length;
  reportPhase(
    `Phase 7 — Rate Limit Test (400 reqs, 100 concurrent, limit=300/min)`,
    phase7
  );
  if (rateLimited7 > 0) {
    console.log(`  ✓ Rate limiter engaged: ${rateLimited7} requests throttled`);
  } else {
    console.log(`  ⚠ Rate limiter did NOT engage — may need investigation`);
  }

  // ── Summary ──
  console.log(`\n${"═".repeat(60)}`);
  console.log("  LOAD TEST COMPLETE");
  console.log(`${"═".repeat(60)}`);

  const allResults = [
    ...healthResults,
    ...phase1,
    ...phase2,
    ...phase3,
    ...phase4,
    ...phase5,
    ...phase6,
    ...phase7,
  ];
  const totalReqs = allResults.length;
  const totalOk = allResults.filter((r) => r.ok).length;
  const totalRateLimited = allResults.filter((r) => r.status === 429).length;
  const total5xx = allResults.filter(
    (r) => r.status >= 500 && r.status < 600
  ).length;
  const totalTimeouts = allResults.filter((r) => r.status === 0).length;
  const allLatencies = allResults.map((r) => r.latencyMs).sort((a, b) => a - b);

  console.log(`  Total requests:     ${totalReqs}`);
  console.log(
    `  Success:            ${totalOk} (${((totalOk / totalReqs) * 100).toFixed(1)}%)`
  );
  console.log(`  Rate limited:       ${totalRateLimited}`);
  console.log(`  Server errors:      ${total5xx}`);
  console.log(`  Timeouts:           ${totalTimeouts}`);
  console.log(`  Global p50:         ${percentile(allLatencies, 50)}ms`);
  console.log(`  Global p95:         ${percentile(allLatencies, 95)}ms`);
  console.log(`  Global p99:         ${percentile(allLatencies, 99)}ms`);
  console.log("");

  // Cleanup: revoke the load test key
  await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("name", "load-test-runner")
    .is("revoked_at", null);
  console.log("  Load test key revoked.\n");
}

main().catch((err) => {
  console.error("Load test failed:", err);
  process.exit(1);
});
