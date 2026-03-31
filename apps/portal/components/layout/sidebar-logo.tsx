"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, X, RotateCcw } from "lucide-react";

const STORAGE_KEY = "partner_logo_url";
const STORAGE_LABEL_KEY = "partner_logo_label";

const PRESETS = [
  { label: "YourApp", url: "https://www.yourapp.com/hubfs/LA-nav-logo.svg" },
  { label: "TeamSnap", url: "https://www.teamsnap.com/hubfs/TeamSnap_Logo.svg" },
  { label: "PlayMetrics", url: "https://playmetrics.com/wp-content/themes/flavor/assets/images/logo.svg" },
  { label: "GameChanger", url: "https://gc-static.gc.com/assets/gc-logo-dark.svg" },
];

export function SidebarLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogoUrl(localStorage.getItem(STORAGE_KEY));
    setLogoLabel(localStorage.getItem(STORAGE_LABEL_KEY));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function applyLogo(url: string | null, label: string | null) {
    if (url) {
      localStorage.setItem(STORAGE_KEY, url);
      localStorage.setItem(STORAGE_LABEL_KEY, label ?? "Platform");
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_LABEL_KEY);
    }
    setLogoUrl(url);
    setLogoLabel(label);
    setOpen(false);
    setInputUrl("");
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputUrl.trim()) {
      applyLogo(inputUrl.trim(), "Platform");
    }
  }

  return (
    <div className="relative px-5 pb-10">
      <div className="flex items-center gap-2 group">
        <Link href="/dashboard" className="flex items-center min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoLabel ?? "Partner"}
              className="h-8 max-w-[160px] object-contain"
              onError={() => applyLogo(null, null)}
            />
          ) : (
            <Image
              src="/orgosynclogo.svg"
              alt="Orgo Sync"
              width={168}
              height={41}
              priority
            />
          )}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all shrink-0"
          title="Change logo"
        >
          <Pencil size={11} />
        </button>
      </div>

      {logoLabel && logoUrl && (
        <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-sidebar-muted-foreground px-0.5">
          {logoLabel} Portal
        </div>
      )}

      {open && (
        <div
          ref={popoverRef}
          className="absolute top-full left-3 right-3 mt-2 z-50 rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          <div className="p-3 border-b border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                White-label logo
              </span>
              <button
                onClick={() => setOpen(false)}
                className="h-5 w-5 rounded flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <form onSubmit={handleCustomSubmit} className="flex gap-1.5">
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste logo URL..."
                className="flex-1 h-7 rounded border border-neutral-700 bg-neutral-800 px-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent-teal/50"
              />
              <button
                type="submit"
                disabled={!inputUrl.trim()}
                className="h-7 px-2.5 rounded bg-accent-teal text-white text-xs font-medium disabled:opacity-40 transition-opacity"
              >
                Set
              </button>
            </form>
          </div>

          <div className="p-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 px-1.5 mb-1.5">
              Presets
            </p>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyLogo(p.url, p.label)}
                className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {logoUrl && (
            <div className="p-2 pt-0">
              <button
                onClick={() => applyLogo(null, null)}
                className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-300 transition-colors"
              >
                <RotateCcw size={11} />
                Reset to Orgo Sync
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
