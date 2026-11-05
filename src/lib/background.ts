export type BackgroundSlot =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "default";

/** Maps a WMO weather code (Open-Meteo) to a background image slot. */
export function backgroundFor(code: number | null, isDay: boolean): BackgroundSlot {
  if (code === null) return "default";
  if (code === 0 || code === 1) return isDay ? "clear-day" : "clear-night";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code === 95 || code === 96 || code === 99) return "thunderstorm";
  return "default";
}
