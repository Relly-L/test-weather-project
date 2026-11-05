"use client";

import { useCallback, useEffect, useState } from "react";
import { backgroundFor, type BackgroundSlot } from "../lib/background";
import { defaultLocale, dictionaries, formatTemperature, pickLocale, type Locale } from "../lib/i18n";
import { getBrowserPosition, getIpPosition, type Coords } from "../lib/location";
import { fetchCurrentWeather, type CurrentWeather } from "../lib/weather";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type State =
  | { status: "loading" }
  | { status: "ready"; weather: CurrentWeather }
  | { status: "needs-location" }
  | { status: "error" };

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
  const [state, setState] = useState<State>({ status: "loading" });
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
  const t = dictionaries[locale];

  const slot: BackgroundSlot =
    state.status === "ready" ? backgroundFor(state.weather.weatherCode, state.weather.isDay) : "default";

  return (
    <main className="screen">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bg" src={`${basePath}/backgrounds/${slot}.webp`} alt="" />
      <div className="shade" />
      <div className="content" aria-live="polite">
        {state.status === "loading" && <p className="hint">{t.loading}</p>}
        {state.status === "ready" && (
          <p className="temp" aria-label={`${t.temperatureLabel}: ${formatTemperature(state.weather.temperature, locale)}`}>
            {formatTemperature(state.weather.temperature, locale)}
          </p>
        )}
        {state.status === "needs-location" && (
          <Message title={t.locationTitle} text={t.locationText} action={t.retry} onAction={retry} />
        )}
        {state.status === "error" && (
          <Message title={t.errorTitle} text={t.errorText} action={t.retry} onAction={retry} />
        )}
      </div>
    </main>
  );
}

function Message(props: { title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="message">
      <h1>{props.title}</h1>
      <p>{props.text}</p>
      <button type="button" onClick={props.onAction}>
        {props.action}
      </button>
    </div>
  );
}
