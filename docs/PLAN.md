# Weather: implementation plan

Based on [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) and [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md). Status: iterations 1–4 are implemented locally; iterations 2–4 are not committed or deployed yet. Site: https://relly-l.github.io/test-weather-project/ , repository: https://github.com/Relly-L/test-weather-project .

## Iteration 1: base site (done and deployed)
1. **Project skeleton.** Next.js (App Router, TypeScript) created by hand in the existing folder (`create-next-app` dislikes a non-empty one). `next.config`: `output: 'export'`, `images.unoptimized`, `basePath` from an environment variable (`/test-weather-project` in production). Scripts `dev`, `build`, `typecheck`, `test`.
2. **Localization.** Dictionaries and selection by `navigator.languages`, fallback `en`, `<html lang>` update.
3. **Data.** Modules: browser geolocation, IP detection (ipwho.is), the current weather from Open-Meteo (temperature, weather code, day/night flag), a "weather code to background" function. Timeouts and error handling.
4. **Interface.** A single Mobile First page: a full-screen background, a large temperature in the center, loading, "needs location" and error states with a Retry button, translated texts.
5. **Checks.** Unit tests, `next build`, a browser check at mobile and wide widths.
6. **Repository and deployment.** `git init`, the first commit, a public repository, a GitHub Actions workflow for Pages, a check of the live address.
7. **Wrap-up.** `README.md`, `CLAUDE.md`, a re-check of the photo licenses.

## Iteration 2: phone frame, city name, search
Requirements: [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md), [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md).
1. Documentation.
2. Modules: `geocoding` (search and reverse geocoding) and new dictionary keys. (The `storage` module for a saved city was added here and later removed in iteration 4.)
3. The `CitySearch` component, the city line in `WeatherScreen`, new `WeatherView` logic.
4. Styles: the phone frame from 500 px, the city line, the search field.
5. The `/test/` page with a city and a disabled search field, the README (Open-Meteo attribution, privacy).
6. Checks: typecheck, tests, build, a local look. Commit, push and deploy only after the user's check.

## Iteration 3: animations and parallax
Requirements: "Animations and parallax" in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) and "Animations" in [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md).
1. Documentation.
2. Helpers: pure parallax functions with tests, the `useReducedMotion` and `useParallax` hooks.
3. Effects: `Particles` (Canvas: rain, snow, storm) and `AmbientFx` (CSS: clouds, fog, stars, glow).
4. `WeatherScreen`: parallax layers, a cross-fade of backgrounds, text appearance; styles; `/test/` with effects on hover.
5. Checks: typecheck, tests, build, a local look. Commit, push and deploy only after the user's check.

## Iteration 4: languages, units, switchers
Requirements: "Languages", "Temperature units" and "Screen" in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md), and "Localization" and "Interface" in [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md).
1. Documentation (translated to English), flags in `public/flags/`.
2. 28 dictionaries, locale metadata, RTL, units, code aliases; tests.
3. The `UnitToggle` and `LanguageSwitch` components; remove `localStorage` (the city is no longer saved); `WeatherView`: language and units in state, a language change does not re-request the weather.
4. Styles: a larger temperature, corner buttons, a mirrored layout, drop-down and button animations.
5. The `/test/` page: the full set for `en` and `uk`, two screens for each other language.
6. Checks: typecheck, tests, build, a local look. Commit, push and deploy only after the user's check.

## Decisions made along the way
- Package manager: npm; Node 22.
- IP service: ipwho.is (HTTPS, CORS open, no key).
- Temperature format: a whole number, rounded after any unit conversion, with a minus sign.

## Risks
- IP detection sends the user's IP to a third-party service (stated in the README).
- Limits of the free APIs; request caching is not provided.
- A language flash during hydration, because the static build is in English.
- Translations for 26 languages were prepared without native-speaker review.
