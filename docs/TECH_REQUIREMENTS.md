# Weather: technical requirements

Functional requirements: [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md).

Status: implemented through iteration 4; the only open question is the domain (see the end).

## Confirmed

### Project
- A small minimalist weather site.
- Project folder: `E:\AI\Claude\Projects\Weather`.
- Next.js was chosen as a foundation for the future, and because the author knows it.

### Stack
- Next.js, App Router.
- TypeScript.
- SSG mode: `output: 'export'` in `next.config`; the output is the static `out/` directory.
- No server components with runtime data, no API routes and no middleware: all of these are incompatible with a static export.

### Background
- Static images in `public/` (`next/image` needs `images.unoptimized: true` with a static export, so the files must be prepared in advance).
- 8 slots: `clear-day`, `clear-night`, `cloudy`, `rain`, `snow`, `thunderstorm`, `fog`, `default` (the fallback, a neutral sky).
- Format: WebP, portrait, about 1080×1920, up to ~200 KB per file; `object-fit: cover`.
- Source: Unsplash (the Unsplash License: free, including commercial use, attribution not required). Files are downloaded and kept in the repository, no hotlinking.
- Regular Unsplash photos only, without the Unsplash+ label (the paid tier). Check the license on each photo's page.
- The author and link of each photo are recorded in `docs/CREDITS.md`.
- Candidates (collections to choose from): [Clear Sky Day](https://unsplash.com/@rbtech/collections), [Startrails and Comets](https://unsplash.com/collections/9336269/startrails-and-comets), the searches [thunderbolt](https://unsplash.com/s/photos/thunderbolt) and [dark weather](https://unsplash.com/s/photos/dark-weather).

### Animations
- Implementation: CSS animations (only `transform` and `opacity`) for clouds, fog, stars, the glow and the appearance; Canvas 2D for rain, snow and storms. One `<canvas>` per screen, sized to its container (`ResizeObserver`), `devicePixelRatio` capped at 1.5, the particle count depends on the area, the time step is capped, and the `requestAnimationFrame` loop stops on unmount (in a background tab the browser pauses frames itself).
- Parallax: CSS variables `--px`, `--py` (from −1 to 1) on the screen's root element, smoothing (lerp) in `requestAnimationFrame`, and the loop stops once the target is reached. Offsets: background ±12 px (scale 1.08 so the edges stay hidden), effects layer ±26 px (the layer is 32 px larger than the screen on every side), text ±10 px. Sources: `pointermove` (mouse) and `deviceorientation` for a coarse pointer, if the API does not require `requestPermission` (iOS).
- `prefers-reduced-motion`: a global switch-off for CSS animations and transitions, plus the `useReducedMotion` hook (while the value is unknown it counts as "reduce"); effects and parallax are not mounted.
- No new dependencies. Star positions are deterministic and rounded (no `Math.random` during rendering), so there are no hydration mismatches.
- `will-change: transform` only on three layers (background, effects, text).

### Storage
- Nothing is saved: no `localStorage`, cookies or analytics. The language and the units are determined from the browser on every visit; the choice of city, language and units lives in the page state until reload.

### Interface
- The search is an accessible combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, `role="listbox"`/`option`), the field font size is at least 16 px (so iOS does not zoom the page), keyboard handling, cancellation of stale requests (`AbortController`), an input delay of about 250 ms.
- The size of the large temperature is set with container query units (`cqw`) relative to the screen or frame width.
- The phone frame is enabled by a media query at a width of 500 px and up.
- The temperature size depends on the length of the number (1–2, 3, 4 or more characters), so `-40°` and `104°` fit on the screen.
- Units: `c` or `f`; the default is `f` if the first browser language has the region `US`, otherwise `c`. The conversion is `°C × 9/5 + 32`, rounded after the conversion.
- Flags: SVG files in `public/flags/<country code>.svg` from the [flag-icons](https://github.com/lipis/flag-icons) package (MIT license, version 7.6.0, the `1x1` variant), only the 28 files needed, with the license next to them. Emoji flags are not used because Windows renders them as letters. The images in the language list are loaded only after the list is opened for the first time.
- The language list and the °C/°F switch: buttons with `aria-label`, `aria-expanded`, `aria-pressed`, closing on Escape and on a click outside the list, a visible focus ring. A closed list cannot receive focus (`inert`).
- Animations of drop-down lists and buttons use only `transform` and `opacity` (plus `visibility` for the closed list); they are disabled by `prefers-reduced-motion`.

### Localization
- The language is chosen from the browser language (`navigator.languages`) and switched with the flag button; the choice is not saved.
- 28 locales: `en`, `uk`, `de`, `fr`, `es`, `it`, `pt`, `pl`, `cs`, `sk`, `nl`, `sv`, `da`, `nb`, `fi`, `tr`, `ro`, `hu`, `bg`, `el`, `ja`, `ko`, `zh`, `hi`, `id`, `vi`, `ar`, `he`. The Ukrainian code is `uk` (`ua` is a country code). There is no Russian.
- Browser code aliases: `no` and `nn` to `nb`, `iw` to `he`, `in` to `id`; Chinese has a single variant, `zh` (simplified).
- The default language is English (`en`), including when the browser language is not supported.
- RTL: `ar` and `he`. `dir="rtl"` is set on `<html>` and on the screen's root element; the layout uses logical properties (`inset-inline-*`, `text-align: start`), and animations that shift along X account for `:dir(rtl)`.
- Locale metadata (`src/lib/i18n.ts`): the native name, the flag code and the writing direction. Language names are not translated and are shown in the language itself.
- Every locale dictionary has the same set of keys; a test checks this. A new language is added with a `src/locales/<code>.json` file, an entry in `i18n.ts` and a flag in `public/flags/`.
- The translations were prepared without review by native speakers.
- The search and reverse geocoding APIs receive the locale code (`language` and `localityLanguage`); for rare languages the service may return an English name.
- The locale is detected on the client: a static export has no middleware and no `Accept-Language` header, and the built-in Next.js i18n routing does not work. Separate URLs per locale are not needed.
- The static HTML is served in English, and after hydration the texts are replaced for the user's locale (a brief flash is possible, take this into account during implementation).
- The texts live in dictionaries (`en.json` and so on), with no heavy i18n libraries. The same dictionaries drive the `<html lang>` attribute.
- Numbers and units are formatted with `Intl.NumberFormat` for the locale.

### Data
- Weather: the Open-Meteo Forecast API (free, no API key).
- City search (autocomplete): the Open-Meteo Geocoding API (`geocoding-api.open-meteo.com/v1/search`) with the parameters `name`, `count`, `language` (= the interface locale). The data license is CC BY 4.0, free for non-commercial use; attribution only in the README. Check the limits and terms on the Open-Meteo site.
- City name for coordinates: BigDataCloud Free Reverse Geocode (`api.bigdatacloud.net/data/reverse-geocode-client`, no key, CORS open), parameter `localityLanguage` = the locale; `city` is used, otherwise `locality`, otherwise `principalSubdivision`. Rounded coordinates are sent to this service; this is stated in the README.
- IP detection returns coordinates only (ipwho.is); for the IP path the city name comes from the same reverse geocoding, because ipwho.is does not support Ukrainian.
- Coordinates: the browser Geolocation API; on denial or error, IP detection through the free HTTPS service ipwho.is (HTTPS, CORS open, no key).
- Order of place detection: browser geolocation, IP, a screen asking to allow location. Details in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md).
- Place and weather are requested once per visit (and on "Retry"); a language change re-requests only the city name, and a units change requests nothing (the °C to °F conversion happens on the page).
- Requests are made **on the client** (in the browser), because a static build does not know the weather at request time.
- There must be no secrets or environment variables holding keys.

### Repository and deployment
- Repository: `test-weather-project` on the author's personal GitHub account, public (GitHub Pages is free for public repositories). There must be no secrets in the repository.
- First-version hosting: GitHub Pages (the static `out/` directory).
- Publishing through GitHub Actions: `next build`, then deploying the `out/` artifact to Pages (Settings → Pages → Source: GitHub Actions).
- When the repository is published as a project page (`<user>.github.io/<repo>/`), `next.config` needs `basePath` = `/test-weather-project` (set through an environment variable so that it works locally and after a domain change without edits); background and flag paths are built with `basePath` (Next does not add it itself for plain `<img>` and CSS). A user page (`<user>.github.io`) or a custom domain does not need `basePath`.
- Deploying through GitHub Actions does not use Jekyll, so `.nojekyll` is not needed (it would only be needed when publishing from a branch).
- Domain: a custom one is desirable, but only a free one. Start with the GitHub Pages address (`<user>.github.io/<repo>`, with `basePath`). Later a free subdomain can be attached through a CNAME and the Custom domain field in the Pages settings; then `basePath` is removed.
- Free subdomain candidates (check the terms and timing on the official pages): [is-a.dev](https://github.com/is-a-dev/register), [eu.org](https://nic.eu.org), [Open Domains](https://github.com/open-domains/register). [js.org](https://github.com/js-org/js.org) is only for projects related to JavaScript and no longer issues subdomains for personal pages.
- No server dependencies at runtime; moving to another static host should come down to changing `basePath`.

## Open questions
- Subdomain: to be decided later, after the first release.
