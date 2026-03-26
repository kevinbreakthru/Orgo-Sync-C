import { z } from "zod";
import { CoordinatesSchema } from "./common.js";

const OriginSchema = z.object({
  address: z.string().optional(),
  coordinates: CoordinatesSchema.optional(),
});

export const EnrichRequestSchema = z.object({
  title: z.string(),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  location: z.string().optional(),
  origin: OriginSchema.optional(),
  description: z.string().optional(),
  timezone: z.string().optional(),
  sport: z
    .object({
      event_type: z.string().optional(),
      team_name: z.string().optional(),
      opponent_name: z.string().optional(),
      uniform: z.string().optional(),
      early_arrival_minutes: z.number().optional(),
    })
    .optional(),
  other_events: z
    .array(
      z.object({
        title: z.string(),
        start: z.string().datetime({ offset: true }),
        end: z.string().datetime({ offset: true }),
        location: z.string().optional(),
      })
    )
    .optional(),
  enrich: z.boolean().default(true),
});

export type EnrichRequest = z.infer<typeof EnrichRequestSchema>;

export const EnrichBatchRequestSchema = z.object({
  events: z.array(EnrichRequestSchema).min(1).max(50),
  origin: OriginSchema.optional(),
  webhook_url: z.string().url().optional(),
  enrich: z.boolean().default(true),
});

export type EnrichBatchRequest = z.infer<typeof EnrichBatchRequestSchema>;
