import type { Locale } from "./i18n";
import type { Coords } from "./location";

export type CitySuggestion = {
  id: number;
  name: string;
  /** Region and country, e.g. "Kyiv City, Ukraine". */
  detail: string;
  latitude: number;
  longitude: number;
};

/** Validates and maps an Open-Meteo geocoding response. Unknown shapes give an empty list. */
export function toSuggestions(data: unknown): CitySuggestion[] {
  const results = (data as { results?: unknown })?.results;
  if (!Array.isArray(results)) return [];
  const out: CitySuggestion[] = [];
  for (const r of results) {
    if (
      typeof r?.id !== "number" ||
      typeof r?.name !== "string" ||
      typeof r?.latitude !== "number" ||
      typeof r?.longitude !== "number"
    ) {
      continue;
    }
    const detail = [r.admin1, r.country]
      .filter((v): v is string => typeof v === "string" && v !== "" && v !== r.name)
      .join(", ");
    out.push({ id: r.id, name: r.name, detail, latitude: r.latitude, longitude: r.longitude });
  }
  return out;
}

/** City autocomplete via Open-Meteo Geocoding (CC BY 4.0, no key). */
export async function searchCities(query: string, locale: Locale, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", locale);
  url.searchParams.set("format", "json");
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`geocoding-${res.status}`);
  return toSuggestions(await res.json());
}

/** Picks a display name from a BigDataCloud reverse-geocode response. */
export function pickPlaceName(data: unknown): string | undefined {
  const d = data as { city?: unknown; locality?: unknown; principalSubdivision?: unknown } | null;
  for (const v of [d?.city, d?.locality, d?.principalSubdivision]) {
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return undefined;
}

/** City name for coordinates (BigDataCloud, no key). Sends rounded coordinates. */
export async function reverseGeocode(coords: Coords, locale: Locale, signal?: AbortSignal): Promise<string | undefined> {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", coords.latitude.toFixed(2));
  url.searchParams.set("longitude", coords.longitude.toFixed(2));
  url.searchParams.set("localityLanguage", locale);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`reverse-geocode-${res.status}`);
  return pickPlaceName(await res.json());
}
