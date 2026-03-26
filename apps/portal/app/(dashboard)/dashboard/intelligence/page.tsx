import { PageHeader } from "../../../../components/shared/page-header";
import { Lock, TrendingUp, AlertTriangle, Users } from "lucide-react";

const CAPABILITIES = [
  {
    title: "Demand Forecasting",
    description: "Predict registrations and facility demand based on historical scheduling patterns across connected platforms.",
    icon: TrendingUp,
  },
  {
    title: "Conflict Detection",
    description: "Automatically flag scheduling overlaps, double-bookings, and venue conflicts across multi-platform environments.",
    icon: AlertTriangle,
  },
  {
    title: "Participation Trends",
    description: "Surface insights on athlete retention, seasonal engagement, and program growth from aggregated scheduling data.",
    icon: Users,
  },
];

export default function IntelligenceEnginePage() {
  return (
    <div>
      <PageHeader
        title="Intelligence Engine"
        description="AI-powered insights from your scheduling data."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-400 tracking-wide">
          Coming Soon
        </span>
      </PageHeader>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 mb-8">
        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
          The Intelligence Engine transforms raw scheduling data flowing through Orgo Sync into
          actionable business intelligence. As a Platform, you&apos;ll unlock predictive analytics
          and anomaly detection that only become possible when scheduling data is standardized
          and centralized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="dark-card rounded-2xl border border-neutral-800/60 p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/50 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="rounded-full bg-brand-500/10 p-2.5">
                    <Icon size={18} className="text-brand-500" strokeWidth={1.75} />
                  </div>
                  <div className="rounded-full bg-neutral-800 p-2">
                    <Lock size={12} className="text-neutral-500" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-heading-4 text-white mb-2">{cap.title}</h3>
                <p className="text-body-sm text-neutral-400 leading-relaxed mb-5">
                  {cap.description}
                </p>

                {/* Blurred placeholder chart */}
                <div className="rounded-xl bg-neutral-800/50 p-4 filter blur-[2px] select-none pointer-events-none">
                  <div className="flex items-end gap-1 h-16">
                    {[35, 50, 40, 65, 55, 75, 60, 80, 70, 90, 85, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-brand-500/30"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
