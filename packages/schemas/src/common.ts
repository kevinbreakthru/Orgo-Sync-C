import { z } from "zod";

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const SportEventType = z.enum([
  "game",
  "practice",
  "tournament",
  "meeting",
  "other",
]);
export type SportEventType = z.infer<typeof SportEventType>;

export const ParticipantRole = z.enum([
  "player",
  "coach",
  "manager",
  "parent",
  "other",
]);
export type ParticipantRole = z.infer<typeof ParticipantRole>;

export const AvailabilityStatus = z.enum([
  "yes",
  "no",
  "maybe",
  "unknown",
]);
export type AvailabilityStatus = z.infer<typeof AvailabilityStatus>;

export const RecurrenceFrequency = z.enum([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
export type RecurrenceFrequency = z.infer<typeof RecurrenceFrequency>;

export const TravelMode = z.enum(["drive", "transit", "walk", "bicycle"]);
export type TravelMode = z.infer<typeof TravelMode>;

export const ConflictSeverity = z.enum(["hard", "soft"]);
export type ConflictSeverity = z.infer<typeof ConflictSeverity>;

export const EnrichmentStatus = z.enum(["completed", "partial", "failed"]);
export type EnrichmentStatus = z.infer<typeof EnrichmentStatus>;

export const JobStatus = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
]);
export type JobStatus = z.infer<typeof JobStatus>;

export const WeatherConditionSchema = z.object({
  temp_f: z.number(),
  temp_c: z.number(),
  condition: z.string(),
  condition_icon: z.string(),
  is_day: z.boolean(),
});
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
