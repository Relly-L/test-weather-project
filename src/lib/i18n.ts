import en from "../locales/en.json";
import uk from "../locales/uk.json";

export type Messages = typeof en;
export const locales = ["en", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Messages> = { en, uk };

/** Picks the first supported language from the browser's preference list. */
export function pickLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const primary = tag.toLowerCase().split("-")[0];
    const match = locales.find((l) => l === primary);
    if (match) return match;
  }
  return defaultLocale;
}

/** Whole degrees, never "-0". */
export function formatTemperature(value: number, locale: Locale): string {
  const rounded = Math.round(value) || 0;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(rounded)}°`;
}
