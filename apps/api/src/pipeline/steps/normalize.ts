import { CanonicalEventSchema, type CanonicalEvent } from "@orgo-sync/schemas";

export function validateCanonicalEvent(event: unknown): CanonicalEvent {
  return CanonicalEventSchema.parse(event);
}
