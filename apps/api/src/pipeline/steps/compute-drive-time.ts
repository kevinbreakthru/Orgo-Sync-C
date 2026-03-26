import pino from "pino";
import { loadEnv } from "../../config/env.js";
import { cacheGet, cacheSet } from "../../lib/cache.js";

const logger = pino({ name: "drive-time" });
const DRIVE_TIME_CACHE_TTL = 15 * 60;
const FETCH_TIMEOUT_MS = 8000;

interface DriveTimeResult {
  origin_address: string;
  origin_coordinates: { lat: number; lng: number };
  destination_coordinates: { lat: number; lng: number };
  distance_meters: number;
  duration_seconds: number;
  duration_in_traffic_seconds: number | null;
  travel_mode: "drive";
}

export async function computeTrafficAwareDriveTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  originAddress: string,
  departureTime?: string
): Promise<DriveTimeResult | null> {
  const cacheKey = `route:${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}_${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`;
  const cached = await cacheGet<DriveTimeResult>(cacheKey);
  if (cached) {
    logger.debug({ cacheKey }, "Drive time cache hit");
    return cached;
  }

  const env = loadEnv();
  const requestBody: Record<string, unknown> = {
    origin: {
      location: {
        latLng: { latitude: origin.lat, longitude: origin.lng },
      },
    },
    destination: {
      location: {
        latLng: { latitude: destination.lat, longitude: destination.lng },
      },
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
  };

  if (departureTime) {
    requestBody.departureTime = departureTime;
  }

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.staticDuration",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  );

  if (!response.ok) {
    logger.warn({ status: response.status, origin: originAddress }, "Google Routes API returned non-OK");
    return null;
  }

  const body = (await response.json()) as {
    routes?: Array<{
      distanceMeters?: number;
      duration?: string;
      staticDuration?: string;
    }>;
  };

  const route = body.routes?.[0];
  if (!route) {
    logger.warn({ origin: originAddress }, "No route results returned");
    return null;
  }

  const parseDuration = (d?: string): number => {
    if (!d) return 0;
    return parseInt(d.replace("s", ""), 10);
  };

  // duration = traffic-aware time, staticDuration = no-traffic baseline
  const trafficDuration = parseDuration(route.duration);
  const staticDuration = parseDuration(route.staticDuration);

  const driveTime: DriveTimeResult = {
    origin_address: originAddress,
    origin_coordinates: origin,
    destination_coordinates: destination,
    distance_meters: route.distanceMeters ?? 0,
    duration_seconds: staticDuration || trafficDuration,
    duration_in_traffic_seconds: trafficDuration || null,
    travel_mode: "drive",
  };

  await cacheSet(cacheKey, driveTime, DRIVE_TIME_CACHE_TTL);
  logger.info(
    { origin: originAddress, distanceM: driveTime.distance_meters, durationS: driveTime.duration_seconds },
    "Drive time computed"
  );
  return driveTime;
}
