"use client";

import { useRef, useState, type ReactNode } from "react";
import type { BackgroundSlot } from "../lib/background";
import { dictionaries, formatTemperature, localeMeta, type Locale, type Units } from "../lib/i18n";
import { slotFor, type ScreenState } from "../lib/screenState";
import { useParallax, useReducedMotion } from "../lib/useMotion";
import AmbientFx from "./AmbientFx";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const src = (slot: BackgroundSlot) => `${basePath}/backgrounds/${slot}.webp`;

/** Size class by number length, so "-40°" and "104°" still fit. */
function sizeClass(temperature: string): string {
  const digits = temperature.replace("°", "").length;
  return digits <= 2 ? "temp-s" : digits === 3 ? "temp-m" : "temp-l";
}

/** Presentational screen: no data fetching, so it can be rendered with any state. */
export default function WeatherScreen(props: {
  state: ScreenState;
  locale: Locale;
  units?: Units;
  onRetry?: () => void;
  top?: ReactNode;
  bottomStart?: ReactNode;
  bottomEnd?: ReactNode;
  /** Parallax and weather effects. Default on; always off for users who prefer reduced motion. */
  motion?: boolean;
}) {
  const { state, locale, units = "c", onRetry, top, bottomStart, bottomEnd, motion = true } = props;
  const t = dictionaries[locale];
  const temperature = state.status === "ready" ? formatTemperature(state.weather.temperature, locale, units) : "";

  const slot = slotFor(state);
  // Keep the previous background underneath while the new one fades in.
  const [layers, setLayers] = useState<{ cur: BackgroundSlot; prev: BackgroundSlot | null }>({ cur: slot, prev: null });
  if (layers.cur !== slot) setLayers({ cur: slot, prev: layers.cur });

  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const animate = motion && !reduced;
  useParallax(rootRef, animate);

  return (
    <div className="screen" ref={rootRef} dir={localeMeta[locale].dir} lang={locale}>
      <div className="bg-layer">
        {layers.prev && (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={layers.prev} className="bg" src={src(layers.prev)} alt="" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={layers.cur}
          className="bg bg-in"
          src={src(layers.cur)}
          alt=""
          onAnimationEnd={() => setLayers((l) => ({ ...l, prev: null }))}
        />
      </div>
      <div className="shade" />
      {animate && (
        <div className="fx" aria-hidden="true">
          <AmbientFx slot={slot} />
        </div>
      )}
      {top && <div className="top">{top}</div>}
      <div className="content" aria-live="polite">
        {state.status === "loading" && <p className="hint">{t.loading}</p>}
        {state.status === "ready" && (
          <>
            {state.city && <p className="city">{state.city}</p>}
            <p className={`temp ${sizeClass(temperature)}`} dir="ltr" aria-label={`${t.temperatureLabel}: ${temperature}`}>
              {temperature}
            </p>
          </>
        )}
        {state.status === "needs-location" && (
          <Message title={t.locationTitle} text={t.locationText} action={t.retry} onAction={onRetry} />
        )}
        {state.status === "error" && (
          <Message title={t.errorTitle} text={t.errorText} action={t.retry} onAction={onRetry} />
        )}
      </div>
      {bottomStart && <div className="corner corner-start">{bottomStart}</div>}
      {bottomEnd && <div className="corner corner-end">{bottomEnd}</div>}
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
