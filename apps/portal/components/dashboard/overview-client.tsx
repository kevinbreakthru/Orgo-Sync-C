import Link from "next/link";
import { Key, BookOpen, Play, BarChart3, Building2, ArrowRight } from "lucide-react";

interface OverviewClientProps {
  orgName: string;
  tier: string;
  keyCount: number;
  usageCount: number;
}

export function OverviewClient({ orgName, tier, keyCount, usageCount }: OverviewClientProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-overline text-neutral-400">Organization</span>
              <div className="rounded-full bg-brand-500/10 p-2.5">
                <Building2 size={16} className="text-brand-500" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-heading-1 text-white tracking-tight">{orgName}</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-caption text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {tier} tier
          </div>
        </div>

        <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-overline text-neutral-400">Active API Keys</span>
              <div className="rounded-full bg-brand-500/10 p-2.5">
                <Key size={16} className="text-brand-500" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-display-sm text-white tracking-tight tabular-nums">
              {keyCount}
            </div>
          </div>
          <Link
            href="/dashboard/keys"
            className="mt-4 inline-flex items-center gap-1 text-caption text-brand-400 hover:text-brand-300 hover:gap-2 transition-all"
          >
            Manage keys <ArrowRight size={12} />
          </Link>
        </div>

        <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-overline text-neutral-400">Total Requests</span>
              <div className="rounded-full bg-brand-500/10 p-2.5">
                <BarChart3 size={16} className="text-brand-500" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-display-sm text-white tracking-tight tabular-nums">
              {usageCount.toLocaleString()}
            </div>
          </div>
          <Link
            href="/dashboard/usage"
            className="mt-4 inline-flex items-center gap-1 text-caption text-brand-400 hover:text-brand-300 hover:gap-2 transition-all"
          >
            View analytics <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <h2 className="text-heading-2 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/dashboard/keys" className="group block">
          <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-800">
            <div className="rounded-xl bg-brand-500/10 p-3 w-fit mb-4">
              <Key size={20} className="text-brand-500" strokeWidth={1.75} />
            </div>
            <div className="text-heading-4 text-white mb-1">New API Key</div>
            <div className="text-body-sm text-neutral-400">
              Generate a sandbox or production key
            </div>
          </div>
        </Link>

        <Link href="/docs" className="group block">
          <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-800">
            <div className="rounded-xl bg-brand-500/10 p-3 w-fit mb-4">
              <BookOpen size={20} className="text-brand-500" strokeWidth={1.75} />
            </div>
            <div className="text-heading-4 text-white mb-1">API Docs</div>
            <div className="text-body-sm text-neutral-400">
              Explore endpoints and schemas
            </div>
          </div>
        </Link>

        <Link href="/dashboard/playground" className="group block">
          <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-800">
            <div className="rounded-xl bg-brand-500/10 p-3 w-fit mb-4">
              <Play size={20} className="text-brand-500" strokeWidth={1.75} />
            </div>
            <div className="text-heading-4 text-white mb-1">Playground</div>
            <div className="text-body-sm text-neutral-400">
              Test the publish and normalize API
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
