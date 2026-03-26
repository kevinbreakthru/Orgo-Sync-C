FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

FROM base AS build
WORKDIR /app
ENV CI=true

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/tsconfig/ packages/tsconfig/
COPY packages/schemas/package.json packages/schemas/
COPY packages/schemas/tsconfig.json packages/schemas/
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/schemas/src/ packages/schemas/src/
COPY apps/api/src/ apps/api/src/

RUN pnpm --filter @orgo-sync/schemas build
RUN pnpm --filter @orgo-sync/api build

RUN pnpm deploy --filter @orgo-sync/api --prod --legacy /app/deploy

FROM node:20-slim AS runtime
WORKDIR /app

COPY --from=build /app/deploy ./
COPY --from=build /app/apps/api/dist ./dist

EXPOSE 3001
CMD ["node", "dist/server.js"]
