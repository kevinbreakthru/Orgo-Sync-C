# Orgo Sync — Build Status & Architecture Reference

**Last updated:** March 16, 2026
**Status:** API Live, Portal Live (Invite Only)

---

## Live URLs

| Service | URL | Platform |
|---------|-----|----------|
| **API** | `https://orgo-sync-production.up.railway.app` | Railway (us-east4) |
| **Portal** | `https://orgo-sync-portal.vercel.app` | Vercel |
| **Supabase** | `https://vwfzesmvvubnaqaluqpl.supabase.co` | Supabase (dedicated B2B project) |
| **Redis** | `nozomi.proxy.rlwy.net:32884` | Railway managed addon |
| **Repo** | `https://github.com/miringrains/Orgo-Sync` | GitHub |

---

## Login Credentials (Dev Preview)

| Field | Value |
|-------|-------|
| Email | `demo@orgosync.dev` |
| Password | `OrgoSync2026!` |
| Org | Orgo Demo |
| Tier | sandbox |

Public signup is **disabled**. The portal is invite-only during the build phase.

---

## Monorepo Structure

```
orgo-sync/
├── apps/
│   ├── api/          — Fastify 5 API server (Railway)
│   └── portal/       — Next.js 15 developer portal (Vercel)
├── packages/
│   ├── schemas/      — @orgo-sync/schemas — Zod canonical schemas (shared)
│   ├── sdk/          — @orgo/sync — NPM SDK for partner integration
│   └── tsconfig/     — Shared TypeScript configs (base, node, nextjs)
├── docs/             — Documentation
├── turbo.json        — Turborepo task config
├── pnpm-workspace.yaml
└── vercel.json       — Vercel deployment config
```

**Tooling:** Turborepo + pnpm 10.32.1 workspaces, TypeScript 5.7, Node.js 20.

---

## Infrastructure Connections

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL                                 │
│  ┌─────────────────────────────────────────────┐         │
│  │  Portal (Next.js 15)                         │         │
│  │  orgo-sync-portal.vercel.app                 │         │
│  │                                               │         │
│  │  Env:                                         │         │
│  │    NEXT_PUBLIC_SUPABASE_URL ─────────────┐   │         │
│  │    NEXT_PUBLIC_SUPABASE_ANON_KEY ────────┤   │         │
│  │    NEXT_PUBLIC_API_URL ──────────────┐   │   │         │
│  └──────────────────────────────────────┼───┼───┘         │
└─────────────────────────────────────────┼───┼─────────────┘
                                          │   │
                    ┌─────────────────────┘   │
                    ▼                         │
┌─────────────────────────────────────────┐   │
│              RAILWAY                     │   │
│  ┌───────────────────────────────────┐  │   │
│  │  API (Fastify 5)                   │  │   │
│  │  orgo-sync-production.up.railway   │  │   │
│  │                                     │  │   │
│  │  Env:                               │  │   │
│  │    SUPABASE_URL ────────────────────┼──┼──┐
│  │    SUPABASE_SERVICE_ROLE_KEY ───────┼──┼──┤
│  │    REDIS_URL ──────────┐            │  │  │
│  │    GOOGLE_API_KEY      │            │  │  │
│  │    WEATHER_API_KEY     │            │  │  │
│  │    PORTAL_URL ─────────┼──(CORS)────┼──┘  │
│  └────────────────────────┼────────────┘     │
│                           ▼                   │
│  ┌───────────────────────────────────┐       │
│  │  Redis 7                           │       │
│  │  Rate limit counters               │       │
│  │  API key auth cache (5min TTL)     │       │
│  └───────────────────────────────────┘       │
└───────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┘
                    ▼
┌───────────────────────────────────────────────┐
│              SUPABASE                          │
│  Dedicated B2B project (isolated from app)     │
│  vwfzesmvvubnaqaluqpl.supabase.co              │
│                                                │
│  Auth: Partner email/password login            │
│  Tables (all RLS-enabled):                     │
│    partners                                    │
│    api_keys                                    │
│    api_usage_log                               │
│    partner_enrichments                         │
│    enrichment_cache                            │
│    schema_mappings                             │
└───────────────────────────────────────────────┘
```

---

## API Endpoints

All protected routes require `X-API-Key` header. Health and docs are public.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | Public | Health check (status, version, uptime) |
| `GET` | `/documentation/json` | Public | OpenAPI 3.0 spec (JSON) |
| `POST` | `/v1/enrich` | API Key | Synchronous enrichment — accepts a structured event, returns full Logistics Object |
| `POST` | `/v1/enrich/batch` | API Key | Async batch enrichment — enqueues jobs via BullMQ, returns job ID |
| `GET` | `/v1/enrich/:jobId` | API Key | Poll async job status and result |
| `POST` | `/v1/ingest` | API Key | Multi-adapter ingestion — accepts TeamSnap, ICS, or raw JSON payloads |
| `POST` | `/v1/parse` | API Key | ICS parsing — converts ICS text to CanonicalEvent array |

### Sandbox Mode

API keys prefixed with `sk_test_` return **mocked data instantly** without hitting Google/Weather APIs. This is the default key type generated from the portal.

---

## Enrichment Pipeline

The core value of the API. Each step is independently fault-tolerant (wrapped in try/catch — a step failure doesn't block others).

```
Raw Event Input
       │
       ▼
┌──────────────┐
│ 1. Normalize  │  Validate & conform to CanonicalEventSchema
└──────┬───────┘
       ▼
┌──────────────────┐
│ 2. Geocode        │  Google Places API (Text Search) → lat/lng, formatted address
└──────┬───────────┘
       ▼
┌──────────────────┐
│ 3. Drive Time     │  Google Routes API (computeRoutes) → duration, distance from origin
└──────┬───────────┘
       ▼
┌──────────────────┐
│ 4. Weather        │  WeatherAPI.com → temp, condition, wind, precip at event start
└──────┬───────────┘
       ▼
┌──────────────────┐
│ 5. Timeline       │  Compute depart_by, prep_starts based on drive time + early arrival
└──────┬───────────┘
       ▼
┌──────────────────────┐
│ 6. Conflict Detection │  Cross-check against other_events for time/travel overlaps
└──────┬───────────────┘
       ▼
  Logistics Object (full enriched output)
```

---

## Adapters (Ingestion)

The `/v1/ingest` endpoint routes to the correct adapter based on the `source` field:

| Adapter | Source Key | Input | Description |
|---------|-----------|-------|-------------|
| **TeamSnap** | `teamsnap` | Collection+JSON | Maps TeamSnap event fields to CanonicalEvent using existing Orgo app knowledge |
| **ICS** | `ics` | ICS/iCal text | Parses VEVENT blocks into CanonicalEvent array |
| **JSON Passthrough** | `json` | Raw JSON | Validates against CanonicalEventSchema directly |

---

## Database Schema (Supabase)

All tables have Row-Level Security (RLS) enabled.

### `partners`
Primary partner/org record. Created on signup, linked to Supabase Auth user.
- `id` (uuid, PK), `user_id` (FK → auth.users), `org_name`, `contact_email`
- `tier` (default: `sandbox`), `platform_slug` (unique)
- `rev_share_pct`, `billing_model`, `monthly_enrichment_cap`
- `is_active`, `activated_at`, `created_at`

### `api_keys`
B2B API keys for authentication. SHA-256 hashed, never stored in plain text.
- `id` (uuid, PK), `partner_id` (FK → partners)
- `key_prefix` (visible portion, e.g., `sk_test_abc...`), `key_hash` (SHA-256, unique)
- `name`, `is_sandbox`, `rate_limit_per_minute` (default: 60)
- `revoked_at`, `last_used_at`, `created_at`

### `api_usage_log`
Per-request usage tracking for analytics and billing.
- `id` (bigint, PK), `api_key_id` (FK → api_keys), `partner_id` (FK → partners)
- `endpoint`, `status_code`, `latency_ms`, `event_count`, `cached`
- `created_at`

### `partner_enrichments`
Billing period aggregation for rev-share calculations.
- `id` (uuid, PK), `partner_id` (FK → partners)
- `period_start`, `period_end`, `total_enrichments`, `billable_enrichments`
- `enrichment_value_cents`, `rev_share_cents`, `status`

### `enrichment_cache`
Cached enrichment results to avoid redundant API calls.
- `id` (uuid, PK), `cache_key` (unique), `result` (jsonb)
- `expires_at`, `created_at`

### `schema_mappings`
Partner-specific field mappings (for AI mapping UI — Phase 2).
- `id` (uuid, PK), `partner_id` (FK → partners)
- `name`, `source_sample` (jsonb), `field_mappings` (jsonb), `confidence_scores` (jsonb)
- `status`, `approved_by`, `approved_at`

---

## Portal Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Redirects to `/login` | Landing page disabled during dev |
| `/login` | Public | Email/password login (invite only) |
| `/signup` | Redirects to `/login` | Registration disabled during dev |
| `/dashboard` | Authenticated | Partner overview |
| `/dashboard/keys` | Authenticated | Generate & manage API keys |
| `/dashboard/playground` | Authenticated | Interactive API testing (Monaco Editor) |
| `/dashboard/usage` | Authenticated | Usage analytics (Recharts) |
| `/dashboard/mappings` | Authenticated | Static AI schema mapping mockup |
| `/docs` | Authenticated | Scalar API Reference (from OpenAPI spec) |

---

## Authentication Flows

### Portal Auth (Supabase Auth)
1. Partner logs in with email/password at `/login`
2. Supabase returns a session token (httpOnly cookie via `@supabase/ssr`)
3. Next.js middleware checks session on every `/dashboard/*` request
4. Unauthenticated users are redirected to `/login`

### API Auth (B2B API Keys)
1. Partner generates a key in the portal → raw key shown once, SHA-256 hash stored in `api_keys`
2. Partner includes `X-API-Key: sk_test_...` header in API requests
3. API server hashes the key, checks Redis cache (5-min TTL), falls back to Supabase lookup
4. On success, `request.partnerAuth` is populated (partner_id, tier, rate_limit, is_sandbox)
5. Rate limiter reads `partnerAuth.rate_limit_per_minute` to enforce per-key limits via Redis

### Unprotected Routes
- `/health` — no auth required
- `/documentation/json` — no auth required
- All `/documentation/*` paths — no auth required

---

## External API Keys

| Service | Env Var | Used For |
|---------|---------|----------|
| Google API | `GOOGLE_API_KEY` | Places API (geocoding), Routes API (drive time) |
| WeatherAPI | `WEATHER_API_KEY` | Weather forecasts at event location/time |
| Supabase | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Database (API server, service role) |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth + client queries (Portal) |

---

## Railway Environment Variables (API)

```
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
SUPABASE_URL=https://vwfzesmvvubnaqaluqpl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
REDIS_URL=redis://default:...@nozomi.proxy.rlwy.net:32884
GOOGLE_API_KEY=AIza...
WEATHER_API_KEY=905c...
PORTAL_URL=https://orgo-sync-portal.vercel.app
```

---

## Vercel Environment Variables (Portal)

```
NEXT_PUBLIC_SUPABASE_URL=https://vwfzesmvvubnaqaluqpl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key from Supabase dashboard>
NEXT_PUBLIC_API_URL=https://orgo-sync-production.up.railway.app
```

---

## Docker Build Strategy

The API uses a multi-stage Dockerfile optimized for pnpm monorepos:

1. **Base stage:** `node:20-slim` with corepack/pnpm enabled
2. **Build stage:** Install deps → copy source → build schemas → build API → `pnpm deploy --legacy` creates a standalone directory with real (non-symlinked) production dependencies
3. **Runtime stage:** Copies the deploy output + compiled `dist/` into a clean `node:20-slim` image

Key decisions:
- `pnpm deploy --legacy` solves pnpm's symlink problem in Docker (symlinks break across COPY stages)
- `ENV CI=true` prevents pnpm from requiring TTY confirmation
- Schemas are built before the API since the API imports from `@orgo-sync/schemas`

---

## NPM SDK (`@orgo/sync`)

Three-line integration for partners:

```typescript
import { OrgoSync } from '@orgo/sync';

const orgo = new OrgoSync({ apiKey: 'sk_live_xxx' });
const result = await orgo.enrich({
  title: 'U12 Soccer vs Eagles',
  start: '2026-03-28T14:00:00-05:00',
  location: 'Memorial Stadium, Springfield IL',
});
```

**Methods:** `enrich()`, `enrichBatch()`, `ingest()`, `parse()`, `status()`

---

## Deployment Issues Resolved

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| `ERR_UNKNOWN_FILE_EXTENSION .ts` | `package.json` exports pointed to raw TypeScript | Changed to `./dist/index.js` |
| `pnpm prune --prod` TTY error | Docker has no interactive terminal | Added `ENV CI=true` |
| `Cannot find package 'fastify'` | pnpm symlinks break in Docker COPY | Used `pnpm deploy --legacy` |
| `schema.safeParse is not a function` | Health route used JSON Schema instead of Zod | Converted to Zod schema |
| Vercel doubled output path | `outputDirectory` was relative to Root Directory | Changed to `.next` |
| CORS "Failed to fetch" | `PORTAL_URL` was `localhost:3000` | Updated to Vercel domain |

---

## What's Next (Not Yet Built)

- [ ] BullMQ worker service on Railway (separate from web service)
- [ ] Webhook callbacks for async enrichment jobs
- [ ] AI Schema Mapping UI (Phase 2 — currently a static mockup)
- [ ] LeagueApps adapter (partner two — static AI mapping mockup in V1)
- [ ] Custom domain setup (API + Portal)
- [ ] Production API keys (`sk_live_` prefix)
- [ ] Load testing and cache verification
- [ ] NPM publish for `@orgo/sync`
