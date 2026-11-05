import { backgroundFor, type BackgroundSlot } from "./background";
import type { CurrentWeather } from "./weather";

export type ScreenState =
  | { status: "loading" }
  | { status: "ready"; weather: CurrentWeather; city?: string }
  | { status: "needs-location" }
  | { status: "error" };

export function slotFor(state: ScreenState): BackgroundSlot {
  return state.status === "ready" ? backgroundFor(state.weather.weatherCode, state.weather.isDay) : "default";
}
