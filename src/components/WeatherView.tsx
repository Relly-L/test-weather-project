"use client";

import { useCallback, useEffect, useState } from "react";
import { reverseGeocode, type CitySuggestion } from "../lib/geocoding";
import { defaultLocale, defaultUnits, localeMeta, pickLocale, type Locale, type Units } from "../lib/i18n";
import { getBrowserPosition, getIpPosition, type Coords } from "../lib/location";
import type { ScreenState } from "../lib/screenState";
import { fetchCurrentWeather, type CurrentWeather } from "../lib/weather";
import CitySearch from "./CitySearch";
import LanguageSwitch from "./LanguageSwitch";
import UnitToggle from "./UnitToggle";
import WeatherScreen from "./WeatherScreen";

type Place = Coords & { name?: string };

type Data =
  | { status: "loading" }
  | { status: "needs-location" }
  | { status: "error" }
  | { status: "ready"; place: Place; weather: CurrentWeather };

/** Browser location, then IP. Nothing is remembered between visits. */
async function detectPlace(signal: AbortSignal): Promise<Place | null> {
  try {
    return await getBrowserPosition();
  } catch {
    // denied, timed out or unsupported
  }
  try {
    return await getIpPosition(signal);
  } catch {
    return null;
  }
}

export default function WeatherView() {
  const [locale, setLocale] = useState<Locale | null>(null);
  const [units, setUnits] = useState<Units>("c");
  const [manual, setManual] = useState<Place | null>(null);
  const [data, setData] = useState<Data>({ status: "loading" });
  const [cityName, setCityName] = useState<string | undefined>();
  const [attempt, setAttempt] = useState(0);

  // Language and units come from the browser on every visit (not stored).
  useEffect(() => {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    setLocale(pickLocale(languages));
    setUnits(defaultUnits(languages));
  }, []);

  useEffect(() => {
    if (!locale) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].dir;
  }, [locale]);

  // Place and weather: once per visit, again on Retry or when a city is picked.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setData({ status: "loading" });
    (async () => {
      const place = manual ?? (await detectPlace(signal));
      if (signal.aborted) return;
      if (!place) {
        setData({ status: "needs-location" });
        return;
      }
      try {
        const weather = await fetchCurrentWeather(place, signal);
        if (!signal.aborted) setData({ status: "ready", place, weather });
      } catch {
        if (!signal.aborted) setData({ status: "error" });
      }
    })();
    return () => controller.abort();
  }, [manual, attempt]);

  // City name: from the search suggestion, otherwise reverse geocoding in the current language.
  const place = data.status === "ready" ? data.place : null;
  useEffect(() => {
    setCityName(undefined);
    if (!place || place.name || !locale) return;
    const controller = new AbortController();
    reverseGeocode(place, locale, controller.signal)
      .then((name) => {
        if (!controller.signal.aborted) setCityName(name);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [place, locale]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const select = useCallback((c: CitySuggestion) => {
    setManual({ name: c.name, latitude: c.latitude, longitude: c.longitude });
  }, []);

  const current = locale ?? defaultLocale;
  const state: ScreenState =
    data.status === "ready"
      ? { status: "ready", weather: data.weather, city: data.place.name ?? cityName }
      : data;

  return (
    <main className="stage">
      <div className="phone">
        <WeatherScreen
          state={state}
          locale={current}
          units={units}
          onRetry={retry}
          top={<CitySearch locale={current} onSelect={select} />}
          bottomStart={<UnitToggle units={units} locale={current} onChange={setUnits} />}
          bottomEnd={<LanguageSwitch locale={current} onChange={setLocale} />}
        />
      </div>
    </main>
  );
}
