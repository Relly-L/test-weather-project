# Weather

A minimal weather page: the current temperature in °C over a background that matches the weather.

- Next.js (App Router, TypeScript), static export (`output: 'export'`), hosted on GitHub Pages.
- Location: browser Geolocation API, falling back to an approximate position by IP.
- Weather: [Open-Meteo](https://open-meteo.com/) (no API key). All requests are made from the browser.
- Languages: English (default) and Ukrainian, chosen from the browser language.

## Privacy

If the browser location is unavailable, the visitor's IP address is sent to [ipwho.is](https://ipwho.is) to get an approximate position. Coordinates are rounded to two decimals before being sent to Open-Meteo. Nothing is stored.

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

Requirements, plan and image credits are in [`docs/`](docs/). Background photos are from [Unsplash](https://unsplash.com/license), see [`docs/CREDITS.md`](docs/CREDITS.md).
