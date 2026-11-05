"use client";

import { useEffect, useRef } from "react";

export type ParticleKind = "rain" | "snow" | "storm";

type Particle = { x: number; y: number; v: number; size: number; alpha: number; phase: number };

const SLANT = 0.18; // rain: horizontal px per vertical px

function count(kind: ParticleKind, w: number, h: number): number {
  const area = w * h;
  const n = kind === "snow" ? area / 6000 : kind === "storm" ? area / 1800 : area / 2800;
  return Math.max(24, Math.min(280, Math.round(n)));
}

/** One canvas: rain, snow, or a storm (heavy rain plus lightning flashes). */
export default function Particles({ kind }: { kind: ParticleKind }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let w = 0;
    let h = 0;
    let items: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let flash = 0;
    let echoAt = 0;
    let nextFlash = last + 2500 + Math.random() * 3500;

    const make = (spread: boolean): Particle => ({
      x: Math.random() * (w + h * SLANT),
      y: spread ? Math.random() * h : -20,
      v: kind === "snow" ? 30 + Math.random() * 60 : (kind === "storm" ? 1100 : 850) + Math.random() * 450,
      size: kind === "snow" ? 1 + Math.random() * 2.6 : 8 + Math.random() * 16,
      alpha: kind === "snow" ? 0.45 + Math.random() * 0.45 : 0.18 + Math.random() * 0.32,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      items = Array.from({ length: count(kind, w, h) }, () => make(true));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (kind === "snow") {
        ctx.fillStyle = "#fff";
        for (const p of items) {
          p.y += p.v * dt;
          p.x += Math.sin(now / 1000 + p.phase) * 18 * dt;
          if (p.y > h + 6) Object.assign(p, make(false));
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = "#cfdcee";
        ctx.lineWidth = 1.1;
        for (const p of items) {
          p.y += p.v * dt;
          p.x -= p.v * SLANT * dt;
          if (p.y > h + p.size) {
            Object.assign(p, make(false));
            p.x += h * SLANT;
          }
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.size * SLANT, p.y - p.size);
          ctx.stroke();
        }
        if (kind === "storm") {
          if (now >= nextFlash) {
            flash = 0.55;
            echoAt = Math.random() < 0.5 ? now + 140 : 0;
            nextFlash = now + 3500 + Math.random() * 6000;
          }
          if (echoAt && now >= echoAt) {
            flash = 0.4;
            echoAt = 0;
          }
          if (flash > 0.01) {
            ctx.globalAlpha = flash;
            ctx.fillStyle = "#dbe6ff";
            ctx.fillRect(0, 0, w, h);
            flash = Math.max(0, flash - dt * 3.2);
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [kind]);

  return <canvas ref={ref} aria-hidden="true" />;
}
