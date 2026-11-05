"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultLocale, pickLocale, type Locale } from "../lib/i18n";
import { getBrowserPosition, getIpPosition, type Coords } from "../lib/location";
import { fetchCurrentWeather } from "../lib/weather";
import WeatherScreen, { type ScreenState } from "./WeatherScreen";

async function resolveCoords(signal: AbortSignal): Promise<Coords | null> {
  try {
    return await getBrowserPosition();
  } catch {
    try {
      return await getIpPosition(signal);
    } catch {
      return null;
    }
  }
}

export default function WeatherView() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const picked = pickLocale(navigator.languages ?? [navigator.language]);
    setLocale(picked);
    document.documentElement.lang = picked;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    (async () => {
      const coords = await resolveCoords(controller.signal);
      if (controller.signal.aborted) return;
      if (!coords) {
        setState({ status: "needs-location" });
        return;
      }
      try {
        const weather = await fetchCurrentWeather(coords, controller.signal);
        setState({ status: "ready", weather });
      } catch {
        if (!controller.signal.aborted) setState({ status: "error" });
      }
    })();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <main>
      <WeatherScreen state={state} locale={locale} onRetry={retry} />
    </main>
  );
}
