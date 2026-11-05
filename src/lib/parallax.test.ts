import { describe, expect, it } from "vitest";
import { clamp, lerp, pointerToUnit, tiltToUnit } from "./parallax";

describe("parallax helpers", () => {
  it("clamps to the range", () => {
    expect(clamp(5)).toBe(1);
    expect(clamp(-5)).toBe(-1);
    expect(clamp(0.3)).toBe(0.3);
  });
  it("maps a pointer inside a box to -1..1", () => {
    expect(pointerToUnit(100, 100, 200)).toBe(-1);
    expect(pointerToUnit(200, 100, 200)).toBe(0);
    expect(pointerToUnit(300, 100, 200)).toBe(1);
    expect(pointerToUnit(900, 100, 200)).toBe(1);
    expect(pointerToUnit(10, 0, 0)).toBe(0);
  });
  it("maps tilt degrees to -1..1", () => {
    expect(tiltToUnit(0)).toBe(0);
    expect(tiltToUnit(12.5)).toBeCloseTo(0.5);
    expect(tiltToUnit(-90)).toBe(-1);
  });
  it("interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});
