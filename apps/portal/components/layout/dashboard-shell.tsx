"use client";

import type { ReactNode } from "react";
import { RoleProvider, useRole } from "../../lib/role-context";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";
import AuroraBackdrop from "../aurora-backdrop";

interface DashboardShellProps {
  userEmail?: string;
  children: ReactNode;
}

function ShellSkeleton() {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-[var(--sidebar-width)] flex-col pt-8 px-3 gap-6">
        <div className="h-8 w-28 rounded-md bg-neutral-800/40 animate-pulse mx-2 mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-neutral-800/30 animate-pulse mx-2" style={{ width: `${60 + (i % 3) * 20}%` }} />
        ))}
      </div>
      <div className="relative z-[1] flex flex-col lg:pl-[var(--sidebar-width)] h-screen p-2 lg:p-3">
        <div className="light-panel flex-1 min-h-0 rounded-2xl bg-background shadow-xl overflow-hidden">
          <div className="h-[var(--topbar-height)] border-b border-border bg-background/80" />
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 rounded bg-neutral-800/30 animate-pulse" />
            <div className="h-4 w-72 rounded bg-neutral-800/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShellInner({ userEmail, children }: DashboardShellProps) {
  const { isLoading } = useRole();

  if (isLoading) return <ShellSkeleton />;

  return (
    <div className="h-screen bg-background overflow-hidden">
      <AuroraBackdrop subtle />

      <div className="hidden lg:block">
        <AppSidebar userEmail={userEmail} />
      </div>

      <div className="relative z-[1] flex flex-col lg:pl-[var(--sidebar-width)] h-screen p-2 lg:p-3">
        <div className="light-panel flex-1 min-h-0 rounded-2xl bg-background shadow-xl overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden light-scroll">
            <TopBar userEmail={userEmail} />
            <main className="mx-auto max-w-[var(--content-max-width)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  return (
    <RoleProvider>
      <ShellInner userEmail={userEmail} children={children} />
    </RoleProvider>
  );
}
