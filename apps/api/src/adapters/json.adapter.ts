import { CanonicalEventSchema, type CanonicalEvent } from "@orgo-sync/schemas";
import type { Adapter, AdapterNormalizeResult } from "./types.js";

export class JsonPassthroughAdapter implements Adapter {
  readonly source = "json";

  async normalize(payload: unknown): Promise<AdapterNormalizeResult> {
    const events: CanonicalEvent[] = [];
    const warnings: string[] = [];

    const items = Array.isArray(payload) ? payload : [payload];

    for (let i = 0; i < items.length; i++) {
      const parsed = CanonicalEventSchema.safeParse(items[i]);
      if (parsed.success) {
        events.push(parsed.data);
      } else {
        warnings.push(
          `Event at index ${i} failed validation: ${parsed.error.errors.map((e) => e.message).join(", ")}`
        );
      }
    }

    return { events, warnings };
  }
}
