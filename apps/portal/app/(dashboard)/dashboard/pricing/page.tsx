import { PageHeader } from "../../../../components/shared/page-header";
import { Check, Minus, Zap, Building2, Rocket } from "lucide-react";

const TIERS = [
  {
    name: "Sandbox",
    price: "Free",
    period: "",
    description: "Test schema translation and routing with mock data",
    icon: Zap,
    highlight: false,
    features: [
      { name: "API calls", value: "1,000 / mo" },
      { name: "Events routed", value: "1,000 / mo" },
      { name: "Webhook subscriptions", value: "2" },
      { name: "Schema translation", value: true },
      { name: "Real-time dispatch", value: false },
      { name: "Priority support", value: false },
      { name: "Custom branding", value: false },
      { name: "SLA guarantee", value: false },
    ],
  },
  {
    name: "Growth",
    price: "$149",
    period: "/ mo",
    description: "Go live with real-time data routing across platforms",
    icon: Building2,
    highlight: true,
    features: [
      { name: "API calls", value: "25,000 / mo" },
      { name: "Events routed", value: "50,000 / mo" },
      { name: "Webhook subscriptions", value: "25" },
      { name: "Schema translation", value: true },
      { name: "Real-time dispatch", value: true },
      { name: "Priority support", value: false },
      { name: "Custom branding", value: true },
      { name: "SLA guarantee", value: false },
    ],
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/ mo",
    description: "Unlimited throughput with SLA and dedicated support",
    icon: Rocket,
    highlight: false,
    features: [
      { name: "API calls", value: "Unlimited" },
      { name: "Events routed", value: "Unlimited" },
      { name: "Webhook subscriptions", value: "Unlimited" },
      { name: "Schema translation", value: true },
      { name: "Real-time dispatch", value: true },
      { name: "Priority support", value: true },
      { name: "Custom branding", value: true },
      { name: "SLA guarantee", value: true },
    ],
  },
] as const;

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/15">
        <Check size={12} className="text-brand-500" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === false) {
    return <Minus size={14} className="text-neutral-600" />;
  }
  return <span className="text-sm text-neutral-300">{value}</span>;
}

export default function PricingPage() {
  return (
    <div>
      <PageHeader
        title="Pricing"
        description="Usage-based plans for sports platforms of every size."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative dark-card rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? "glow-border"
                  : "border border-neutral-800/60"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-brand-500 text-white text-xs font-semibold rounded-full tracking-wide z-10">
                  RECOMMENDED
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`rounded-full p-2.5 ${
                    tier.highlight
                      ? "bg-brand-500/15"
                      : "bg-neutral-800/80"
                  }`}
                >
                  <Icon
                    size={16}
                    className={tier.highlight ? "text-brand-500" : "text-neutral-400"}
                    strokeWidth={1.75}
                  />
                </div>
                <span className="text-overline text-neutral-400 uppercase tracking-wider">
                  {tier.name}
                </span>
              </div>

              <div className="mb-1">
                <span className="text-3xl font-semibold text-white tracking-tight">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-neutral-400 ml-1">{tier.period}</span>
                )}
              </div>
              <p className="text-sm text-neutral-400 mb-6">{tier.description}</p>

              <div className="flex-1 space-y-3 border-t border-neutral-800/60 pt-5">
                {tier.features.map((f) => (
                  <div key={f.name} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">{f.name}</span>
                    <FeatureValue value={f.value} />
                  </div>
                ))}
              </div>

              <button
                disabled
                className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  tier.highlight
                    ? "bg-brand-500 text-white cursor-not-allowed opacity-60"
                    : "bg-neutral-800/80 text-neutral-400 cursor-not-allowed opacity-60"
                }`}
              >
                {tier.price === "Free" ? "Current Plan" : "Contact Sales"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6">
        <h3 className="text-base font-medium text-white mb-2">
          Platform Revenue Share
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
          Data platforms that supply scheduling data to Orgo Sync earn a{" "}
          <span className="text-brand-500 font-medium">20% revenue share</span>{" "}
          on all events routed through their subscriptions. Revenue share is
          tracked automatically and paid out monthly. Contact our team for details.
        </p>
      </div>
    </div>
  );
}
