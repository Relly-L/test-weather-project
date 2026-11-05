# Weather

A minimal weather page: the current temperature in °C over a background that matches the weather.

- Next.js (App Router, TypeScript), static export (`output: 'export'`), hosted on GitHub Pages.
- Location: browser Geolocation API, falling back to an approximate position by IP.
- Weather and city search: [Open-Meteo](https://open-meteo.com/) (no API key). All requests are made from the browser.
- City name for the detected location: [BigDataCloud](https://www.bigdatacloud.com/) free reverse geocoding (no API key).
- Languages: 28, chosen from the browser language (English by default) and switchable with the flag button. Arabic and Hebrew are laid out right to left. Translations were prepared without review by native speakers, corrections are welcome.
- Units: °C, or °F when the first browser language is a US one (for example `en-US`); switchable at the bottom left.
- Location order: browser geolocation, then IP, then a prompt to allow location (the city search always works).
- Nothing is saved between visits: language, units and the picked city live only until the page is reloaded.

## Attribution

City search uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api); weather and geocoding data by [Open-Meteo.com](https://open-meteo.com/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Open-Meteo is free for non-commercial use, check [its terms](https://open-meteo.com/en/terms) before any commercial use.

## Privacy

- If the browser location is unavailable, the visitor's IP address is sent to [ipwho.is](https://ipwho.is) to get an approximate position.
- Coordinates are rounded to two decimals before being sent to Open-Meteo and BigDataCloud. Search text is sent to Open-Meteo while typing.
- Nothing is stored: no `localStorage`, cookies, analytics or server-side data.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm test
npm run build      # static site in out/
```

For a build served under a sub-path (GitHub Pages project site), set `NEXT_PUBLIC_BASE_PATH=/test-weather-project`; the deploy workflow does this.

## Docs

Requirements, plan and image credits are in [`docs/`](docs/). Background photos are from [Unsplash](https://unsplash.com/license), flags from [flag-icons](https://github.com/lipis/flag-icons) (MIT), see [`docs/CREDITS.md`](docs/CREDITS.md).
