import type { CanonicalEvent } from "@orgo-sync/schemas";

export interface AdapterNormalizeResult {
  events: CanonicalEvent[];
  warnings: string[];
}

export interface Adapter {
  readonly source: string;
  normalize(payload: unknown): Promise<AdapterNormalizeResult>;
}
