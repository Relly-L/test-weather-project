export function clamp(v: number, min = -1, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Position of a pointer inside a box, mapped to -1 (start) .. 1 (end). */
export function pointerToUnit(client: number, start: number, size: number): number {
  if (size <= 0) return 0;
  return clamp(((client - start) / size) * 2 - 1);
}

/** Device tilt in degrees mapped to -1..1; `range` degrees reach the extreme. */
export function tiltToUnit(angle: number, range = 25): number {
  return clamp(angle / range);
}
