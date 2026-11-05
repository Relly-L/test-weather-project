import type { Metadata } from "next";
import WeatherScreen, { slotFor, type ScreenState } from "../../components/WeatherScreen";
import { locales, type Locale } from "../../lib/i18n";

export const metadata: Metadata = {
  title: "Weather: preview",
  robots: { index: false, follow: false },
};

type Scenario = { label: string; state: ScreenState };

const ready = (temperature: number, weatherCode: number, isDay: boolean): ScreenState => ({
  status: "ready",
  weather: { temperature, weatherCode, isDay },
});

const scenarios: Scenario[] = [
  { label: "clear day · code 0", state: ready(24.4, 0, true) },
  { label: "clear night · code 1", state: ready(11.2, 1, false) },
  { label: "cloudy · code 3", state: ready(8.7, 3, true) },
  { label: "fog · code 45", state: ready(3.1, 45, true) },
  { label: "rain · code 61", state: ready(12.5, 61, true) },
  { label: "snow · code 71", state: ready(-7.3, 71, true) },
  { label: "thunderstorm · code 95", state: ready(19.9, 95, true) },
  { label: "unknown code · default", state: ready(15, 97, true) },
  { label: "rounding · -0.4 → 0°", state: ready(-0.4, 0, true) },
  { label: "loading", state: { status: "loading" } },
  { label: "needs location", state: { status: "needs-location" } },
  { label: "error", state: { status: "error" } },
];

const names: Record<Locale, string> = { en: "English (en)", uk: "Українська (uk)" };

export default function PreviewPage() {
  return (
    <div className="preview">
      <h1>Preview</h1>
      <p className="preview-note">
        Every background and screen state in each locale, with sample data. No location or weather requests are made.
      </p>
      {locales.map((locale) => (
        <section key={locale}>
          <h2>{names[locale]}</h2>
          <div className="preview-grid">
            {scenarios.map((s) => (
              <figure key={s.label}>
                <div className="frame">
                  <WeatherScreen state={s.state} locale={locale} />
                </div>
                <figcaption>
                  {s.label}
                  <br />
                  <code>{slotFor(s.state)}</code>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
