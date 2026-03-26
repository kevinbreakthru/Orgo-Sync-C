# Orgo Sync

Scheduling Intelligence API — Enrich any sports event with logistics, weather, and conflict data.

## Architecture

| Component | Stack | Deployment |
|-----------|-------|------------|
| **API** | Fastify 5, BullMQ 5, Redis 7 | Railway |
| **Portal** | Next.js 15, Tailwind CSS, Scalar | Vercel |
| **Schemas** | Zod (shared types) | npm workspace |
| **SDK** | TypeScript, zero deps | `@orgo/sync` |
| **Database** | Supabase (PostgreSQL + Auth) | supabase.co |

## Monorepo Structure

```
apps/
  api/       → Fastify enrichment engine + BullMQ workers
  portal/    → Next.js developer portal + dashboard

packages/
  schemas/   → Canonical Event & Logistics Object Zod schemas
  sdk/       → @orgo/sync npm package
  tsconfig/  → Shared TypeScript configs
```

## Development

```bash
pnpm install
pnpm dev
```

API runs on `localhost:3001`, Portal on `localhost:3000`.

## Environment Variables

See `.env` templates in `apps/api/` and `apps/portal/`.
