import pino from "pino";
import { loadEnv } from "../../config/env.js";
import { cacheGet, cacheSet } from "../../lib/cache.js";

const logger = pino({ name: "weather" });
const WEATHER_CACHE_TTL = 2 * 3600;
const FETCH_TIMEOUT_MS = 8000;

interface WeatherForecast {
  at_event_start: {
    temp_f: number;
    temp_c: number;
    condition: string;
    condition_icon: string;
    is_day: boolean;
  };
  at_event_end: {
    temp_f: number;
    temp_c: number;
    condition: string;
    condition_icon: string;
    is_day: boolean;
  } | null;
  precipitation_chance_pct: number | null;
  wind_mph: number | null;
  humidity_pct: number | null;
  uv_index: number | null;
  advisory: string | null;
}

export async function fetchWeatherForecast(
  lat: number,
  lng: number,
  eventStart: string,
  eventEnd: string
): Promise<WeatherForecast | null> {
  const eventDate = eventStart.split("T")[0];
  const cacheKey = `weather:${lat.toFixed(3)},${lng.toFixed(3)}_${eventDate}`;
  const cached = await cacheGet<WeatherForecast>(cacheKey);
  if (cached) {
    logger.debug({ cacheKey }, "Weather cache hit");
    return cached;
  }

  const env = loadEnv();
  const startDate = new Date(eventStart);
  const now = new Date();
  const daysOut = Math.ceil((startDate.getTime() - now.getTime()) / 86400000);

  if (daysOut > 14 || daysOut < -1) {
    logger.info({ eventDate, daysOut }, "Event outside 14-day forecast window");
    return null;
  }

  const forecastDays = Math.max(1, Math.min(14, daysOut + 1));
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${env.WEATHER_API_KEY}&q=${lat},${lng}&days=${forecastDays}&aqi=no&alerts=yes`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    logger.warn({ status: response.status, lat, lng }, "WeatherAPI returned non-OK");
    return null;
  }

  const body = await response.json() as {
    forecast?: {
      forecastday?: Array<{
        date: string;
        day: {
          daily_chance_of_rain: number;
          maxwind_mph: number;
          avghumidity: number;
          uv: number;
        };
        hour: Array<{
          time: string;
          temp_f: number;
          temp_c: number;
          condition: { text: string; icon: string };
          is_day: number;
        }>;
      }>;
    };
    alerts?: { alert: Array<{ headline: string }> };
  };

  const forecastDay = body.forecast?.forecastday?.find(
    (d) => d.date === eventDate
  );
  if (!forecastDay) {
    logger.warn({ eventDate, availableDates: body.forecast?.forecastday?.map((d) => d.date) }, "No forecast for event date");
    return null;
  }

  const startHour = new Date(eventStart).getHours();
  const endHour = new Date(eventEnd).getHours();

  const startWeather = findClosestHour(forecastDay.hour, startHour);
  const endWeather = findClosestHour(forecastDay.hour, endHour);

  if (!startWeather) return null;

  const forecast: WeatherForecast = {
    at_event_start: {
      temp_f: startWeather.temp_f,
      temp_c: startWeather.temp_c,
      condition: startWeather.condition.text,
      condition_icon: startWeather.condition.icon,
      is_day: startWeather.is_day === 1,
    },
    at_event_end: endWeather
      ? {
          temp_f: endWeather.temp_f,
          temp_c: endWeather.temp_c,
          condition: endWeather.condition.text,
          condition_icon: endWeather.condition.icon,
          is_day: endWeather.is_day === 1,
        }
      : null,
    precipitation_chance_pct: forecastDay.day.daily_chance_of_rain ?? null,
    wind_mph: forecastDay.day.maxwind_mph ?? null,
    humidity_pct: forecastDay.day.avghumidity ?? null,
    uv_index: forecastDay.day.uv ?? null,
    advisory: body.alerts?.alert?.[0]?.headline ?? null,
  };

  await cacheSet(cacheKey, forecast, WEATHER_CACHE_TTL);
  logger.info({ eventDate, tempF: forecast.at_event_start.temp_f, condition: forecast.at_event_start.condition }, "Weather fetched");
  return forecast;
}

function findClosestHour(
  hours: Array<{ time: string; temp_f: number; temp_c: number; condition: { text: string; icon: string }; is_day: number }>,
  targetHour: number
) {
  return hours.reduce((closest, hour) => {
    const hourNum = parseInt(hour.time.split(" ")[1]?.split(":")[0] ?? "0", 10);
    const closestNum = parseInt(closest.time.split(" ")[1]?.split(":")[0] ?? "0", 10);
    return Math.abs(hourNum - targetHour) < Math.abs(closestNum - targetHour)
      ? hour
      : closest;
  }, hours[0]);
}
