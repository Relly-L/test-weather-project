import { useEffect, useState, type RefObject } from "react";
import { lerp, pointerToUnit, tiltToUnit } from "./parallax";

/** True when the user asks for less motion. Assumed true until the browser answers. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Sets --px / --py (-1..1) on the element: from the mouse on desktop, from device tilt on
 * touch devices (skipped where the browser needs a permission prompt, i.e. iOS).
 */
export function useParallax(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const tick = () => {
      cx = lerp(cx, tx, 0.08);
      cy = lerp(cy, ty, 0.08);
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = pointerToUnit(e.clientX, r.left, r.width);
      ty = pointerToUnit(e.clientY, r.top, r.height);
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    let baseBeta: number | null = null;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      baseBeta ??= e.beta;
      tx = tiltToUnit(e.gamma);
      ty = tiltToUnit(e.beta - baseBeta);
      kick();
    };

    const needsPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === "function";
    const touch = window.matchMedia("(pointer: coarse)").matches;

    if (touch) {
      if (!needsPermission) window.addEventListener("deviceorientation", onTilt);
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.removeProperty("--px");
      el.style.removeProperty("--py");
    };
  }, [ref, enabled]);
}
