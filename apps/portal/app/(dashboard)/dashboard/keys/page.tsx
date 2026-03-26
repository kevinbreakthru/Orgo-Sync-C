"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/client";
import { PageHeader } from "../../../../components/shared/page-header";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Pencil, Check, X, Copy, Info } from "lucide-react";

interface ApiKeyRow {
  id: string;
  key_prefix: string;
  name: string;
  is_sandbox: boolean;
  rate_limit_per_minute: number;
  last_used_at: string | null;
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isSandbox, setIsSandbox] = useState(true);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [copied, setCopied] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const loadKeys = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!partner) return;

    const { data } = await supabase
      .from("api_keys")
      .select(
        "id, key_prefix, name, is_sandbox, rate_limit_per_minute, last_used_at, created_at"
      )
      .eq("partner_id", partner.id)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    setKeys(data ?? []);
  }, [supabase]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  async function generateKey() {
    setLoading(true);
    setGeneratedKey(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!partner) return;

    const prefix = isSandbox ? "sk_test_" : "sk_live_";
    const rawKey = prefix + crypto.randomUUID().replace(/-/g, "");

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(rawKey)
    );
    const keyHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await supabase.from("api_keys").insert({
      partner_id: partner.id,
      key_prefix: rawKey.slice(0, 12),
      key_hash: keyHash,
      name: newKeyName,
      is_sandbox: isSandbox,
      rate_limit_per_minute: isSandbox ? 100 : 60,
    });

    setGeneratedKey(rawKey);
    setNewKeyName("");
    setLoading(false);
    loadKeys();
  }

  async function revokeKey(keyId: string) {
    await supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", keyId);
    loadKeys();
  }

  function startEditing(key: ApiKeyRow) {
    setEditingId(key.id);
    setEditName(key.name);
  }

  async function saveEdit(keyId: string) {
    if (!editName.trim()) return;
    await supabase
      .from("api_keys")
      .update({ name: editName.trim() })
      .eq("id", keyId);
    setEditingId(null);
    loadKeys();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function copyKey() {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <PageHeader
        title="API Keys"
        description="Generate and manage your API keys. Keys are shown once — store them securely."
      />

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5 mb-6">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-accent-teal mt-0.5 shrink-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
            <div>
              <span className="font-medium text-accent-amber">Sandbox</span>
              <span className="text-neutral-400"> (sk_test_)</span>
              <p className="text-neutral-400 mt-1">
                Returns instant mock data. No external API calls, no billing. Use for development and integration testing.
              </p>
            </div>
            <div>
              <span className="font-medium text-green-400">Production</span>
              <span className="text-neutral-400"> (sk_live_)</span>
              <p className="text-neutral-400 mt-1">
                High-volume data routing and webhook dispatch. Billable usage — counts toward your event throughput quota.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 mb-8">
        <h2 className="text-heading-3 text-white mb-4">Generate New Key</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g. leagueapps-prod, teamsnap-staging"
            className="flex-1 h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
          <select
            value={isSandbox ? "sandbox" : "production"}
            onChange={(e) => setIsSandbox(e.target.value === "sandbox")}
            className="h-9 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-[0.8125rem] text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="sandbox">Sandbox (sk_test_)</option>
            <option value="production">Production (sk_live_)</option>
          </select>
          <Button onClick={generateKey} disabled={loading}>
            {loading ? "Generating..." : "Generate Key"}
          </Button>
        </div>

        {generatedKey && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="text-body-sm font-medium text-green-400 mb-2">
              Key generated — copy it now, it won&apos;t be shown again:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-code bg-neutral-950 text-green-300 rounded p-3 break-all border border-neutral-800">
                {generatedKey}
              </code>
              <button
                onClick={copyKey}
                className="shrink-0 h-10 w-10 rounded-md border border-neutral-700 bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
              >
                {copied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-heading-3 mb-4">Active Keys</h2>
      {keys.length === 0 ? (
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-8 text-center text-neutral-500">
          No active API keys. Generate one above to get started.
        </div>
      ) : (
        <div className="dark-card rounded-2xl border border-neutral-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Prefix</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Rate Limit</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Last Used</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-400">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {editingId === key.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(key.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                            className="h-7 w-36 rounded border border-accent-teal/50 bg-neutral-800 px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent-teal/50"
                          />
                          <button
                            onClick={() => saveEdit(key.id)}
                            className="h-6 w-6 rounded flex items-center justify-center text-green-400 hover:bg-green-500/10 transition-colors"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="h-6 w-6 rounded flex items-center justify-center text-neutral-500 hover:bg-neutral-700/50 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="text-white">{key.name}</span>
                          <button
                            onClick={() => startEditing(key)}
                            className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded flex items-center justify-center text-neutral-500 hover:text-accent-teal transition-all"
                          >
                            <Pencil size={10} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-400 text-xs">
                      {key.key_prefix}...
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={key.is_sandbox ? "warning" : "success"}>
                        {key.is_sandbox ? "sandbox" : "production"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 tabular-nums">
                      {key.rate_limit_per_minute}/min
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => revokeKey(key.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Revoke
                      </Button>
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
