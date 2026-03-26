import type { CanonicalEvent, LogisticsObject } from "@orgo-sync/schemas";

function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  const MAX = 75;
  if (line.length <= MAX) return line;
  const parts: string[] = [line.slice(0, MAX)];
  let pos = MAX;
  while (pos < line.length) {
    parts.push(" " + line.slice(pos, pos + MAX - 1));
    pos += MAX - 1;
  }
  return parts.join("\r\n");
}

function toIcsDatetime(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function formatTime12h(iso: string, tz?: string | null): string {
  try {
    const d = new Date(iso);
    return d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: tz || undefined,
      })
      .toLowerCase()
      .replace(/\s/g, "");
  } catch {
    const d = new Date(iso);
    return d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(/\s/g, "");
  }
}

function metersToDisplay(m: number): string {
  const mi = m / 1609.344;
  if (mi >= 1) return `${mi.toFixed(1)} mi`;
  return `${(m / 1000).toFixed(1)} km`;
}

function buildDescription(
  event: CanonicalEvent,
  logistics: LogisticsObject["enrichment"] | null,
  branding?: { footer?: string }
): string {
  const lines: string[] = [];
  const tz = event.timezone;

  if (logistics?.timeline) {
    const tl = logistics.timeline;

    lines.push(
      `• Start preparing at ${formatTime12h(tl.prep_starts, tz)}.`
    );

    if (logistics.drive_time) {
      const dest =
        event.location?.address ||
        event.location?.venue_name ||
        event.location?.raw ||
        "the event";

      lines.push(
        `• You start driving at ${formatTime12h(tl.depart_by, tz)} to ${dest}, arriving by ${formatTime12h(tl.arrive_by, tz)}.`
      );
    } else {
      lines.push(
        `• Leave by ${formatTime12h(tl.depart_by, tz)}, arriving by ${formatTime12h(tl.arrive_by, tz)}.`
      );
    }

    lines.push(
      `• The activity is from ${formatTime12h(tl.event_starts, tz)} to ${formatTime12h(tl.event_ends, tz)}.`
    );

    if (logistics.drive_time && tl.arrive_home) {
      lines.push(
        `• You drive home, arriving at ${formatTime12h(tl.arrive_home, tz)}.`
      );
    }
  }

  if (logistics?.weather?.at_event_start) {
    const w = logistics.weather;
    const parts: string[] = [
      `${w.at_event_start.temp_f}\u00B0F`,
      w.at_event_start.condition,
    ];
    if (w.precipitation_chance_pct != null)
      parts.push(`${w.precipitation_chance_pct}% rain`);
    if (w.wind_mph != null) parts.push(`Wind ${w.wind_mph} mph`);
    lines.push("");
    lines.push(`Weather: ${parts.join(", ")}`);
    if (w.advisory) lines.push(`Advisory: ${w.advisory}`);
  }

  if (logistics?.conflicts && logistics.conflicts.length > 0) {
    lines.push("");
    for (const c of logistics.conflicts) {
      lines.push(
        `Conflict: ${c.conflicting_event_title} (${c.overlap_minutes} min overlap)`
      );
    }
  }

  if (event.sport?.uniform) {
    lines.push("");
    lines.push(`Uniform: ${event.sport.uniform}`);
  }

  if (event.location?.additional_details) {
    lines.push(`Note: ${event.location.additional_details}`);
  }

  if (event.description) {
    lines.push("");
    lines.push(event.description);
  }

  lines.push("");
  lines.push(branding?.footer ?? "Powered by Orgo Sync");

  return lines.join("\n");
}

interface FeedEvent {
  canonical_event: CanonicalEvent;
  logistics: LogisticsObject["enrichment"] | null;
}

interface FeedOptions {
  name: string;
  branding?: { footer?: string };
}

export function generateIcsFeed(
  events: FeedEvent[],
  options: FeedOptions
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Orgo Sync//Calendar Feed//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    foldLine(`X-WR-CALNAME:${icsEscape(options.name)}`),
    "X-WR-TIMEZONE:America/Chicago",
  ];

  for (const fe of events) {
    const ev = fe.canonical_event;
    const uid = `${ev.source.external_id}@orgosync.com`;
    const description = buildDescription(ev, fe.logistics, options.branding);
    const location = ev.location?.address || ev.location?.raw || "";

    const tl = fe.logistics?.timeline;
    const blockStart = tl?.total_logistics_start ?? ev.start;
    const blockEnd = tl?.total_logistics_end ?? ev.end;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${icsEscape(uid)}`);
    lines.push(`DTSTART:${toIcsDatetime(blockStart)}`);
    lines.push(`DTEND:${toIcsDatetime(blockEnd)}`);
    lines.push(foldLine(`SUMMARY:${icsEscape(ev.title)}`));
    lines.push(foldLine(`DESCRIPTION:${icsEscape(description)}`));
    if (location) {
      lines.push(foldLine(`LOCATION:${icsEscape(location)}`));
    }
    if (ev.location?.coordinates) {
      lines.push(
        `GEO:${ev.location.coordinates.lat};${ev.location.coordinates.lng}`
      );
    }
    if (ev.is_canceled) {
      lines.push("STATUS:CANCELLED");
    } else if (ev.status === "tentative") {
      lines.push("STATUS:TENTATIVE");
    } else {
      lines.push("STATUS:CONFIRMED");
    }
    lines.push(`DTSTAMP:${toIcsDatetime(new Date().toISOString())}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
