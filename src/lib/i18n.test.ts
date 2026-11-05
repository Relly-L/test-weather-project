import { describe, expect, it } from "vitest";
import { dictionaries, formatTemperature, pickLocale } from "./i18n";

describe("pickLocale", () => {
  it("uses the first supported browser language", () => {
    expect(pickLocale(["uk-UA", "en-US"])).toBe("uk");
    expect(pickLocale(["de-DE", "uk"])).toBe("uk");
  });
  it("falls back to English", () => {
    expect(pickLocale(["de-DE", "fr"])).toBe("en");
    expect(pickLocale([])).toBe("en");
    expect(pickLocale(undefined)).toBe("en");
  });
  it("does not treat the country code ua as a language", () => {
    expect(pickLocale(["ua"])).toBe("en");
  });
});

describe("formatTemperature", () => {
  it("rounds to whole degrees and avoids -0", () => {
    expect(formatTemperature(21.6, "en")).toBe("22°");
    expect(formatTemperature(-0.4, "en")).toBe("0°");
  });
});

describe("dictionaries", () => {
  it("have identical keys", () => {
    expect(Object.keys(dictionaries.uk).sort()).toEqual(Object.keys(dictionaries.en).sort());
  });
});
