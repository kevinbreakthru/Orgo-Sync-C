import { z } from "zod";
import { CanonicalEventSchema } from "./canonical-event.js";

export const ParseResponseSchema = z.object({
  success: z.boolean(),
  events: z.array(CanonicalEventSchema),
  event_count: z.number(),
  source: z.string(),
});

export type ParseResponse = z.infer<typeof ParseResponseSchema>;
