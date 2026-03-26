import { z } from "zod";
import { CanonicalEventSchema } from "./canonical-event.js";
import {
  CoordinatesSchema,
  WeatherConditionSchema,
  EnrichmentStatus,
  ConflictSeverity,
  TravelMode,
} from "./common.js";

const GeocodedLocationSchema = z.object({
  formatted_address: z.string(),
  place_id: z.string(),
  coordinates: CoordinatesSchema,
});

const DriveTimeSchema = z.object({
  origin_address: z.string(),
  origin_coordinates: CoordinatesSchema,
  destination_coordinates: CoordinatesSchema,
  distance_meters: z.number(),
  duration_seconds: z.number(),
  duration_in_traffic_seconds: z.number().nullable().default(null),
  travel_mode: TravelMode.default("drive"),
});

const WeatherForecastSchema = z.object({
  at_event_start: WeatherConditionSchema,
  at_event_end: WeatherConditionSchema.nullable().default(null),
  precipitation_chance_pct: z.number().nullable().default(null),
  wind_mph: z.number().nullable().default(null),
  humidity_pct: z.number().nullable().default(null),
  uv_index: z.number().nullable().default(null),
  advisory: z.string().nullable().default(null),
});

const TimelineSchema = z.object({
  prep_starts: z.string().datetime(),
  depart_by: z.string().datetime(),
  arrive_by: z.string().datetime(),
  event_starts: z.string().datetime(),
  event_ends: z.string().datetime(),
  arrive_home: z.string().datetime(),
  total_logistics_start: z.string().datetime(),
  total_logistics_end: z.string().datetime(),
  prep_minutes: z.number(),
  travel_minutes: z.number(),
  drive_home_minutes: z.number(),
  early_arrival_minutes: z.number(),
  buffer_minutes: z.number(),
});

const ConflictSchema = z.object({
  conflicting_event_title: z.string(),
  conflicting_event_start: z.string().datetime(),
  conflicting_event_end: z.string().datetime(),
  overlap_minutes: z.number(),
  severity: ConflictSeverity,
});

export const LogisticsObjectSchema = z.object({
  event: CanonicalEventSchema,

  enrichment: z.object({
    status: EnrichmentStatus,
    geocoded_location: GeocodedLocationSchema.nullable().default(null),
    drive_time: DriveTimeSchema.nullable().default(null),
    weather: WeatherForecastSchema.nullable().default(null),
    timeline: TimelineSchema.nullable().default(null),
    conflicts: z.array(ConflictSchema).default([]),
    enriched_at: z.string().datetime(),
    processing_ms: z.number(),
  }),

  sandbox: z.boolean().default(false),
});

export type LogisticsObject = z.infer<typeof LogisticsObjectSchema>;

export {
  GeocodedLocationSchema,
  DriveTimeSchema,
  WeatherForecastSchema,
  TimelineSchema,
  ConflictSchema,
};
