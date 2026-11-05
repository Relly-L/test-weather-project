"use client";

import { useState } from "react";
import type { Locale, Units } from "../lib/i18n";
import type { ScreenState } from "../lib/screenState";
import CitySearch from "./CitySearch";
import LanguageSwitch from "./LanguageSwitch";
import UnitToggle from "./UnitToggle";
import WeatherScreen from "./WeatherScreen";

/** A phone-shaped preview. Effects and parallax run only while hovered or focused. */
export default function PreviewFrame(props: { state: ScreenState; locale: Locale; units?: Units }) {
  const { state, locale, units = "c" } = props;
  const [active, setActive] = useState(false);
  return (
    <div
      className="frame"
      tabIndex={0}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <WeatherScreen
        state={state}
        locale={locale}
        units={units}
        motion={active}
        top={<CitySearch locale={locale} disabled />}
        bottomStart={<UnitToggle units={units} locale={locale} disabled />}
        bottomEnd={<LanguageSwitch locale={locale} disabled />}
      />
    </div>
  );
}
