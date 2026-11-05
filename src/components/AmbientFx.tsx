import type { BackgroundSlot } from "../lib/background";
import Particles from "./Particles";

// Deterministic (no Math.random) and rounded, so server and client render the same markup.
const stars = Array.from({ length: 44 }, (_, i) => {
  const r = (n: number) => (((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1) + 1) % 1;
  return {
    x: (r(1) * 100).toFixed(2),
    y: (r(2) * 100).toFixed(2),
    size: (1 + r(3) * 1.8).toFixed(2),
    delay: (r(4) * 6).toFixed(2),
    duration: (2.5 + r(5) * 3.5).toFixed(2),
  };
});

/** Weather effects layer: canvas particles for precipitation, CSS for everything else. */
export default function AmbientFx({ slot }: { slot: BackgroundSlot }) {
  switch (slot) {
    case "rain":
      return <Particles kind="rain" />;
    case "snow":
      return <Particles kind="snow" />;
    case "thunderstorm":
      return <Particles kind="storm" />;
    case "clear-night":
      return (
        <div className="fx-stars">
          {stars.map((s, i) => (
            <i
              key={i}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
      );
    case "clear-day":
      return <div className="fx-sun" />;
    case "fog":
      return (
        <div className="fx-fog">
          <i />
          <i />
          <i />
        </div>
      );
    default:
      return (
        <div className="fx-clouds">
          <i />
          <i />
          <i />
        </div>
      );
  }
}
