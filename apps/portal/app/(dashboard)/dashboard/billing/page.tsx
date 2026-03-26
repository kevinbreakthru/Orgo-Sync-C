"use client";

import { PageHeader } from "../../../../components/shared/page-header";
import { useRole } from "../../../../lib/role-context";
import { Check, Minus, Zap, Building2, Rocket } from "lucide-react";

// ── Builder view: usage metrics against plan limits ─────────────────────────

const USAGE_METRICS = [
  { label: "API Requests", used: 4_210, limit: 25_000 },
  { label: "Events Consumed", used: 12_380, limit: 50_000 },
  { label: "Webhook Endpoints", used: 3, limit: 25 },
  { label: "Active Subscriptions", used: 2, limit: 10 },
];

function BuilderBilling() {
  return (
    <>
      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 mb-8 flex items-center justify-between">
        <div>
          <span className="text-overline text-neutral-400">Current plan</span>
          <div className="text-heading-2 text-white mt-1">Growth</div>
          <p className="text-body-sm text-neutral-400 mt-1">$149 / month &middot; Renews Apr 15, 2026</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-semibold text-success tracking-wide">
          Active
        </span>
      </div>

      <h2 className="text-heading-2 mb-4">Usage This Cycle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {USAGE_METRICS.map((m) => {
          const pct = Math.min(100, Math.round((m.used / m.limit) * 100));
          const isHigh = pct > 80;
          return (
            <div key={m.label} className="dark-card rounded-2xl border border-neutral-800/60 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-body-sm text-neutral-400">{m.label}</span>
                <span className="text-caption text-neutral-500">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${isHigh ? "bg-warning" : "bg-brand-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-heading-4 text-white tabular-nums">{m.used.toLocaleString()}</span>
                <span className="text-caption text-neutral-500">of {m.limit.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        disabled
        className="w-full py-3 rounded-xl text-sm font-medium bg-brand-500 text-white opacity-60 cursor-not-allowed"
      >
        Upgrade Plan — Contact Sales
      </button>
    </>
  );
}

// ── Operator view: SaaS pricing cards ───────────────────────────────────────

const OPERATOR_TIERS = [
  {
    name: "Basic",
    price: "$49",
    period: "/ mo",
    description: "Connect two platforms with basic sync",
    icon: Zap,
    highlight: false,
    features: [
      { name: "Connected platforms", value: "2" },
      { name: "Sync frequency", value: "15 min" },
      { name: "Field mappings", value: "50" },
      { name: "Conflict alerts", value: true },
      { name: "Priority support", value: false },
      { name: "Custom rules", value: false },
    ],
  },
  {
    name: "Pro",
    price: "$199",
    period: "/ mo",
    description: "Real-time sync across your full stack",
    icon: Building2,
    highlight: true,
    features: [
      { name: "Connected platforms", value: "10" },
      { name: "Sync frequency", value: "Real-time" },
      { name: "Field mappings", value: "500" },
      { name: "Conflict alerts", value: true },
      { name: "Priority support", value: true },
      { name: "Custom rules", value: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Unlimited platforms with dedicated support and SLA",
    icon: Rocket,
    highlight: false,
    features: [
      { name: "Connected platforms", value: "Unlimited" },
      { name: "Sync frequency", value: "Real-time" },
      { name: "Field mappings", value: "Unlimited" },
      { name: "Conflict alerts", value: true },
      { name: "Priority support", value: true },
      { name: "Custom rules", value: true },
    ],
  },
];

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

function OperatorBilling() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {OPERATOR_TIERS.map((tier) => {
        const Icon = tier.icon;
        return (
          <div
            key={tier.name}
            className={`relative dark-card rounded-2xl p-6 flex flex-col ${
              tier.highlight ? "glow-border" : "border border-neutral-800/60"
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-brand-500 text-white text-xs font-semibold rounded-full tracking-wide z-10">
                RECOMMENDED
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-full p-2.5 ${tier.highlight ? "bg-brand-500/15" : "bg-neutral-800/80"}`}>
                <Icon size={16} className={tier.highlight ? "text-brand-500" : "text-neutral-400"} strokeWidth={1.75} />
              </div>
              <span className="text-overline text-neutral-400 uppercase tracking-wider">{tier.name}</span>
            </div>

            <div className="mb-1">
              <span className="text-3xl font-semibold text-white tracking-tight">{tier.price}</span>
              {tier.period && <span className="text-sm text-neutral-400 ml-1">{tier.period}</span>}
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
              {tier.price === "Custom" ? "Contact Sales" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { role } = useRole();

  return (
    <div>
      <PageHeader
        title="Billing"
        description={
          role === "builder"
            ? "API usage metrics and plan management."
            : "Choose the right plan for your operations."
        }
      />
      {role === "builder" ? <BuilderBilling /> : <OperatorBilling />}
    </div>
  );
}
