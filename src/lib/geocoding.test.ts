import { describe, expect, it } from "vitest";
import { pickPlaceName, toSuggestions } from "./geocoding";

describe("toSuggestions", () => {
  it("maps results and builds the detail line", () => {
    const out = toSuggestions({
      results: [
        { id: 1, name: "Kyiv", latitude: 50.45, longitude: 30.52, admin1: "Kyiv City", country: "Ukraine" },
        { id: 2, name: "Paris", latitude: 48.85, longitude: 2.35, admin1: "Paris", country: "France" },
      ],
    });
    expect(out[0]).toMatchObject({ name: "Kyiv", detail: "Kyiv City, Ukraine" });
    expect(out[1].detail).toBe("France");
  });
  it("skips malformed items and unknown shapes", () => {
    expect(toSuggestions({ results: [{ id: 1, name: "x" }, null, 5] })).toEqual([]);
    expect(toSuggestions({})).toEqual([]);
    expect(toSuggestions(null)).toEqual([]);
  });
});

describe("pickPlaceName", () => {
  it("prefers city, then locality, then subdivision", () => {
    expect(pickPlaceName({ city: "Київ", locality: "Район" })).toBe("Київ");
    expect(pickPlaceName({ city: "", locality: "Village" })).toBe("Village");
    expect(pickPlaceName({ principalSubdivision: "Region" })).toBe("Region");
  });
  it("returns undefined when nothing usable", () => {
    expect(pickPlaceName({ city: " " })).toBeUndefined();
    expect(pickPlaceName(null)).toBeUndefined();
  });
});
