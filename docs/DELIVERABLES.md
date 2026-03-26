# Orgo Sync — Full Deliverables Checklist

## 1. Monorepo & Infrastructure

| Item | Status | Details |
|------|--------|---------|
| Turborepo + pnpm workspaces | Done | `apps/api`, `apps/portal`, `packages/schemas`, `packages/sdk`, `packages/tsconfig` |
| Dedicated B2B Supabase project | Done | Project `lavxmwfyjgjxklmonvdv` — fully isolated from consumer app |
| RLS enabled on all tables | Done | `partners`, `api_keys`, `api_usage_log`, `partner_enrichments`, `enrichment_cache`, `schema_mappings`, `calendar_feeds`, `feed_events` |
| Railway deployment (API) | Done | `orgo-sync-production.up.railway.app` — Fastify web service |
| Railway deployment (Worker) | Done | Separate `Orgo-Sync-Worker` service for BullMQ batch jobs |
| Railway Redis addon | Done | Redis 7 managed addon for caching + BullMQ queues |
| Vercel deployment (Portal) | Done | `orgo-sync-portal.vercel.app` — Next.js 15, App Router, React 19 |
| GitHub repo | Done | `miringrains/Orgo-Sync` — clean git history, no consumer app code |

---

## 2. Canonical Schema (`packages/schemas`)

| Item | Status | Details |
|------|--------|---------|
| `CanonicalEventSchema` | Done | Zod schema — source, title, start/end, location, sport, participants, recurrence, notes |
| `LogisticsObjectSchema` | Done | event + enrichment block (geocoded_location, drive_time, weather, timeline, conflicts) |
| `TimelineSchema` | Done | prep_starts, depart_by, arrive_by, event_starts/ends, arrive_home, total_logistics_start/end, drive_home_minutes |
| `EnrichRequestSchema` | Done | Sync enrichment input with optional `enrich: false` bypass |
| `EnrichBatchRequestSchema` | Done | Batch enrichment input with webhook_url support |
| `IngestRequestSchema` | Done | Adapter-based ingestion (source, payload, origin, enrich flag) |
| `PartnerSchema` / `ApiKeySchema` | Done | Partner tier, type (platform/builder), billing model, rev share |
| All types exported as TypeScript inferred types | Done | Single source of truth consumed by API, SDK, and portal |

---

## 3. Adapter Pattern & Ingestion (`POST /v1/ingest`)

| Item | Status | Details |
|------|--------|---------|
| Adapter registry (`resolveAdapter()`) | Done | Extensible Map-based lookup by source name |
| TeamSnap adapter (Live Partner One) | Done | Handles array, Collection+JSON, envelope formats. Maps `game_type`, `opponent_name`, `location`, `uniform`, `minutes_to_arrive_early`, roster → CanonicalEvent |
| ICS adapter | Done | Parses VCALENDAR/VEVENT via `node-ical`, extracts DTSTART/DTEND/SUMMARY/LOCATION/DESCRIPTION |
| Raw JSON passthrough adapter | Done | Validates against CanonicalEventSchema directly |
| "Normalize-Only" bypass (`enrich: false`) | Done | Returns mapped CanonicalEvent without calling Google/Weather. Logged as `normalize_only: true` |

---

## 4. Enrichment Pipeline (`apps/api/src/pipeline`)

| Step | Status | Details |
|------|--------|---------|
| 1. Normalize | Done | Validates CanonicalEvent via Zod `.parse()` |
| 2. Geocode Location | Done | Google Places API (Text Search). Redis cache `geo:{address}` — 7-day TTL |
| 3. Compute Drive Time | Done | Google Routes API (`computeRoutes`). Traffic-aware. Redis cache `route:{origin}_{dest}` — 15-min TTL |
| 4. Fetch Weather | Done | WeatherAPI.com (forecast for event date). Redis cache `weather:{lat},{lng}_{date}` — 2-hour TTL |
| 5. Build Timeline | Done | Calculates prep_starts, depart_by, arrive_by, arrive_home, total_logistics_start/end. 5-minute rounding. Default 10-min prep. Mirrors travel for drive home |
| 6. Detect Conflicts | Done | Cross-references against `other_events` array, reports overlap minutes and severity |
| Sandbox gate (`sk_test_` keys) | Done | Returns mock LogisticsObject without any external API calls |
| Resilient failure handling | Done | Each step wrapped in try/catch — partial enrichment returned on failure, never crashes |

---

## 5. API Routes (`apps/api`)

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/health` | GET | None | Health check |
| `/v1/enrich` | POST | API Key | Synchronous single-event enrichment |
| `/v1/enrich/batch` | POST | API Key | Async batch enrichment via BullMQ. Returns `jobId` immediately |
| `/v1/enrich/:jobId` | GET | API Key | Poll batch job status and progress |
| `/v1/ingest` | POST | API Key | Adapter-based ingestion (TeamSnap, ICS, JSON) with optional enrichment |
| `/v1/parse` | POST | API Key | ICS text → CanonicalEvent array (no enrichment) |
| `/v1/feeds` | POST | API Key | Create a subscribable ICS calendar feed |
| `/v1/feeds/:feedId/events` | POST | API Key | Push enriched events to a feed (upsert by external_id) |
| `/v1/feeds/:token` | GET | None | Public ICS feed URL — returns `text/calendar` for calendar app subscription |
| `/documentation/*` | GET | None | Scalar API Reference (auto-generated from OpenAPI spec) |

---

## 6. API Middleware & Plugins

| Plugin | Details |
|--------|---------|
| API Key Authentication | `X-API-Key` header → SHA-256 hash → Supabase lookup with Redis cache (5-min TTL). Injects `request.partnerAuth` |
| Rate Limiting | Per-key rate limit from `api_keys.rate_limit_per_minute` (100/min sandbox, 60/min production) |
| CORS | Configured for portal origin + configurable allowlist |
| Structured Error Handler | Global handler returns `{ error: { code, message, details } }` — no stack traces |
| Swagger / Scalar | `@fastify/swagger` + `fastify-type-provider-zod` → OpenAPI spec → Scalar API Reference |

---

## 7. BullMQ Async Worker

| Item | Status | Details |
|------|--------|---------|
| Separate Railway service | Done | `Orgo-Sync-Worker` — physically isolated from web traffic |
| `enrichment-pipeline` queue | Done | Named queue with configurable concurrency |
| Job progress tracking | Done | `job.updateProgress()` with per-event completion percentage |
| Webhook delivery | Done | HMAC-SHA256 signed POST to partner's `webhook_url` on completion |
| Graceful shutdown | Done | SIGINT/SIGTERM handlers close worker and Redis cleanly |

---

## 8. ICS Calendar Feed Generation

| Item | Status | Details |
|------|--------|---------|
| Feed creation (POST /v1/feeds) | Done | Returns subscribe URL with unique token |
| Event push (POST /v1/feeds/:feedId/events) | Done | Upsert by `external_id`, stores canonical_event + logistics |
| Public ICS endpoint (GET /v1/feeds/:token) | Done | Returns RFC 5545 compliant `text/calendar` with line folding |
| Total Time Blocking | Done | DTSTART = prep start, DTEND = arrive home (full logistics footprint) |
| 5-Minute Rounding | Done | All durations (travel, buffer, early arrival, prep) rounded up to nearest 5 min |
| Orgo UI Description Format | Done | Bullet-point format: preparing → driving to → activity → driving home. 12h am/pm times |
| Weather in description | Done | Temperature, condition, rain chance, wind (when available) |
| Uniform & parking notes | Done | Included in description when present on the canonical event |
| White-label branding footer | Done | Configurable per-feed (e.g. "Powered by LeagueApps") |

---

## 9. NPM SDK (`packages/sdk` → `@orgo/sync`)

| Method | Description |
|--------|-------------|
| `enrich(payload)` | Sync single-event enrichment |
| `enrichBatch(events, webhookUrl?)` | Async batch enrichment, returns jobId |
| `status(jobId)` | Poll batch job status |
| `ingest(source, payload, options?)` | Adapter-based ingestion with `enrich` toggle |
| `parse(icsText)` | Parse ICS text to CanonicalEvent array |
| `createFeed(name, branding?)` | Create a calendar feed |
| `pushToFeed(feedId, events)` | Push events to a feed |
| `getFeedUrl(token)` | Get the public subscribe URL |
| All schemas re-exported | `CanonicalEvent`, `LogisticsObject`, `EnrichResponse`, etc. |

---

## 10. Developer Portal (`apps/portal`)

### Authentication & Access Control
| Item | Status | Details |
|------|--------|---------|
| Supabase Auth (email/password) | Done | `@supabase/ssr` with cookie-based sessions |
| Invite-only (no public signup) | Done | Signup page exists but is not linked — accounts created manually |
| Middleware-protected routes | Done | Redirects unauthenticated users to `/login` |

### Dashboard Pages
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/dashboard` | Organization name, tier, active keys count, total requests, quick actions |
| API Keys | `/dashboard/keys` | Generate sandbox/production keys, inline rename, revoke. Explainer for key types |
| Usage Analytics | `/dashboard/usage` | 14-day usage stats (requests, billable, avg latency, cache rate), Recharts bar/line/area charts (requests over time, avg latency, revenue share earnings), recent requests table |
| API Playground | `/dashboard/playground` | Monaco editor, 4 pre-loaded examples (TeamSnap, ICS, Structured JSON, Conflict Detection), animated pipeline stepper, typewriter response reveal |
| Schema Mapping | `/dashboard/mappings` | LeagueApps → CanonicalEvent field mapping mockup. 53 fields with confidence scores, auto/review/manual status. Monaco editor with source payload. Phase 2 preview badge |
| Calendar Feeds | `/dashboard/feeds` | Create feeds, view active feeds table (name, URL, event count, created), copy subscribe URL. **Live Demo Batch** button |
| Pricing | `/dashboard/pricing` | Three tiers (Sandbox free, Growth $149/mo, Enterprise $499/mo), feature comparison grid, revenue share explainer |
| API Docs | `/docs` | Scalar API Reference rendered from Fastify OpenAPI spec |

### Portal Components & UX
| Item | Status | Details |
|------|--------|---------|
| Dark theme with Light Pillar background | Done | Three.js animated orange/yellow light pillar on dark gray |
| Light panel content area | Done | `.light-panel` class for main content region |
| Dark cards inside light panel | Done | `.dark-card` and `.dark-card-deeper` classes |
| Outfit font family | Done | Google Fonts, all non-mono text |
| JetBrains Mono for code | Done | Monospace font for code blocks, terminal UI |
| Loading skeletons | Done | `loading.tsx` for every dashboard route — instant layout during transitions |
| Partner logo white-label swap | Done | localStorage-backed, hover-to-reveal pencil icon, preset logos (LeagueApps, TeamSnap, PlayMetrics, GameChanger), custom URL input |
| Sidebar navigation | Done | Dashboard, API Keys, Playground, Usage, Feeds, Mappings, Pricing, API Docs |
| Responsive layout | Done | Mobile nav + sidebar collapse |

---

## 11. Live Enrichment Demo ("Magic Trick")

| Item | Status | Details |
|------|--------|---------|
| "Run Live Demo" button on Feeds page | Done | Prominent orange CTA in page header |
| Terminal-style modal | Done | Traffic light dots, monospace font, timestamped color-coded log lines |
| Real API calls | Done | Uses `sk_live_` key (via `NEXT_PUBLIC_DEMO_API_KEY` env var) to hit actual Google/Weather APIs |
| 5-event TeamSnap payload | Done | Austin Panthers U12 Spring 2026 schedule — practices, league games, tournament. Real Austin, TX addresses |
| Pipeline progress log | Done | Shows per-event enrichment status, drive time, weather condition in real time |
| Feed creation + event push | Done | Creates "Austin Panthers U12" feed, pushes all enriched events |
| Subscribe URL display | Done | Large monospace text with copy button |
| QR Code | Done | `qrcode.react` — scannable from across the table, opens ICS feed on iPhone/Android |
| Auto-refresh feeds table | Done | `onFeedCreated` callback refreshes the feeds list after demo completes |

---

## 12. Revenue & Analytics

| Item | Status | Details |
|------|--------|---------|
| `api_usage_log` table | Done | Every API call logged: endpoint, status, latency, event count, cached flag, normalize_only flag |
| 14-day seeded demo data | Done | Realistic backdated entries with varied endpoints, latencies, cache hits |
| Usage stats cards | Done | Total requests, billable, avg latency, cache rate, gross revenue, partner rev share |
| Recharts: Requests Over Time | Done | Stacked BarChart — billable (orange) vs cached (gray) |
| Recharts: Average Latency | Done | LineChart with brand-matched tooltip styling |
| Recharts: Revenue Share Earnings | Done | Green AreaChart showing cumulative partner earnings |
| Rev-share schema fields | Done | `partners.rev_share_pct`, `partners.billing_model`, rate per enrichment ($0.012) |
| Partner type foundation | Done | `partner_type` enum: platform / builder (for future two-sided marketplace) |

---

## 13. External API Integrations

| Service | Usage | Caching |
|---------|-------|---------|
| Google Places API (Text Search) | Geocode raw addresses → coordinates + formatted address + place_id | Redis 7-day TTL |
| Google Routes API (`computeRoutes`) | Traffic-aware drive time + distance between origin and event | Redis 15-min TTL |
| WeatherAPI.com | Forecast for event date at geocoded coordinates | Redis 2-hour TTL |

---

## 14. Accounts Created

| Email | Role | Tier |
|-------|------|------|
| `demo@orgosync.dev` | Demo account | Sandbox |
| `zoya@orgohq.com` | Zoya Lehrer — full access | Enterprise |
| `michael@orgohq.com` | Michael Garvey — full access | Enterprise |

---

## 15. AI Slop Audit (Completed)

- Removed all redundant JSX section comments across dashboard pages
- Replaced generic SaaS marketing copy with domain-specific sports tech language
- Replaced generic placeholders (`you@company.com`, `Default`, `staging`) with real examples (`you@leagueapps.com`, `leagueapps-prod`)
- Stripped AI-telegraphing language ("Orgo AI analyzed..." → "LeagueApps data format — 53 fields mapped")
- No unused imports, dead code, or console.logs in production paths

---

## 16. Deferred to Phase 2

| Item | Reason |
|------|--------|
| Two-Sided Marketplace (Platform/Builder portal) | Major scope — needs OAuth permission workflows, approval queues |
| Stripe billing integration | Separate sprint — webhook wiring, invoice generation, tier enforcement |
| AI Schema Mapping (LangGraph/OpenAI) | Post-funding — static mockup built as pitch visual |
| Bidirectional read/write API (like Google Calendar sync) | Architectural leap — scoped as separate phase |
| Public signup / marketing landing page | Intentionally locked for conference demos — invite-only |

---

## 17. Stress Testing

| Test | Result |
|------|--------|
| Load test script (`apps/api/scripts/load-test.ts`) | Confirmed rate limiting works correctly at configured thresholds |
| 429 response bug | Fixed — was incorrectly converting to 500 INTERNAL_ERROR, now returns proper 429 RATE_LIMIT_EXCEEDED |
| BullMQ worker isolation | Confirmed — worker service processes batch jobs independently of web traffic |
