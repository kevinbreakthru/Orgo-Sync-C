import type { Adapter } from "./types.js";
import { TeamSnapAdapter } from "./teamsnap.adapter.js";
import { IcsAdapter } from "./ics.adapter.js";
import { JsonPassthroughAdapter } from "./json.adapter.js";

const adapterRegistry = new Map<string, Adapter>([
  ["teamsnap", new TeamSnapAdapter()],
  ["ics", new IcsAdapter()],
  ["json", new JsonPassthroughAdapter()],
]);

export function resolveAdapter(source: string): Adapter | undefined {
  return adapterRegistry.get(source);
}

export { TeamSnapAdapter, IcsAdapter, JsonPassthroughAdapter };
export type { Adapter, AdapterNormalizeResult } from "./types.js";
