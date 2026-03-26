import { z } from "zod";

export const PartnerTier = z.enum(["sandbox", "growth", "enterprise"]);
export type PartnerTier = z.infer<typeof PartnerTier>;

export const PartnerType = z.enum(["platform", "builder", "internal"]);
export type PartnerType = z.infer<typeof PartnerType>;

export const BillingModel = z.enum(["per_enrichment", "flat", "hybrid"]);
export type BillingModel = z.infer<typeof BillingModel>;

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  org_name: z.string(),
  contact_email: z.string().email(),
  platform_slug: z.string().nullable().default(null),
  tier: PartnerTier.default("sandbox"),
  partner_type: PartnerType.default("platform"),
  rev_share_pct: z.number().default(0),
  billing_model: BillingModel.default("per_enrichment"),
  monthly_enrichment_cap: z.number().nullable().default(null),
  is_active: z.boolean().default(true),
  activated_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime(),
});

export type Partner = z.infer<typeof PartnerSchema>;

export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  partner_id: z.string().uuid(),
  key_prefix: z.string(),
  name: z.string(),
  is_sandbox: z.boolean(),
  rate_limit_per_minute: z.number(),
  revoked_at: z.string().datetime().nullable().default(null),
  last_used_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
