import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { defaultUnits, dictionaries, formatTemperature, localeMeta, locales, pickLocale, toUnits } from "./i18n";

describe("pickLocale", () => {
  it("uses the first supported browser language", () => {
    expect(pickLocale(["uk-UA", "en-US"])).toBe("uk");
    expect(pickLocale(["de-DE", "uk"])).toBe("de");
    expect(pickLocale(["ru-RU", "ja"])).toBe("ja");
  });
  it("falls back to English", () => {
    expect(pickLocale(["ru", "xx"])).toBe("en");
    expect(pickLocale([])).toBe("en");
    expect(pickLocale(undefined)).toBe("en");
  });
  it("does not treat the country code ua as a language", () => {
    expect(pickLocale(["ua"])).toBe("en");
  });
  it("maps old and regional codes", () => {
    expect(pickLocale(["no"])).toBe("nb");
    expect(pickLocale(["nn-NO"])).toBe("nb");
    expect(pickLocale(["iw"])).toBe("he");
    expect(pickLocale(["in"])).toBe("id");
    expect(pickLocale(["zh-TW"])).toBe("zh");
    expect(pickLocale(["ar-EG"])).toBe("ar");
  });
});

describe("defaultUnits", () => {
  it("uses Fahrenheit only for a US region in the first language", () => {
    expect(defaultUnits(["en-US", "en"])).toBe("f");
    expect(defaultUnits(["es-US"])).toBe("f");
    expect(defaultUnits(["zh-Hans-US"])).toBe("f");
  });
  it("uses Celsius otherwise", () => {
    expect(defaultUnits(["en-GB"])).toBe("c");
    expect(defaultUnits(["en"])).toBe("c");
    expect(defaultUnits(["de-DE", "en-US"])).toBe("c");
    expect(defaultUnits([])).toBe("c");
    expect(defaultUnits(undefined)).toBe("c");
  });
});

describe("temperature", () => {
  it("converts to Fahrenheit", () => {
    expect(toUnits(0, "f")).toBe(32);
    expect(toUnits(100, "f")).toBe(212);
    expect(toUnits(-40, "f")).toBe(-40);
    expect(toUnits(20, "c")).toBe(20);
  });
  it("rounds to whole degrees and avoids -0", () => {
    expect(formatTemperature(21.6, "en")).toBe("22°");
    expect(formatTemperature(-0.4, "en")).toBe("0°");
    expect(formatTemperature(24, "en", "f")).toBe("75°");
  });
});

describe("locales", () => {
  it("have identical dictionary keys", () => {
    const keys = Object.keys(dictionaries.en).sort();
    for (const l of locales) expect(Object.keys(dictionaries[l]).sort(), l).toEqual(keys);
  });
  it("have no empty strings", () => {
    for (const l of locales) {
      for (const [k, v] of Object.entries(dictionaries[l])) expect(v.trim(), `${l}.${k}`).not.toBe("");
    }
  });
  it("have metadata and a flag file for every locale", () => {
    expect(locales).toHaveLength(28);
    for (const l of locales) {
      expect(existsSync(`public/flags/${localeMeta[l].flag}.svg`), l).toBe(true);
    }
  });
  it("mark only Arabic and Hebrew as right to left", () => {
    const rtl = locales.filter((l) => localeMeta[l].dir === "rtl");
    expect(rtl).toEqual(["ar", "he"]);
  });
  it("do not include Russian", () => {
    expect((locales as readonly string[]).includes("ru")).toBe(false);
  });
});
