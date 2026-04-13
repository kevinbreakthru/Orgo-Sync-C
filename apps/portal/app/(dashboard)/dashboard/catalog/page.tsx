"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/client";
import { PageHeader } from "../../../../components/shared/page-header";
import {
  Database,
  ArrowRight,
  Check,
  Clock,
  X,
  Loader2,
} from "lucide-react";

const SAMPLE_PLATFORMS = [
  {
    id: "teamsnap",
    name: "TeamSnap",
    description: "Youth and amateur sports scheduling for 25M+ athletes",
    eventTypes: "Games, practices, tournaments, team events",
    dataVolume: "~120K events/day",
  },
  {
    id: "yourapp",
    name: "YourApp",
    description: "Registration and scheduling for leagues and clubs",
    eventTypes: "Seasons, games, practices, camps",
    dataVolume: "~85K events/day",
  },
  {
    id: "playmetrics",
    name: "PlayMetrics",
    description: "Club management platform for youth soccer",
    eventTypes: "Training, matches, tryouts, evaluations",
    dataVolume: "~40K events/day",
  },
  {
    id: "gamechanger",
    name: "GameChanger",
    description: "Live scorekeeping and team management",
    eventTypes: "Games, lineup changes, score updates",
    dataVolume: "~95K events/day",
  },
];

interface RequestModalState {
  platformName: string;
  publisherId: string;
}

export default function CatalogPage() {
  const [modal, setModal] = useState<RequestModalState | null>(null);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const supabase = createSupabaseBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  async function getApiKey(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!partner) return null;

    const { data: keys } = await supabase
      .from("api_keys")
      .select("key_prefix")
      .eq("partner_id", partner.id)
      .is("revoked_at", null)
      .limit(1);

    return keys?.[0]?.key_prefix ?? null;
  }

  async function submitRequest() {
    if (!modal) return;
    setLoading(true);
    setResult(null);

    if (!endpointUrl.startsWith("https://")) {
      setResult({ ok: false, message: "Endpoint must use HTTPS" });
      setLoading(false);
      return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      setResult({ ok: false, message: "No API key found. Create one in API Keys first." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/v1/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          publisher_id: modal.publisherId,
          endpoint_url: endpointUrl.trim(),
          description: description.trim() || `${modal.platformName} data feed`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ ok: false, message: data.error?.message ?? "Request failed" });
      } else {
        setResult({
          ok: true,
          message: `Access request sent to ${modal.platformName}. You'll receive data once approved.`,
        });
        setEndpointUrl("");
        setDescription("");
      }
    } catch {
      setResult({ ok: false, message: "Network error" });
    }

    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="Data Catalog"
        description="Browse available scheduling platforms and request access to their real-time event data."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {SAMPLE_PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="dark-card rounded-2xl border border-neutral-800/60 p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-500/10 p-3">
                  <Database size={20} className="text-brand-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-heading-4 text-white">{platform.name}</h3>
                  <p className="text-caption text-neutral-400">{platform.description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 mb-5">
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-500">Event types</span>
                <span className="text-neutral-300 text-right max-w-[60%]">{platform.eventTypes}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-500">Volume</span>
                <span className="text-neutral-300">{platform.dataVolume}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-neutral-500">Format</span>
                <span className="text-neutral-300">CanonicalEvent JSON</span>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-between h-9 px-4 rounded-md text-[0.8125rem] font-medium border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              onClick={() => setModal({ platformName: platform.name, publisherId: platform.id })}
            >
              <span>Request Access</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-3 text-white">Request Access — {modal.platformName}</h2>
              <button
                onClick={() => { setModal(null); setResult(null); }}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-body-sm text-neutral-400 mb-1.5">Your webhook endpoint</label>
                <input
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://api.yourapp.com/webhooks/orgo"
                  className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <div>
                <label className="block text-body-sm text-neutral-400 mb-1.5">Description (optional)</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. MyApp production environment"
                  className="w-full h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              {result && (
                <div className={`rounded-lg border p-3 text-body-sm ${
                  result.ok
                    ? "border-green-500/30 bg-green-500/5 text-green-400"
                    : "border-red-500/30 bg-red-500/5 text-red-400"
                }`}>
                  <div className="flex items-center gap-2">
                    {result.ok ? <Check size={14} /> : <X size={14} />}
                    {result.message}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  className="flex-1 h-9 px-4 rounded-md text-[0.8125rem] font-medium border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                  onClick={() => { setModal(null); setResult(null); }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 h-9 px-4 rounded-md text-[0.8125rem] font-medium bg-brand-600 text-white hover:bg-brand-500 transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center"
                  onClick={submitRequest}
                  disabled={loading || (result?.ok ?? false)}
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin mr-1.5" /> Sending...</>
                  ) : result?.ok ? (
                    <><Clock size={14} className="mr-1.5" /> Pending Approval</>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
