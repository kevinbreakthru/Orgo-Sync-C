import type { CanonicalEvent, LogisticsObject } from "@orgo-sync/schemas";

export function generateSandboxLogisticsObject(
  event: CanonicalEvent
): LogisticsObject {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);

  const travelMinutes = 25;
  const driveHomeMinutes = 25;
  const earlyArrival = event.sport?.early_arrival_minutes ?? 0;
  const prepMinutes = 10;
  const bufferMinutes = 5;

  const arriveBy = new Date(eventStart.getTime() - earlyArrival * 60000);
  const departBy = new Date(arriveBy.getTime() - (travelMinutes + bufferMinutes) * 60000);
  const prepStarts = new Date(departBy.getTime() - prepMinutes * 60000);
  const arriveHome = new Date(eventEnd.getTime() + driveHomeMinutes * 60000);

  return {
    event,
    enrichment: {
      status: "completed",
      geocoded_location: {
        formatted_address: event.location.address ?? "123 Demo Field Rd, Springfield, IL 62704",
        place_id: "sandbox_place_id_" + Math.random().toString(36).slice(2, 10),
        coordinates: event.location.coordinates ?? { lat: 39.7817, lng: -89.6501 },
      },
      drive_time: {
        origin_address: "456 Elm St, Springfield, IL 62701",
        origin_coordinates: { lat: 39.7990, lng: -89.6437 },
        destination_coordinates: event.location.coordinates ?? { lat: 39.7817, lng: -89.6501 },
        distance_meters: 14200,
        duration_seconds: travelMinutes * 60,
        duration_in_traffic_seconds: (travelMinutes + 3) * 60,
        travel_mode: "drive",
      },
      weather: {
        at_event_start: {
          temp_f: 72,
          temp_c: 22,
          condition: "Partly cloudy",
          condition_icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          is_day: true,
        },
        at_event_end: {
          temp_f: 68,
          temp_c: 20,
          condition: "Mostly clear",
          condition_icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
          is_day: true,
        },
        precipitation_chance_pct: 10,
        wind_mph: 8,
        humidity_pct: 45,
        uv_index: 5,
        advisory: null,
      },
      timeline: {
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
      },
      conflicts: [],
      enriched_at: new Date().toISOString(),
      processing_ms: 12,
    },
    sandbox: true,
  };
}
