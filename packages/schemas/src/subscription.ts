import { z } from "zod";

export const ApprovalStatus = z.enum(["pending", "approved", "denied"]);
export type ApprovalStatus = z.infer<typeof ApprovalStatus>;

export const WebhookSubscriptionSchema = z.object({
  id: z.string().uuid(),
  publisher_id: z.string().uuid(),
  subscriber_id: z.string().uuid(),
  endpoint_url: z.string().url(),
  event_filters: z.array(z.string()).default(["*"]),
  description: z.string().nullable().default(null),
  is_active: z.boolean().default(true),
  approval_status: ApprovalStatus.default("pending"),
  failure_count: z.number().default(0),
  disabled_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const CreateSubscriptionSchema = z.object({
  publisher_id: z.string().uuid().optional(),
  subscriber_id: z.string().uuid().optional(),
  endpoint_url: z.string().url().refine(
    (url) => url.startsWith("https://"),
    { message: "Webhook endpoints must use HTTPS" }
  ),
  event_filters: z.array(z.string()).default(["*"]),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.publisher_id && !data.subscriber_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either publisher_id or subscriber_id must be provided",
      path: ["publisher_id"],
    });
  }
});

export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;

export const UpdateSubscriptionSchema = z.object({
  endpoint_url: z.string().url().refine(
    (url) => url.startsWith("https://"),
    { message: "Webhook endpoints must use HTTPS" }
  ).optional(),
  event_filters: z.array(z.string()).optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  regenerate_secret: z.boolean().optional(),
});

export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;

export const DeliveryLogSchema = z.object({
  id: z.string().uuid(),
  subscription_id: z.string().uuid(),
  delivery_id: z.string(),
  event_type: z.string(),
  status: z.enum(["pending", "delivered", "failed", "exhausted"]),
  attempts: z.number(),
  last_status_code: z.number().nullable().default(null),
  last_error: z.string().nullable().default(null),
  payload_size_bytes: z.number().nullable().default(null),
  created_at: z.string().datetime(),
  delivered_at: z.string().datetime().nullable().default(null),
});

export type DeliveryLog = z.infer<typeof DeliveryLogSchema>;
