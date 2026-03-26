import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const API_BASE = "https://orgo-sync-production.up.railway.app";
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: partner } = await sb
    .from("partners")
    .select("id")
    .eq("org_name", "Orgo Demo")
    .single();

  if (!partner) {
    console.error("No partner found");
    process.exit(1);
  }

  await sb
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("name", "e2e-batch-test")
    .is("revoked_at", null);

  const rawKey = `sk_test_e2e_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  await sb.from("api_keys").insert({
    partner_id: partner.id,
    key_hash: keyHash,
    key_prefix: rawKey.slice(0, 12) + "...",
    name: "e2e-batch-test",
    is_sandbox: true,
    rate_limit_per_minute: 100,
  });

  console.log(`API key: ${rawKey.slice(0, 16)}...`);

  console.log("\n1) Submitting batch job (3 events)...");
  const res = await fetch(`${API_BASE}/v1/enrich/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": rawKey },
    body: JSON.stringify({
      events: [
        {
          title: "E2E Game 1",
          start: "2026-04-10T10:00:00-05:00",
          end: "2026-04-10T11:30:00-05:00",
          location: "123 Test Rd, Austin TX",
        },
        {
          title: "E2E Game 2",
          start: "2026-04-10T14:00:00-05:00",
          end: "2026-04-10T15:30:00-05:00",
          location: "456 Demo Ave, Austin TX",
        },
        {
          title: "E2E Game 3",
          start: "2026-04-11T09:00:00-05:00",
          end: "2026-04-11T10:00:00-05:00",
          location: "789 Field Blvd, Austin TX",
        },
      ],
    }),
  });

  const enqueueResult = await res.json();
  console.log(
    `   Status: ${res.status} | Job ID: ${enqueueResult.job_id} | Events: ${enqueueResult.total_events}`
  );

  const jobId = enqueueResult.job_id;
  if (!jobId) {
    console.error("No job_id returned");
    process.exit(1);
  }

  console.log("\n2) Polling for completion...");
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`${API_BASE}/v1/enrich/${jobId}`, {
      headers: { "X-API-Key": rawKey },
    });
    const status = await statusRes.json();
    const state = status.state;
    const progress = status.progress;
    console.log(`   Poll ${i + 1}: state=${state} progress=${progress}%`);

    if (state === "completed") {
      console.log("\n3) Job completed successfully!");
      console.log(`   Results: ${status.result?.length ?? 0} logistics objects`);
      if (status.result?.[0]) {
        const first = status.result[0];
        console.log(`   Sample: "${first.event.title}" → status=${first.enrichment.status}, sandbox=${first.sandbox}`);
      }
      break;
    }
    if (state === "failed") {
      console.log("\n3) Job FAILED:", status.error);
      break;
    }
  }

  await sb
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("name", "e2e-batch-test")
    .is("revoked_at", null);
  console.log("\nE2E key revoked. Test complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
