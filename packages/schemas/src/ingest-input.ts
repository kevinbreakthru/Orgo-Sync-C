import { z } from "zod";

export const AdapterSource = z.enum(["teamsnap", "ics", "json"]);
export type AdapterSource = z.infer<typeof AdapterSource>;

export const IngestRequestSchema = z.object({
  source: AdapterSource,
  payload: z.any(),
  mapping_id: z.string().uuid().optional(),
  origin: z
    .object({
      address: z.string().optional(),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
    })
    .optional(),
  enrich: z.boolean().default(true),
  webhook_url: z.string().url().optional(),
});

export type IngestRequest = z.infer<typeof IngestRequestSchema>;
