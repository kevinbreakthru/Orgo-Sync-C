"use client";

import { useRole, type Role } from "../../lib/role-context";

const DEMO_MODE = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

const SEGMENTS: { id: Role; short: string; label: string }[] = [
  { id: "platform", short: "P", label: "Platform" },
  { id: "builder", short: "B", label: "Builder" },
  { id: "operator", short: "O", label: "Operator" },
];

export function RoleSwitcher() {
  if (!DEMO_MODE) return null;

  return <RoleSwitcherInner />;
}

function RoleSwitcherInner() {
  const { role, setRole } = useRole();

  return (
    <div className="mb-3 px-1">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-500 mb-1.5 px-1.5">
        Demo mode
      </p>
      <div className="flex rounded-lg bg-neutral-800/60 p-0.5 gap-0.5">
        {SEGMENTS.map((s) => {
          const active = role === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setRole(s.id)}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
              }`}
              title={s.label}
            >
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
