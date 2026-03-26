import ical from "node-ical";
import type { CanonicalEvent } from "@orgo-sync/schemas";
import type { Adapter, AdapterNormalizeResult } from "./types.js";

export class IcsAdapter implements Adapter {
  readonly source = "ics";

  async normalize(payload: unknown): Promise<AdapterNormalizeResult> {
    const icsText = typeof payload === "string" ? payload : String(payload);
    const parsed = ical.sync.parseICS(icsText);
    const events: CanonicalEvent[] = [];
    const warnings: string[] = [];

    for (const [uid, component] of Object.entries(parsed)) {
      if (component.type !== "VEVENT") continue;

      try {
        const vevent = component as ical.VEvent;
        const start = vevent.start ? new Date(vevent.start) : null;
        const end = vevent.end ? new Date(vevent.end) : null;

        if (!start || isNaN(start.getTime())) {
          warnings.push(`Skipped event ${uid}: invalid start date`);
          continue;
        }

        const resolvedEnd = end && !isNaN(end.getTime()) ? end : new Date(start.getTime() + 60 * 60 * 1000);
        const durationMinutes = Math.round((resolvedEnd.getTime() - start.getTime()) / 60000);

        const event: CanonicalEvent = {
          source: {
            platform: "ics",
            external_id: uid,
          },
          title: vevent.summary ?? "Untitled Event",
          description: vevent.description ?? null,
          start: start.toISOString(),
          end: resolvedEnd.toISOString(),
          duration_minutes: durationMinutes,
          all_day: false,
          is_tbd: false,
          is_canceled: vevent.status === "CANCELLED",
          status: mapIcsStatus(vevent.status),
          timezone: null,
          location: {
            raw: vevent.location ?? null,
            venue_name: null,
            address: vevent.location ?? null,
            coordinates: extractGeo(vevent),
            additional_details: null,
          },
          sport: {
            event_type: null,
            team_name: null,
            opponent_name: null,
            uniform: null,
            early_arrival_minutes: 0,
            label: null,
            is_game: false,
          },
          participants: [],
          recurrence: null,
          notes: null,
        };

        events.push(event);
      } catch (err) {
        warnings.push(`Failed to parse event ${uid}: ${(err as Error).message}`);
      }
    }

    return { events, warnings };
  }
}

function mapIcsStatus(status?: string): "confirmed" | "tentative" | "canceled" {
  switch (status?.toUpperCase()) {
    case "CANCELLED": return "canceled";
    case "TENTATIVE": return "tentative";
    default: return "confirmed";
  }
}

function extractGeo(vevent: ical.VEvent): { lat: number; lng: number } | null {
  const geo = (vevent as Record<string, unknown>).geo;
  if (geo && typeof geo === "object" && "lat" in (geo as object) && "lon" in (geo as object)) {
    const g = geo as { lat: number; lon: number };
    return { lat: g.lat, lng: g.lon };
  }
  return null;
}
