import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    url: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/documentation/json`,
  },
  theme: "kepler" as const,
  darkMode: true,
  metaData: {
    title: "Orgo Sync API Reference",
    description: "Scheduling Intelligence API — Enrich any sports event with logistics data.",
  },
  hideModels: false,
  showSidebar: true,
};

export const GET = ApiReference(config);
