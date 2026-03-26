interface TimelineInput {
  event_start: string;
  event_end: string;
  travel_seconds: number | null;
  early_arrival_minutes: number;
  prep_minutes?: number;
  buffer_minutes?: number;
}

interface TimelineResult {
  prep_starts: string;
  depart_by: string;
  arrive_by: string;
  event_starts: string;
  event_ends: string;
  arrive_home: string;
  total_logistics_start: string;
  total_logistics_end: string;
  prep_minutes: number;
  travel_minutes: number;
  drive_home_minutes: number;
  early_arrival_minutes: number;
  buffer_minutes: number;
}

const DEFAULT_PREP_MINUTES = 10;
const DEFAULT_BUFFER_MINUTES = 5;

function roundUpToFive(minutes: number): number {
  return Math.ceil(minutes / 5) * 5;
}

export function buildEventTimeline(input: TimelineInput): TimelineResult {
  const prepMinutes = roundUpToFive(input.prep_minutes ?? DEFAULT_PREP_MINUTES);
  const bufferMinutes = roundUpToFive(input.buffer_minutes ?? DEFAULT_BUFFER_MINUTES);
  const rawTravelMinutes = input.travel_seconds ? Math.ceil(input.travel_seconds / 60) : 0;
  const travelMinutes = roundUpToFive(rawTravelMinutes);
  const driveHomeMinutes = travelMinutes;
  const earlyArrival = roundUpToFive(input.early_arrival_minutes);

  const eventStart = new Date(input.event_start);
  const eventEnd = new Date(input.event_end);

  const arriveBy = new Date(eventStart.getTime() - earlyArrival * 60000);
  const departBy = new Date(arriveBy.getTime() - (travelMinutes + bufferMinutes) * 60000);
  const prepStarts = new Date(departBy.getTime() - prepMinutes * 60000);
  const arriveHome = new Date(eventEnd.getTime() + driveHomeMinutes * 60000);

  return {
    prep_starts: prepStarts.toISOString(),
    depart_by: departBy.toISOString(),
    arrive_by: arriveBy.toISOString(),
    event_starts: eventStart.toISOString(),
    event_ends: eventEnd.toISOString(),
    arrive_home: arriveHome.toISOString(),
    total_logistics_start: prepStarts.toISOString(),
    total_logistics_end: arriveHome.toISOString(),
    prep_minutes: prepMinutes,
    travel_minutes: travelMinutes,
    drive_home_minutes: driveHomeMinutes,
    early_arrival_minutes: earlyArrival,
    buffer_minutes: bufferMinutes,
  };
}
