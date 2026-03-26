import pino from "pino";
import { loadEnv } from "../../config/env.js";
import { cacheGet, cacheSet } from "../../lib/cache.js";

const logger = pino({ name: "geocode" });
const GEOCODE_CACHE_TTL = 7 * 24 * 3600;
const FETCH_TIMEOUT_MS = 8000;

interface GeocodedResult {
  formatted_address: string;
  place_id: string;
  coordinates: { lat: number; lng: number };
}

export async function geocodeLocation(
  locationQuery: string
): Promise<GeocodedResult | null> {
  if (!locationQuery.trim()) return null;

  const cacheKey = `geo:${locationQuery.toLowerCase().trim()}`;
  const cached = await cacheGet<GeocodedResult>(cacheKey);
  if (cached) {
    logger.debug({ cacheKey }, "Geocode cache hit");
    return cached;
  }

  const env = loadEnv();

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.formattedAddress,places.id,places.location",
      },
      body: JSON.stringify({ textQuery: locationQuery }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  );

  if (!response.ok) {
    logger.warn({ status: response.status, query: locationQuery }, "Google Places API returned non-OK");
    return null;
  }

  const body = (await response.json()) as {
    places?: Array<{
      formattedAddress?: string;
      id?: string;
      location?: { latitude: number; longitude: number };
    }>;
  };

  const place = body.places?.[0];
  if (!place?.location) {
    logger.warn({ query: locationQuery }, "No place results returned");
    return null;
  }

  const geocoded: GeocodedResult = {
    formatted_address: place.formattedAddress ?? locationQuery,
    place_id: place.id ?? "",
    coordinates: {
      lat: place.location.latitude,
      lng: place.location.longitude,
    },
  };

  await cacheSet(cacheKey, geocoded, GEOCODE_CACHE_TTL);
  logger.info({ query: locationQuery, placeId: geocoded.place_id }, "Location geocoded");
  return geocoded;
}
