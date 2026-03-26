"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/client";
import { PageHeader } from "../../../../components/shared/page-header";
import { Button } from "../../../../components/ui/button";
import {
  Webhook,
  Copy,
  Check,
  AlertTriangle,
  CircleCheck,
  CircleX,
  Send,
  Loader2,
  Trash2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface SubscriptionRow {
  id: string;
  publisher_id: string;
  subscriber_id: string;
  endpoint_url: string;
  event_filters: string[];
  description: string | null;
  is_active: boolean;
  approval_status: string;
  failure_count: number;
  disabled_at: string | null;
  created_at: string;
}

export default function WebhooksPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [description, setDescription] = useState("");
  const [subscriberId, setSubscriberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; ok: boolean } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedSecret, setApprovedSecret] = useState<{ id: string; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const loadSubscriptions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!partner) return;

    const { data: rows } = await supabase
      .from("webhook_subscriptions")
      .select("id, publisher_id, subscriber_id, endpoint_url, event_filters, description, is_active, approval_status, failure_count, disabled_at, created_at")
      .or(`publisher_id.eq.${partner.id},subscriber_id.eq.${partner.id}`)
      .order("created_at", { ascending: false });

    setSubscriptions(rows ?? []);
  }, [supabase]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

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

  async function createSubscription() {
    setLoading(true);
    setCreatedSecret(null);
    setError(null);

    if (!endpointUrl.startsWith("https://")) {
      setError("Endpoint must use HTTPS");
      setLoading(false);
      return;
    }

    if (!subscriberId.trim()) {
      setError("Subscriber partner ID is required");
      setLoading(false);
      return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      setError("No active API key found. Create one in API Keys first.");
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
          subscriber_id: subscriberId.trim(),
          endpoint_url: endpointUrl.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? "Failed to create subscription");
        setLoading(false);
        return;
      }

      setCreatedSecret(data.signing_secret);
      setEndpointUrl("");
      setDescription("");
      setSubscriberId("");
      loadSubscriptions();
    } catch {
      setError("Network error — could not reach the API");
    }

    setLoading(false);
  }

  async function approveSubscription(subId: string) {
    setApprovingId(subId);
    setApprovedSecret(null);

    const apiKey = await getApiKey();
    if (!apiKey) return;

    try {
      const res = await fetch(`${apiUrl}/v1/subscriptions/${subId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });

      const data = await res.json();
      if (res.ok && data.signing_secret) {
        setApprovedSecret({ id: subId, secret: data.signing_secret });
      }
      loadSubscriptions();
    } catch {
      // silently fail
    }

    setApprovingId(null);
  }

  async function testWebhook(subId: string) {
    setTestingId(subId);
    setTestResult(null);

    const apiKey = await getApiKey();
    if (!apiKey) return;

    try {
      const res = await fetch(`${apiUrl}/v1/subscriptions/${subId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });

      setTestResult({ id: subId, ok: res.ok });
    } catch {
      setTestResult({ id: subId, ok: false });
    }

    setTestingId(null);
    setTimeout(() => setTestResult(null), 3000);
  }

  async function revokeSubscription(subId: string) {
    const apiKey = await getApiKey();
    if (!apiKey) return;

    await fetch(`${apiUrl}/v1/subscriptions/${subId}`, {
      method: "DELETE",
      headers: { "X-API-Key": apiKey },
    });

    loadSubscriptions();
  }

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const pendingSubs = subscriptions.filter((s) => s.approval_status === "pending");
  const approvedSubs = subscriptions.filter((s) => s.approval_status === "approved");
  const deniedSubs = subscriptions.filter((s) => s.approval_status === "denied");

  function statusBadge(sub: SubscriptionRow) {
    if (sub.disabled_at) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400">
          <CircleX size={12} /> Disabled
        </span>
      );
    }
    if (sub.failure_count > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400">
          <AlertTriangle size={12} /> {sub.failure_count} failures
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-400">
        <CircleCheck size={12} /> Active
      </span>
    );
  }

  return (
    <div>
      <PageHeader
        title="Webhook Subscriptions"
        description="Manage the builders and apps subscribed to your real-time scheduling data."
      />

      {/* Platform: Add subscriber form */}
      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 mb-8">
        <h2 className="text-heading-3 text-white mb-4">Add Webhook Subscriber</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              value={subscriberId}
              onChange={(e) => setSubscriberId(e.target.value)}
              placeholder="Subscriber partner ID"
              className="h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <input
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://api.example.com/webhooks/orgo"
              className="h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. FanApp Staging Environment"
              className="h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={createSubscription} disabled={loading}>
              {loading ? "Creating..." : "Create Subscription"}
            </Button>
            {error && (
              <span className="text-body-sm text-red-400">{error}</span>
            )}
          </div>

          {createdSecret && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-body-sm font-medium text-amber-400 mb-2">
                Signing secret (shown once — share with the subscriber):
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-code bg-neutral-950 text-amber-300 rounded p-3 break-all border border-neutral-800 text-xs">
                  {createdSecret}
                </code>
                <button
                  onClick={() => copyText("secret", createdSecret)}
                  className="shrink-0 h-10 w-10 rounded-md border border-neutral-700 bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                >
                  {copiedId === "secret" ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Requests */}
      {pendingSubs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-heading-3 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-amber-400" />
            Pending Requests
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium px-2 py-0.5">
              {pendingSubs.length}
            </span>
          </h2>
          <div className="dark-card rounded-2xl border border-amber-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">Builder</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">Endpoint</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-400">Requested</th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSubs.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-amber-400 shrink-0" />
                          <span className="text-white font-medium">
                            {sub.description || sub.subscriber_id.slice(0, 8) + "..."}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-neutral-400 truncate max-w-[280px] block" title={sub.endpoint_url}>
                          {sub.endpoint_url.length > 45
                            ? sub.endpoint_url.slice(0, 42) + "..."
                            : sub.endpoint_url}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveSubscription(sub.id)}
                            disabled={approvingId === sub.id}
                            className="h-7 px-3 rounded-md bg-green-600 hover:bg-green-500 flex items-center gap-1.5 text-xs text-white font-medium transition-colors disabled:opacity-50"
                          >
                            {approvingId === sub.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <ShieldCheck size={12} />
                            )}
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => revokeSubscription(sub.id)}
                            className="h-7 px-2.5 rounded-md border border-neutral-700 bg-neutral-800 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:border-red-500/30 transition-colors"
                          >
                            <CircleX size={12} />
                            <span>Deny</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {approvedSecret && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-body-sm font-medium text-amber-400 mb-2">
                Signing secret for approved subscription (shown once — share with the builder):
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-code bg-neutral-950 text-amber-300 rounded p-3 break-all border border-neutral-800 text-xs">
                  {approvedSecret.secret}
                </code>
                <button
                  onClick={() => copyText("approved", approvedSecret.secret)}
                  className="shrink-0 h-10 w-10 rounded-md border border-neutral-700 bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                >
                  {copiedId === "approved" ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Subscriptions */}
      <h2 className="text-heading-3 mb-4">Active Subscriptions</h2>
      {approvedSubs.length === 0 ? (
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-8 text-center text-neutral-500">
          No active webhook subscriptions. Add a subscriber above or approve a pending request.
        </div>
      ) : (
        <div className="dark-card rounded-2xl border border-neutral-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Endpoint URL</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Webhook size={14} className="text-brand-500 shrink-0" />
                        <span className="text-white font-medium">
                          {sub.description || "Unnamed subscription"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-neutral-400 truncate max-w-[280px] block" title={sub.endpoint_url}>
                        {sub.endpoint_url.length > 45
                          ? sub.endpoint_url.slice(0, 42) + "..."
                          : sub.endpoint_url}
                      </code>
                    </td>
                    <td className="px-4 py-3">{statusBadge(sub)}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => testWebhook(sub.id)}
                          disabled={testingId === sub.id}
                          className="h-7 px-2.5 rounded-md border border-neutral-700 bg-neutral-800 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors disabled:opacity-50"
                        >
                          {testingId === sub.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : testResult?.id === sub.id ? (
                            testResult.ok ? (
                              <Check size={12} className="text-green-400" />
                            ) : (
                              <CircleX size={12} className="text-red-400" />
                            )
                          ) : (
                            <Send size={12} />
                          )}
                          <span>Test</span>
                        </button>
                        <button
                          onClick={() => revokeSubscription(sub.id)}
                          className="h-7 px-2.5 rounded-md border border-neutral-700 bg-neutral-800 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:border-red-500/30 transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>Revoke</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
