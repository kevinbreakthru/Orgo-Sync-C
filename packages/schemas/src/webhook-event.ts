import { z } from "zod";
import { CanonicalEventSchema } from "./canonical-event.js";

export const OutboundWebhookPayloadSchema = z.object({
  event_type: z.enum(["event.created", "event.updated", "event.deleted"]),
  delivery_id: z.string(),
  subscription_id: z.string().uuid(),
  publisher: z.object({
    partner_id: z.string().uuid(),
    org_name: z.string(),
  }),
  data: z.union([
    CanonicalEventSchema,
    z.object({ external_id: z.string() }),
  ]),
  timestamp: z.string().datetime(),
});

export type OutboundWebhookPayload = z.infer<typeof OutboundWebhookPayloadSchema>;
