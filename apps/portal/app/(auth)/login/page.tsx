"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-heading-1 text-white">Welcome back</h1>
        <p className="text-body-sm text-neutral-400 mt-1">
          Sign in to your Orgo Sync dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-body-sm font-medium text-neutral-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@leagueapps.com"
            className="flex h-9 w-full rounded-md border border-neutral-700/50 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-body-sm font-medium text-neutral-300 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex h-9 w-full rounded-md border border-neutral-700/50 bg-neutral-800 px-3 text-[0.8125rem] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-brand-600 text-white text-body-sm font-medium transition-colors hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-caption text-neutral-500 mt-6">
        Orgo Sync Developer Preview &mdash; Invite Only
      </p>
    </div>
  );
}
