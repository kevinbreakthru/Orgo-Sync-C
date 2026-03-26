import { z } from "zod";
import { AdapterSource } from "./ingest-input.js";

export const PublishAction = z.enum(["created", "updated", "deleted"]);
export type PublishAction = z.infer<typeof PublishAction>;

export const PublishEventSchema = z.object({
  action: PublishAction,
  source: AdapterSource,
  payload: z.any(),
  idempotency_key: z.string().optional(),
});

export type PublishEvent = z.infer<typeof PublishEventSchema>;

const OriginSchema = z.object({
  address: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const PublishRequestSchema = z.object({
  events: z.array(PublishEventSchema).min(1).max(100),
  origin: OriginSchema.optional(),
});

export type PublishRequest = z.infer<typeof PublishRequestSchema>;

export const PublishResponseSchema = z.object({
  accepted: z.literal(true),
  event_count: z.number(),
  subscribers_notified: z.number(),
  request_id: z.string().uuid(),
  duplicates_skipped: z.number().default(0),
});

export type PublishResponse = z.infer<typeof PublishResponseSchema>;
