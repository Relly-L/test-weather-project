# Weather

A minimalist weather site: Next.js (App Router, TypeScript), static export, GitHub Pages. Weather and geolocation are requested on the client.

## Documents
- [Functional requirements](docs/FUNCTIONAL_REQUIREMENTS.md)
- [Technical requirements](docs/TECH_REQUIREMENTS.md)
- [Implementation plan](docs/PLAN.md)
- [Ideas for later](docs/IDEAS.md)
- [Image and flag credits](docs/CREDITS.md)

## Key constraints
- Static export only (`output: 'export'`): no API routes, no middleware, no server data.
- 28 locales (`src/lib/i18n.ts`, `src/locales/`), `en` by default, chosen from the browser language and with the flag button; `ar` and `he` are right to left (logical CSS properties, `dir`). There is no Russian. Flags are SVG only, from `public/flags/` (emoji flags do not render on Windows).
- Nothing is saved (no `localStorage`, cookies or analytics): language, units and city live until reload. Units: °F by default only for a US region, otherwise °C.
- The repository is public: no secrets or keys.
- Backgrounds live in `public/backgrounds/`; build paths with `basePath`.
- Place detection order: geolocation, IP, the "needs location" screen. A manually chosen city takes priority for the visit.
- External services (all keyless): Open-Meteo (weather, city search), ipwho.is (IP), BigDataCloud (city name). Open-Meteo attribution only in the README.
- Animations: only `transform`/`opacity` and one Canvas per screen, everything off under `prefers-reduced-motion`; do not add new dependencies for animations.
- Documentation is written in English.
- Working order: collect the user's edits until they say "all"; commit, push and deploy only after the user has checked locally.

## Visual check
- The `/test/` page shows all backgrounds and screen states with sample data (no geolocation, weather or search requests). It is excluded from indexing. Add new states and backgrounds to the `scenarios` lists in `src/app/test/page.tsx`.
