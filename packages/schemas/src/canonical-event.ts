import { z } from "zod";
import {
  CoordinatesSchema,
  SportEventType,
  ParticipantRole,
  AvailabilityStatus,
  RecurrenceFrequency,
} from "./common.js";

const EventSourceSchema = z.object({
  platform: z.string(),
  external_id: z.string(),
  raw_payload: z.any().optional(),
});

const EventLocationSchema = z.object({
  raw: z.string().nullable().default(null),
  venue_name: z.string().nullable().default(null),
  address: z.string().nullable().default(null),
  coordinates: CoordinatesSchema.nullable().default(null),
  additional_details: z.string().nullable().default(null),
});

const SportDetailsSchema = z.object({
  event_type: SportEventType.nullable().default(null),
  team_name: z.string().nullable().default(null),
  opponent_name: z.string().nullable().default(null),
  uniform: z.string().nullable().default(null),
  early_arrival_minutes: z.number().default(0),
  label: z.string().nullable().default(null),
  is_game: z.boolean().default(false),
});

const ParticipantSchema = z.object({
  name: z.string(),
  role: ParticipantRole.nullable().default(null),
  jersey_number: z.string().nullable().default(null),
  availability: AvailabilityStatus.default("unknown"),
});

const RecurrenceSchema = z.object({
  frequency: RecurrenceFrequency.nullable().default(null),
  interval: z.number().nullable().default(null),
  by_day: z.string().nullable().default(null),
  until: z.string().datetime({ offset: true }).nullable().default(null),
  count: z.number().nullable().default(null),
});

export const CanonicalEventSchema = z.object({
  source: EventSourceSchema,

  title: z.string(),
  description: z.string().nullable().default(null),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  duration_minutes: z.number(),
  all_day: z.boolean().default(false),
  is_tbd: z.boolean().default(false),
  is_canceled: z.boolean().default(false),
  status: z
    .enum(["confirmed", "tentative", "canceled"])
    .default("confirmed"),
  timezone: z.string().nullable().default(null),

  location: EventLocationSchema.default({}),

  sport: SportDetailsSchema.default({}),

  participants: z.array(ParticipantSchema).default([]),

  recurrence: RecurrenceSchema.nullable().default(null),

  notes: z.string().nullable().default(null),
});

export type CanonicalEvent = z.infer<typeof CanonicalEventSchema>;

export {
  EventSourceSchema,
  EventLocationSchema,
  SportDetailsSchema,
  ParticipantSchema,
  RecurrenceSchema,
};
