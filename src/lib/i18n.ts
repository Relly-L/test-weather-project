import ar from "../locales/ar.json";
import bg from "../locales/bg.json";
import cs from "../locales/cs.json";
import da from "../locales/da.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import he from "../locales/he.json";
import hi from "../locales/hi.json";
import hu from "../locales/hu.json";
import id from "../locales/id.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import nb from "../locales/nb.json";
import nl from "../locales/nl.json";
import pl from "../locales/pl.json";
import pt from "../locales/pt.json";
import ro from "../locales/ro.json";
import sk from "../locales/sk.json";
import sv from "../locales/sv.json";
import tr from "../locales/tr.json";
import uk from "../locales/uk.json";
import vi from "../locales/vi.json";
import zh from "../locales/zh.json";

export type Messages = typeof en;
export type Units = "c" | "f";
export type Direction = "ltr" | "rtl";

export const locales = [
  "en", "uk", "de", "fr", "es", "it", "pt", "pl", "cs", "sk", "nl", "sv", "da", "nb",
  "fi", "tr", "ro", "hu", "bg", "el", "ja", "ko", "zh", "hi", "id", "vi", "ar", "he",
] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Messages> = {
  en, uk, de, fr, es, it, pt, pl, cs, sk, nl, sv, da, nb,
  fi, tr, ro, hu, bg, el, ja, ko, zh, hi, id, vi, ar, he,
};

/** `flag` is a country code with a matching file in public/flags (a flag is a country, not a language). */
export const localeMeta: Record<Locale, { native: string; flag: string; dir: Direction }> = {
  en: { native: "English", flag: "gb", dir: "ltr" },
  uk: { native: "Українська", flag: "ua", dir: "ltr" },
  de: { native: "Deutsch", flag: "de", dir: "ltr" },
  fr: { native: "Français", flag: "fr", dir: "ltr" },
  es: { native: "Español", flag: "es", dir: "ltr" },
  it: { native: "Italiano", flag: "it", dir: "ltr" },
  pt: { native: "Português", flag: "pt", dir: "ltr" },
  pl: { native: "Polski", flag: "pl", dir: "ltr" },
  cs: { native: "Čeština", flag: "cz", dir: "ltr" },
  sk: { native: "Slovenčina", flag: "sk", dir: "ltr" },
  nl: { native: "Nederlands", flag: "nl", dir: "ltr" },
  sv: { native: "Svenska", flag: "se", dir: "ltr" },
  da: { native: "Dansk", flag: "dk", dir: "ltr" },
  nb: { native: "Norsk bokmål", flag: "no", dir: "ltr" },
  fi: { native: "Suomi", flag: "fi", dir: "ltr" },
  tr: { native: "Türkçe", flag: "tr", dir: "ltr" },
  ro: { native: "Română", flag: "ro", dir: "ltr" },
  hu: { native: "Magyar", flag: "hu", dir: "ltr" },
  bg: { native: "Български", flag: "bg", dir: "ltr" },
  el: { native: "Ελληνικά", flag: "gr", dir: "ltr" },
  ja: { native: "日本語", flag: "jp", dir: "ltr" },
  ko: { native: "한국어", flag: "kr", dir: "ltr" },
  zh: { native: "中文", flag: "cn", dir: "ltr" },
  hi: { native: "हिन्दी", flag: "in", dir: "ltr" },
  id: { native: "Bahasa Indonesia", flag: "id", dir: "ltr" },
  vi: { native: "Tiếng Việt", flag: "vn", dir: "ltr" },
  ar: { native: "العربية", flag: "eg", dir: "rtl" },
  he: { native: "עברית", flag: "il", dir: "rtl" },
};

/** Older or regional language codes that browsers still send. */
const aliases: Record<string, Locale> = { no: "nb", nn: "nb", iw: "he", in: "id" };

/** Picks the first supported language from the browser's preference list. */
export function pickLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const primary = tag.toLowerCase().split("-")[0];
    const match = aliases[primary] ?? locales.find((l) => l === primary);
    if (match) return match;
  }
  return defaultLocale;
}

/** °F for a US region in the first browser language (e.g. en-US), otherwise °C. */
export function defaultUnits(languages: readonly string[] | undefined): Units {
  const region = languages?.[0]
    ?.split("-")
    .slice(1)
    .find((part) => /^[A-Za-z]{2}$/.test(part));
  return region?.toUpperCase() === "US" ? "f" : "c";
}

export function toUnits(celsius: number, units: Units): number {
  return units === "f" ? (celsius * 9) / 5 + 32 : celsius;
}

/** Whole degrees (rounded after conversion), never "-0". */
export function formatTemperature(celsius: number, locale: Locale, units: Units = "c"): string {
  const rounded = Math.round(toUnits(celsius, units)) || 0;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(rounded)}°`;
}
