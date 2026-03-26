import type { CanonicalEvent } from "@orgo-sync/schemas";

interface ConflictResult {
  conflicting_event_title: string;
  conflicting_event_start: string;
  conflicting_event_end: string;
  overlap_minutes: number;
  severity: "hard" | "soft";
}

export function detectScheduleConflicts(
  primaryEvent: CanonicalEvent,
  otherEvents: Array<{ title: string; start: string; end: string }>,
  travelMinutes: number,
  earlyArrivalMinutes: number
): ConflictResult[] {
  const conflicts: ConflictResult[] = [];

  const earlyArrival = primaryEvent.sport?.early_arrival_minutes ?? earlyArrivalMinutes;
  const primaryStart = new Date(primaryEvent.start).getTime() - earlyArrival * 60000 - travelMinutes * 60000;
  const primaryEnd = new Date(primaryEvent.end).getTime();

  for (const other of otherEvents) {
    const otherStart = new Date(other.start).getTime();
    const otherEnd = new Date(other.end).getTime();

    const overlapStart = Math.max(primaryStart, otherStart);
    const overlapEnd = Math.min(primaryEnd, otherEnd);
    const overlapMs = overlapEnd - overlapStart;

    if (overlapMs > 0) {
      const overlapMinutes = Math.ceil(overlapMs / 60000);
      const eventOverlapStart = Math.max(new Date(primaryEvent.start).getTime(), otherStart);
      const eventOverlapEnd = Math.min(primaryEnd, otherEnd);
      const isHard = eventOverlapEnd - eventOverlapStart > 0;

      conflicts.push({
        conflicting_event_title: other.title,
        conflicting_event_start: other.start,
        conflicting_event_end: other.end,
        overlap_minutes: overlapMinutes,
        severity: isHard ? "hard" : "soft",
      });
    }
  }

  return conflicts;
}
