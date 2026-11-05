import type { Metadata } from "next";
import PreviewFrame from "../../components/PreviewFrame";
import { localeMeta, locales, type Locale, type Units } from "../../lib/i18n";
import { slotFor, type ScreenState } from "../../lib/screenState";

export const metadata: Metadata = {
  title: "Weather: preview",
  robots: { index: false, follow: false },
};

type Scenario = { label: string; state: ScreenState; noCity?: boolean; units?: Units };

/** Kyiv in every language, so each script and direction gets a real city name. */
const cityNames: Record<Locale, string> = {
  en: "Kyiv", uk: "Київ", de: "Kiew", fr: "Kyiv", es: "Kiev", it: "Kiev", pt: "Quieve", pl: "Kijów",
  cs: "Kyjev", sk: "Kyjev", nl: "Kyiv", sv: "Kiev", da: "Kyiv", nb: "Kyiv", fi: "Kiova", tr: "Kiev",
  ro: "Kiev", hu: "Kijev", bg: "Киев", el: "Κίεβο", ja: "キーウ", ko: "키이우", zh: "基辅", hi: "कीव",
  id: "Kyiv", vi: "Kyiv", ar: "كييف", he: "קייב",
};

const ready = (temperature: number, weatherCode: number, isDay: boolean): ScreenState => ({
  status: "ready",
  weather: { temperature, weatherCode, isDay },
});

const clearDay: Scenario = { label: "clear day · code 0", state: ready(24.4, 0, true) };
const needsLocation: Scenario = { label: "needs location", state: { status: "needs-location" } };

/** English and Ukrainian get everything; other languages get the two screens with the longest texts. */
const fullSet: Scenario[] = [
  clearDay,
  { label: "clear night · code 1", state: ready(11.2, 1, false) },
  { label: "cloudy · code 3", state: ready(8.7, 3, true) },
  { label: "fog · code 45", state: ready(3.1, 45, true) },
  { label: "rain · code 61", state: ready(12.5, 61, true) },
  { label: "snow · code 71", state: ready(-7.3, 71, true) },
  { label: "thunderstorm · code 95", state: ready(19.9, 95, true) },
  { label: "unknown code · default", state: ready(15, 97, true) },
  { label: "rounding · -0.4 → 0°", state: ready(-0.4, 0, true) },
  { label: "°F · 24 °C → 75°", state: ready(24, 0, true), units: "f" },
  { label: "°F · 40 °C → 104° (fit)", state: ready(40, 0, true), units: "f" },
  { label: "°C · -40° (fit)", state: ready(-40, 71, true) },
  { label: "no city name", state: ready(17, 2, true), noCity: true },
  { label: "loading", state: { status: "loading" } },
  needsLocation,
  { label: "error", state: { status: "error" } },
];
const shortSet: Scenario[] = [clearDay, needsLocation];

export default function PreviewPage() {
  return (
    <div className="preview">
      <h1>Preview</h1>
      <p className="preview-note">
        Every background and screen state with sample data. No location, weather or search requests are made (the
        search field and both corner buttons are disabled). English and Ukrainian show the full set, the other 26
        languages show a weather screen and the &quot;needs location&quot; screen. Arabic and Hebrew are mirrored.
        Hover or focus a frame to turn on its weather effects and parallax.
      </p>
      {locales.map((locale) => {
        const set = locale === "en" || locale === "uk" ? fullSet : shortSet;
        return (
          <section key={locale}>
            <h2>
              {localeMeta[locale].native} <code>{locale}</code>
              {localeMeta[locale].dir === "rtl" && " · RTL"}
            </h2>
            <div className="preview-grid">
              {set.map((s) => (
                <figure key={s.label}>
                  <PreviewFrame
                    state={s.state.status === "ready" && !s.noCity ? { ...s.state, city: cityNames[locale] } : s.state}
                    locale={locale}
                    units={s.units}
                  />
                  <figcaption>
                    {s.label}
                    <br />
                    <code>{slotFor(s.state)}</code>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
