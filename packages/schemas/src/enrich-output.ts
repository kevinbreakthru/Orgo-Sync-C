import { z } from "zod";
import { LogisticsObjectSchema } from "./logistics-object.js";
import { CanonicalEventSchema } from "./canonical-event.js";
import { JobStatus } from "./common.js";

export const EnrichResponseSchema = z.object({
  success: z.boolean(),
  data: LogisticsObjectSchema,
  request_id: z.string().uuid(),
});

export type EnrichResponse = z.infer<typeof EnrichResponseSchema>;

export const NormalizeOnlyResponseSchema = z.object({
  success: z.boolean(),
  events: z.array(CanonicalEventSchema),
  event_count: z.number(),
  request_id: z.string().uuid(),
  normalize_only: z.literal(true),
});

export type NormalizeOnlyResponse = z.infer<typeof NormalizeOnlyResponseSchema>;

export const BatchJobResponseSchema = z.object({
  success: z.boolean(),
  job_id: z.string(),
  status: JobStatus,
  total_events: z.number(),
  webhook_url: z.string().url().nullable().default(null),
});

export type BatchJobResponse = z.infer<typeof BatchJobResponseSchema>;

export const JobStatusResponseSchema = z.object({
  job_id: z.string(),
  status: JobStatus,
  progress: z.number().min(0).max(100),
  total_events: z.number(),
  completed_events: z.number(),
  results: z.array(LogisticsObjectSchema).optional(),
  error: z.string().optional(),
});

export type JobStatusResponse = z.infer<typeof JobStatusResponseSchema>;
