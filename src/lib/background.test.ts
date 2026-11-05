import { describe, expect, it } from "vitest";
import { backgroundFor } from "./background";

describe("backgroundFor", () => {
  it("maps clear sky by day and night", () => {
    expect(backgroundFor(0, true)).toBe("clear-day");
    expect(backgroundFor(1, false)).toBe("clear-night");
  });
  it("maps precipitation and special codes", () => {
    expect(backgroundFor(3, true)).toBe("cloudy");
    expect(backgroundFor(45, false)).toBe("fog");
    expect(backgroundFor(53, true)).toBe("rain");
    expect(backgroundFor(82, true)).toBe("rain");
    expect(backgroundFor(75, true)).toBe("snow");
    expect(backgroundFor(86, false)).toBe("snow");
    expect(backgroundFor(95, true)).toBe("thunderstorm");
  });
  it("falls back to default", () => {
    expect(backgroundFor(null, true)).toBe("default");
    expect(backgroundFor(-1, true)).toBe("default");
    expect(backgroundFor(97, true)).toBe("default");
  });
});
