import { Activity, Clock, Webhook, TrendingUp, DollarSign } from "lucide-react";

interface UsageStatsProps {
  totalRequests: number;
  billableCount: number;
  avgLatency: number;
  webhooksDelivered: number;
  grossRevenue: number;
  partnerEarnings: number;
  revSharePct: number;
  ratePerEvent: number;
}

export function UsageStats({
  totalRequests,
  billableCount,
  avgLatency,
  webhooksDelivered,
  grossRevenue,
  partnerEarnings,
  revSharePct,
  ratePerEvent,
}: UsageStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Requests</span>
          <div className="rounded-full bg-brand-500/10 p-2">
            <Activity size={14} className="text-brand-500" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-white tabular-nums">
          {totalRequests.toLocaleString()}
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Billable</span>
          <div className="rounded-full bg-brand-500/10 p-2">
            <TrendingUp size={14} className="text-brand-500" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-white tabular-nums">
          {billableCount.toLocaleString()}
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Avg Latency</span>
          <div className="rounded-full bg-brand-500/10 p-2">
            <Clock size={14} className="text-brand-500" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-white tabular-nums">
          {avgLatency}ms
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Webhooks Sent</span>
          <div className="rounded-full bg-brand-500/10 p-2">
            <Webhook size={14} className="text-brand-500" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-white tabular-nums">
          {webhooksDelivered.toLocaleString()}
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Gross Revenue</span>
          <div className="rounded-full bg-green-500/10 p-2">
            <DollarSign size={14} className="text-green-400" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-white tabular-nums">
          ${grossRevenue.toFixed(2)}
        </div>
        <div className="mt-1 text-caption text-neutral-500">${ratePerEvent}/event</div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-overline text-neutral-400">Rev Share</span>
          <div className="rounded-full bg-green-500/10 p-2">
            <TrendingUp size={14} className="text-green-400" strokeWidth={1.75} />
          </div>
        </div>
        <div className="text-heading-1 text-green-400 tabular-nums">
          ${partnerEarnings.toFixed(2)}
        </div>
        <div className="mt-1 text-caption text-neutral-500">{revSharePct}% of gross</div>
      </div>
    </div>
  );
}
