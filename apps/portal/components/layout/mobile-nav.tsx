"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Sheet } from "../ui/sheet";
import { NAV_GROUPS, filterNavForRole } from "./app-sidebar";
import { RoleSwitcher } from "./role-switcher";
import { useRole } from "../../lib/role-context";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

interface MobileNavProps {
  userEmail?: string;
}

export function MobileNav({ userEmail }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();

  const filteredGroups = filterNavForRole(NAV_GROUPS, role);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 w-8 -ml-1 flex items-center justify-center rounded-md hover:bg-accent/10 transition-colors"
      >
        <Menu size={20} strokeWidth={ICON_STROKE_WIDTH} />
      </button>

      <Sheet open={open} onOpenChange={setOpen} side="left" className="bg-[#0f0f0f]">
        <div className="px-5 pt-6 pb-2 space-y-3">
          <Image src="/orgosynclogo.svg" alt="Orgo Sync" width={144} height={36} />
        </div>

        <div className="mx-5 border-t border-white/[0.06]" />

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="flex flex-col gap-5">
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="text-overline text-neutral-500 mb-2 px-2">
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
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-body-sm transition-colors",
                          isActive
                            ? "bg-accent-teal text-white font-medium"
                            : "text-neutral-300 hover:bg-white/[0.06] hover:text-white"
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

        <div className="border-t border-white/[0.06] p-3">
          <RoleSwitcher />
          {userEmail && (
            <div className="px-2.5 mb-2 text-caption text-neutral-500 truncate">
              {userEmail}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm text-neutral-400 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            <LogOut size={18} strokeWidth={ICON_STROKE_WIDTH} />
            <span>Log out</span>
          </button>
        </div>
      </Sheet>
    </>
  );
}
