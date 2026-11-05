import type { Coords } from "./location";

export type CurrentWeather = { temperature: number; weatherCode: number; isDay: boolean };

export async function fetchCurrentWeather(coords: Coords, signal?: AbortSignal): Promise<CurrentWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", coords.latitude.toFixed(2));
  url.searchParams.set("longitude", coords.longitude.toFixed(2));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`weather-${res.status}`);
  const data = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number; is_day?: number };
  };
  const c = data.current;
  if (!c || typeof c.temperature_2m !== "number") throw new Error("weather-bad-response");
  return {
    temperature: c.temperature_2m,
    weatherCode: c.weather_code ?? -1,
    isDay: c.is_day !== 0,
  };
}
