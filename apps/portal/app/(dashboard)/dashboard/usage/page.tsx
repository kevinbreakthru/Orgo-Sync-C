import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { PageHeader } from "../../../../components/shared/page-header";
import { UsageStats } from "../../../../components/dashboard/usage-stats";
import UsageChartsLoader from "../../../../components/dashboard/usage-charts-loader";

interface UsageRow {
  id: number;
  endpoint: string;
  status_code: number;
  latency_ms: number;
  event_count: number;
  cached: boolean;
  created_at: string;
}

export interface DailyAggregate {
  date: string;
  label: string;
  total: number;
  billable: number;
  cached: number;
  avgLatency: number;
  errors: number;
}

function aggregateByDay(rows: UsageRow[]): DailyAggregate[] {
  const buckets = new Map<
    string,
    { total: number; billable: number; cached: number; latencySum: number; errors: number }
  >();

  for (const row of rows) {
    const date = row.created_at.slice(0, 10);
    const bucket = buckets.get(date) ?? { total: 0, billable: 0, cached: 0, latencySum: 0, errors: 0 };
    bucket.total++;
    if (row.cached) bucket.cached++;
    else bucket.billable++;
    bucket.latencySum += row.latency_ms;
    if (row.status_code >= 400) bucket.errors++;
    buckets.set(date, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, b]) => ({
      date,
      label: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: b.total,
      billable: b.billable,
      cached: b.cached,
      avgLatency: Math.round(b.latencySum / b.total),
      errors: b.errors,
    }));
}

export default async function UsageAnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: partner } = await supabase
    .from("partners")
    .select("id, rev_share_pct, tier, billing_model")
    .eq("user_id", user!.id)
    .single();

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: rawRows, count: totalAllTime } = await supabase
    .from("api_usage_log")
    .select("*", { count: "exact" })
    .eq("partner_id", partner?.id ?? "")
    .gte("created_at", fourteenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  const rows = (rawRows ?? []) as UsageRow[];
  const dailyData = aggregateByDay(rows);

  const totalRequests = rows.length;
  const avgLatency = totalRequests > 0
    ? Math.round(rows.reduce((s, r) => s + r.latency_ms, 0) / totalRequests)
    : 0;
  const cachedCount = rows.filter((r) => r.cached).length;
  const billableCount = totalRequests - cachedCount;

  // TODO: Replace with actual COUNT from webhook_deliveries table once delivery volume is meaningful
  const { count: webhooksDelivered } = await supabase
    .from("webhook_deliveries")
    .select("*", { count: "exact", head: true })
    .eq("status", "delivered");

  const RATE_PER_EVENT = 0.012;
  const revSharePct = Number(partner?.rev_share_pct ?? 0);
  const grossRevenue = billableCount * RATE_PER_EVENT;
  const partnerEarnings = grossRevenue * (revSharePct / 100);

  return (
    <div>
      <PageHeader
        title="Usage Analytics"
        description="Monitor API throughput, latency, and webhook delivery over the last 14 days."
      />

      <UsageStats
        totalRequests={totalRequests}
        billableCount={billableCount}
        avgLatency={avgLatency}
        webhooksDelivered={webhooksDelivered ?? 0}
        grossRevenue={grossRevenue}
        partnerEarnings={partnerEarnings}
        revSharePct={revSharePct}
        ratePerEvent={RATE_PER_EVENT}
      />

      <UsageChartsLoader data={dailyData} revSharePct={revSharePct} ratePerEvent={RATE_PER_EVENT} />

      <h2 className="text-heading-3 mt-8 mb-4">Recent Requests</h2>
      {rows.length === 0 ? (
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-8 text-center text-neutral-500">
          No API requests yet. Use the Playground to make your first call.
        </div>
      ) : (
        <div className="dark-card rounded-2xl border border-neutral-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Endpoint</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Latency</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Events</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Cached</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(-30).reverse().map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-neutral-300 text-xs">{row.endpoint}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                        row.status_code < 400
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {row.status_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{row.latency_ms}ms</td>
                    <td className="px-4 py-3 text-neutral-400">{row.event_count}</td>
                    <td className="px-4 py-3">
                      {row.cached ? (
                        <span className="text-caption text-brand-400">cached</span>
                      ) : (
                        <span className="text-caption text-neutral-500">fresh</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
