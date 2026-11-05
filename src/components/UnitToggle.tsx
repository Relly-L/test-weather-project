"use client";

import { dictionaries, type Locale, type Units } from "../lib/i18n";

/** °C / °F switch with a sliding indicator. `disabled` is for static previews. */
export default function UnitToggle(props: {
  units: Units;
  locale: Locale;
  onChange?: (units: Units) => void;
  disabled?: boolean;
}) {
  const { units, locale, onChange, disabled } = props;
  const t = dictionaries[locale];
  return (
    <div className="units" role="group" aria-label={t.unitsLabel} data-units={units}>
      <span className="units-thumb" aria-hidden="true" />
      <button
        type="button"
        dir="ltr"
        aria-pressed={units === "c"}
        aria-label={`${t.celsius} (°C)`}
        disabled={disabled}
        onClick={() => onChange?.("c")}
      >
        °C
      </button>
      <button
        type="button"
        dir="ltr"
        aria-pressed={units === "f"}
        aria-label={`${t.fahrenheit} (°F)`}
        disabled={disabled}
        onClick={() => onChange?.("f")}
      >
        °F
      </button>
    </div>
  );
}
