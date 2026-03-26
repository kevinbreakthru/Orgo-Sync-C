"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarLogo } from "./sidebar-logo";
import { RoleSwitcher } from "./role-switcher";
import { useRole, type Role } from "../../lib/role-context";
import {
  LayoutDashboard, Key, Play, BarChart3, Webhook, Link2,
  BookOpen, CreditCard, LogOut, Database, Brain,
} from "lucide-react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["platform", "builder", "operator"] },
      { href: "/dashboard/keys", label: "API Keys", icon: Key, roles: ["platform", "builder"] },
      { href: "/dashboard/playground", label: "Playground", icon: Play, roles: ["platform"] },
      { href: "/dashboard/usage", label: "Usage", icon: BarChart3, roles: ["platform"] },
      { href: "/dashboard/webhooks", label: "Webhooks", icon: Webhook, roles: ["platform"] },
      { href: "/dashboard/intelligence", label: "Intelligence Engine", icon: Brain, roles: ["platform"] },
      { href: "/dashboard/catalog", label: "Data Catalog", icon: Database, roles: ["builder"] },
      { href: "/dashboard/mappings", label: "Mappings", icon: Link2, roles: ["operator"] },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard, roles: ["builder", "operator"] },
    ],
  },
  {
    label: "Developer",
    items: [
      { href: "/docs", label: "API Docs", icon: BookOpen, roles: ["builder"] },
    ],
  },
];

function filterNavForRole(groups: NavGroup[], role: Role): NavGroup[] {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}

interface AppSidebarProps {
  userEmail?: string;
}

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();

  const filteredGroups = filterNavForRole(NAV_GROUPS, role);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky)] flex w-[var(--sidebar-width)] flex-col pt-7 lg:pt-8">
      <SidebarLogo />

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-6">
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <p className="text-overline text-sidebar-muted-foreground mb-2 px-2">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm transition-colors",
                        isActive
                          ? "bg-accent-teal text-white font-medium"
                          : "text-sidebar-foreground hover:bg-white/[0.06] hover:text-white"
                      )}
                    >
                      <item.icon size={18} strokeWidth={ICON_STROKE_WIDTH} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-3 pb-5">
        <RoleSwitcher />
        {userEmail && (
          <div className="px-2.5 mb-2 text-caption text-sidebar-muted-foreground truncate">
            {userEmail}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors"
        >
          <LogOut size={18} strokeWidth={ICON_STROKE_WIDTH} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export { NAV_GROUPS, filterNavForRole };
