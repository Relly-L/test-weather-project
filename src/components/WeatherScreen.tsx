import { backgroundFor, type BackgroundSlot } from "../lib/background";
import { dictionaries, formatTemperature, type Locale } from "../lib/i18n";
import type { CurrentWeather } from "../lib/weather";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type ScreenState =
  | { status: "loading" }
  | { status: "ready"; weather: CurrentWeather }
  | { status: "needs-location" }
  | { status: "error" };

export function slotFor(state: ScreenState): BackgroundSlot {
  return state.status === "ready" ? backgroundFor(state.weather.weatherCode, state.weather.isDay) : "default";
}

/** Presentational screen: no data fetching, so it can be rendered with any state. */
export default function WeatherScreen(props: { state: ScreenState; locale: Locale; onRetry?: () => void }) {
  const { state, locale, onRetry } = props;
  const t = dictionaries[locale];
  const temperature = state.status === "ready" ? formatTemperature(state.weather.temperature, locale) : "";

  return (
    <div className="screen">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="bg" src={`${basePath}/backgrounds/${slotFor(state)}.webp`} alt="" />
      <div className="shade" />
      <div className="content" aria-live="polite">
        {state.status === "loading" && <p className="hint">{t.loading}</p>}
        {state.status === "ready" && (
          <p className="temp" aria-label={`${t.temperatureLabel}: ${temperature}`}>
            {temperature}
          </p>
        )}
        {state.status === "needs-location" && (
          <Message title={t.locationTitle} text={t.locationText} action={t.retry} onAction={onRetry} />
        )}
        {state.status === "error" && (
          <Message title={t.errorTitle} text={t.errorText} action={t.retry} onAction={onRetry} />
        )}
      </div>
    </div>
  );
}

function Message(props: { title: string; text: string; action: string; onAction?: () => void }) {
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
