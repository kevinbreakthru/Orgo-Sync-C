import pino from "pino";
import type { CanonicalEvent, LogisticsObject } from "@orgo-sync/schemas";
import { validateCanonicalEvent } from "./steps/normalize.js";
import { geocodeLocation } from "./steps/geocode-location.js";
import { computeTrafficAwareDriveTime } from "./steps/compute-drive-time.js";
import { fetchWeatherForecast } from "./steps/fetch-weather.js";
import { buildEventTimeline } from "./steps/build-timeline.js";
import { detectScheduleConflicts } from "./steps/detect-conflicts.js";

const logger = pino({ name: "enrichment-pipeline" });

interface EnrichmentInput {
  event: CanonicalEvent;
  origin?: { address?: string; coordinates?: { lat: number; lng: number } };
  otherEvents?: Array<{ title: string; start: string; end: string }>;
}

export async function runEnrichmentPipeline(
  input: EnrichmentInput,
  isSandbox: boolean
): Promise<LogisticsObject> {
  const startTime = Date.now();
  const event = validateCanonicalEvent(input.event);
  const eventTitle = event.title;

  let geocodedLocation: LogisticsObject["enrichment"]["geocoded_location"] = null;
  let driveTime: LogisticsObject["enrichment"]["drive_time"] = null;
  let weather: LogisticsObject["enrichment"]["weather"] = null;
  let timeline: LogisticsObject["enrichment"]["timeline"] = null;
  let conflicts: LogisticsObject["enrichment"]["conflicts"] = [];
  let status: "completed" | "partial" | "failed" = "completed";

  // Step 1: Geocode event location
  const locationQuery = event.location.address ?? event.location.venue_name ?? event.location.raw;
  if (locationQuery) {
    try {
      const geocoded = await geocodeLocation(locationQuery);
      if (geocoded) {
        geocodedLocation = geocoded;
        event.location.coordinates = geocoded.coordinates;
        event.location.address = geocoded.formatted_address;
      } else {
        status = "partial";
      }
    } catch (err) {
      logger.error({ err, eventTitle, step: "geocode" }, "Geocode step failed");
      status = "partial";
    }
  }

  // Step 2: Geocode origin and compute drive time
  const destinationCoords = event.location.coordinates ?? geocodedLocation?.coordinates;
  let originCoords = input.origin?.coordinates;

  if (!originCoords && input.origin?.address) {
    try {
      const originGeo = await geocodeLocation(input.origin.address);
      if (originGeo) originCoords = originGeo.coordinates;
    } catch (err) {
      logger.error({ err, eventTitle, step: "geocode-origin" }, "Origin geocode failed");
      status = "partial";
    }
  }

  if (originCoords && destinationCoords) {
    try {
      const drive = await computeTrafficAwareDriveTime(
        originCoords,
        destinationCoords,
        input.origin?.address ?? `${originCoords.lat},${originCoords.lng}`
      );
      if (drive) driveTime = drive;
      else status = "partial";
    } catch (err) {
      logger.error({ err, eventTitle, step: "drive-time" }, "Drive time step failed");
      status = "partial";
    }
  }

  // Step 3: Fetch weather at event location
  if (destinationCoords) {
    try {
      const wx = await fetchWeatherForecast(
        destinationCoords.lat,
        destinationCoords.lng,
        event.start,
        event.end
      );
      if (wx) weather = wx;
    } catch (err) {
      logger.error({ err, eventTitle, step: "weather" }, "Weather step failed");
      status = "partial";
    }
  }

  // Step 4: Build departure/prep timeline
  timeline = buildEventTimeline({
    event_start: event.start,
    event_end: event.end,
    travel_seconds: driveTime?.duration_seconds ?? null,
    early_arrival_minutes: event.sport?.early_arrival_minutes ?? 0,
  });

  // Step 5: Detect scheduling conflicts
  if (input.otherEvents?.length) {
    conflicts = detectScheduleConflicts(
      event,
      input.otherEvents,
      driveTime ? Math.ceil(driveTime.duration_seconds / 60) : 0,
      event.sport?.early_arrival_minutes ?? 0
    );
  }

  const processingMs = Date.now() - startTime;
  logger.info({ eventTitle, status, processingMs, hasGeo: !!geocodedLocation, hasDrive: !!driveTime, hasWeather: !!weather }, "Enrichment complete");

  return {
    event,
    enrichment: {
      status,
      geocoded_location: geocodedLocation,
      drive_time: driveTime,
      weather,
      timeline,
      conflicts,
      enriched_at: new Date().toISOString(),
      processing_ms: processingMs,
    },
    sandbox: isSandbox,
  };
}
