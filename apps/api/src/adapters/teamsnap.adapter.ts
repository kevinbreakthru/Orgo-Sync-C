import { CanonicalEventSchema, type CanonicalEvent } from "@orgo-sync/schemas";
import pino from "pino";
import type { Adapter, AdapterNormalizeResult } from "./types.js";

const logger = pino({ name: "teamsnap-adapter" });

interface TeamSnapEvent {
  id?: number | string;
  name?: string;
  start_date?: string;
  end_date?: string;
  duration_in_minutes?: number;
  is_tbd?: boolean;
  is_canceled?: boolean;
  time_zone_iana_name?: string;
  location_name?: string;
  additional_location_details?: string;
  is_game?: boolean;
  game_type?: string;
  opponent_name?: string;
  uniform?: string;
  minutes_to_arrive_early?: number;
  label?: string;
  notes?: string;
  repeating_type?: string;
  team_name?: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  roster?: Array<{
    name?: string;
    role?: string;
    jersey_number?: string;
    availability?: string;
  }>;
}

export class TeamSnapAdapter implements Adapter {
  readonly source = "teamsnap";

  async normalize(payload: unknown): Promise<AdapterNormalizeResult> {
    const rawEvents = extractTeamSnapEvents(payload);
    const events: CanonicalEvent[] = [];
    const warnings: string[] = [];

    logger.info({ rawEventCount: rawEvents.length }, "Normalizing TeamSnap payload");

    for (const raw of rawEvents) {
      try {
        const mapped = mapTeamSnapToCanonical(raw);
        const validated = CanonicalEventSchema.parse(mapped);
        events.push(validated);
      } catch (err) {
        const msg = `Skipped TeamSnap event ${raw.id ?? "unknown"}: ${(err as Error).message}`;
        warnings.push(msg);
        logger.warn({ eventId: raw.id, error: (err as Error).message }, "Event normalization failed");
      }
    }

    logger.info({ accepted: events.length, skipped: warnings.length }, "TeamSnap normalization complete");
    return { events, warnings };
  }
}

function extractTeamSnapEvents(payload: unknown): TeamSnapEvent[] {
  if (Array.isArray(payload)) return payload;

  const obj = payload as Record<string, unknown>;

  // Collection+JSON format: { collection: { items: [{ data: [{ name, value }] }] } }
  if (obj.collection && typeof obj.collection === "object") {
    const collection = obj.collection as Record<string, unknown>;
    if (Array.isArray(collection.items)) {
      return collection.items.map(parseCollectionItem);
    }
  }

  // Envelope format: { data: [...] } or { data: { ... } }
  if (obj.data && typeof obj.data === "object") {
    return Array.isArray(obj.data) ? obj.data : [obj.data as TeamSnapEvent];
  }

  return [payload as TeamSnapEvent];
}

function parseCollectionItem(item: unknown): TeamSnapEvent {
  const record = item as Record<string, unknown>;
  if (!record.data || !Array.isArray(record.data)) return record as TeamSnapEvent;

  const mapped: Record<string, unknown> = {};
  for (const field of record.data as Array<{ name: string; value: unknown }>) {
    mapped[field.name] = field.value;
  }
  return mapped as unknown as TeamSnapEvent;
}

function mapTeamSnapToCanonical(raw: TeamSnapEvent): CanonicalEvent {
  const start = raw.start_date ? new Date(raw.start_date) : new Date();
  let end: Date;

  if (raw.end_date) {
    end = new Date(raw.end_date);
  } else if (raw.duration_in_minutes) {
    end = new Date(start.getTime() + raw.duration_in_minutes * 60000);
  } else {
    end = new Date(start.getTime() + 60 * 60000);
  }

  const durationMinutes = raw.duration_in_minutes
    ?? Math.round((end.getTime() - start.getTime()) / 60000);

  const coordinates = raw.location?.latitude != null && raw.location?.longitude != null
    ? { lat: raw.location.latitude, lng: raw.location.longitude }
    : null;

  const title = raw.is_game && raw.team_name && raw.opponent_name
    ? `${raw.team_name} vs ${raw.opponent_name}`
    : raw.name ?? "TeamSnap Event";

  return {
    source: {
      platform: "teamsnap",
      external_id: String(raw.id ?? `ts_${Date.now()}`),
    },
    title,
    description: null,
    start: start.toISOString(),
    end: end.toISOString(),
    duration_minutes: durationMinutes,
    all_day: false,
    is_tbd: raw.is_tbd ?? false,
    is_canceled: raw.is_canceled ?? false,
    status: raw.is_canceled ? "canceled" : "confirmed",
    timezone: raw.time_zone_iana_name ?? null,
    location: {
      raw: raw.location_name ?? null,
      venue_name: raw.location_name ?? null,
      address: raw.location?.address ?? null,
      coordinates,
      additional_details: raw.additional_location_details ?? null,
    },
    sport: {
      event_type: mapGameType(raw.game_type, raw.is_game),
      team_name: raw.team_name ?? null,
      opponent_name: raw.opponent_name ?? null,
      uniform: raw.uniform ?? null,
      early_arrival_minutes: raw.minutes_to_arrive_early ?? 0,
      label: raw.label ?? null,
      is_game: raw.is_game ?? false,
    },
    participants: (raw.roster ?? []).map((m) => ({
      name: m.name ?? "Unknown",
      role: mapParticipantRole(m.role),
      jersey_number: m.jersey_number ?? null,
      availability: mapAvailability(m.availability),
    })),
    recurrence: mapRecurrence(raw.repeating_type),
    notes: raw.notes ?? null,
  };
}

function mapGameType(
  gameType?: string,
  isGame?: boolean
): "game" | "practice" | "tournament" | "meeting" | "other" | null {
  if (!gameType && !isGame) return null;
  const normalized = (gameType ?? "").toLowerCase();
  if (normalized.includes("game") || isGame) return "game";
  if (normalized.includes("practice")) return "practice";
  if (normalized.includes("tournament")) return "tournament";
  if (normalized.includes("meeting")) return "meeting";
  return "other";
}

function mapParticipantRole(
  role?: string
): "player" | "coach" | "manager" | "parent" | "other" | null {
  if (!role) return null;
  const normalized = role.toLowerCase();
  if (normalized.includes("player") || normalized.includes("member")) return "player";
  if (normalized.includes("coach")) return "coach";
  if (normalized.includes("manager")) return "manager";
  if (normalized.includes("parent") || normalized.includes("guardian")) return "parent";
  return "other";
}

function mapAvailability(status?: string): "yes" | "no" | "maybe" | "unknown" {
  if (!status) return "unknown";
  const normalized = status.toLowerCase();
  if (normalized === "yes" || normalized === "available") return "yes";
  if (normalized === "no" || normalized === "unavailable") return "no";
  if (normalized === "maybe") return "maybe";
  return "unknown";
}

function mapRecurrence(repeatingType?: string): CanonicalEvent["recurrence"] {
  if (!repeatingType) return null;
  const normalized = repeatingType.toLowerCase();
  if (normalized === "daily") return { frequency: "daily", interval: null, by_day: null, until: null, count: null };
  if (normalized === "weekly") return { frequency: "weekly", interval: null, by_day: null, until: null, count: null };
  if (normalized === "monthly") return { frequency: "monthly", interval: null, by_day: null, until: null, count: null };
  return null;
}
