# Weather: functional requirements

Status: version 1 with extensions (phone frame, city name, city search, animations, 28 languages, °C/°F, language switcher). Technical requirements: [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md).

## General
- A single page, Mobile First.
- Narrow screens (under 500 px): the content fills the whole screen.
- Wide screens: a phone-screen-shaped frame centered on a dark page (the same look as the previews on `/test/`).
- Interface language: taken from the browser language, English by default; can be switched with the flag button (see "Languages").
- Minimalism: search, city name, temperature, a background with unobtrusive animations, and two corner buttons.
- **Nothing is saved**: not the language, not the units, not the city. Everything is determined again on every visit, and a choice lasts until the page is reloaded.

## Screen
From top to bottom and in the corners:
1. **City search field** at the top of the screen (see "City search").
2. **City name** in small type above the temperature; if the name is unknown, the line is not shown.
3. **Temperature** in the center in very large digits, a whole number; the default units depend on the region (see "Units"). The size is chosen so that values like `-40°` and `104°` still fit on the screen.
4. **Background**: a static picture matching the current weather, with animations and parallax on top (see below).
5. **Bottom, at the start of the line** (left, or right in RTL): the °C / °F switch.
6. **Bottom, at the end of the line** (right, or left in RTL): a round button with the flag of the current language that opens the language list.

### Weather code to background mapping (WMO)
| Background | Codes |
|---|---|
| `clear-day` / `clear-night` | 0, 1 (by the day/night flag) |
| `cloudy` | 2, 3 |
| `fog` | 45, 48 |
| `rain` | 51–57, 61–67, 80–82 |
| `snow` | 71–77, 85–86 |
| `thunderstorm` | 95, 96, 99 |
| `default` | any other code or no data |

## Languages
- 28 languages: `en`, `uk`, `de`, `fr`, `es`, `it`, `pt`, `pl`, `cs`, `sk`, `nl`, `sv`, `da`, `nb`, `fi`, `tr`, `ro`, `hu`, `bg`, `el`, `ja`, `ko`, `zh`, `hi`, `id`, `vi`, `ar`, `he`. There is no Russian.
- On arrival the language is taken from the browser languages (the first supported one), otherwise English. Older codes are mapped to ours: `no` and `nn` to `nb`, `iw` to `he`, `in` to `id`.
- Arabic and Hebrew are written right to left: the page gets `dir="rtl"`, the whole layout is mirrored and the corner buttons swap places.
- The translations were prepared without review by native speakers; this is stated in the README.
- **Language button**: round, with the flag of the current language. Pressing it opens, above the button, a list of round flags without captions (each has a hidden name in its own language for screen readers, and a tooltip). Choosing a language changes it immediately, without a reload, and closes the list. The list closes on a click outside it and on Escape.
- A flag stands for a country, not a language: `en` United Kingdom, `uk` Ukraine, `es` Spain, `pt` Portugal, `zh` China, `ar` Egypt, `hi` India, `he` Israel, and so on.

## Temperature units
- A two-position switch, °C and °F; a smoothly sliding indicator marks the selected position.
- The default is °F when the first browser language has the US region (for example `en-US`); °C for everyone else.
- The source returns °C; the conversion to °F happens on the page.

## Animations and parallax
- **Parallax.** The screen layers (background, weather effects, text) shift by different amounts and create depth: with the cursor on desktop; with device tilt on phones where the browser does not require permission (on iOS tilt parallax is off so that no prompt is shown). The search field and the corner buttons do not move. The return to the center is smooth.
- **Weather effects:**

| Background | Effect |
|---|---|
| `clear-day` | a soft glow at the top right that slowly "breathes" |
| `clear-night` | twinkling stars |
| `cloudy`, `default` | slowly drifting cloud layers |
| `fog` | drifting fog bands |
| `rain` | falling raindrops |
| `snow` | falling flakes with a slight sway |
| `thunderstorm` | heavy rain and rare lightning flashes (single and double) |

- **Appearance.** The city name and the temperature fade in smoothly (opacity and a small upward shift). A background change is a smooth cross-fade.
- **Drop-down lists.** The search suggestions open downward with a smooth fade, and the items appear one after another. The language list opens upward from the button (scale and opacity), and the flags appear one after another.
- **Buttons.** The language button and the °C/°F buttons react smoothly to hover and press (grow and shrink); when the language changes, the flag on the button is replaced with an animation; the °C/°F indicator slides with a slight spring.
- **Reduced motion.** When the system setting `prefers-reduced-motion` is on, there is no parallax, no effects, no appearance animation and no transitions; the screen is static.
- **The `/test/` page:** effects and parallax are on only for the frame under the cursor or in focus, so the page stays light.

## City search
- An input with autocomplete: suggestions appear after 2 typed characters, with a short delay after typing.
- A suggestion shows the city name, region and country; the suggestion language matches the interface language.
- Choose with a mouse, a tap or the keyboard (arrows, Enter, Escape).
- If nothing is found, a short message is shown; if the service is unavailable, a message about that.
- After a city is chosen, its weather and name are shown and the field is cleared.
- A manually chosen city applies until the page is reloaded and is not saved anywhere. Its name stays in the language that was active when the city was chosen.

## Location detection
Order on arrival:
1. Browser geolocation.
2. If that fails, an approximate position by IP.
3. If that fails, a screen asking to allow location, with a "Retry" button (the search field stays available).

Rules:
- While detection is running, a loading state is shown.
- A city chosen manually during the current visit takes priority over automatic detection.
- Changing the language or the units does not trigger a new location detection or a new weather request; only the city name is refreshed.

## City name
- Chosen manually: the name from the suggestion.
- Detected automatically (geolocation or IP): the name for the coordinates via reverse geocoding, in the interface language; requested again when the language changes.
- If the name cannot be obtained, the line is hidden and no error is shown.

## States
- Loading: a neutral background and an indicator.
- Coordinates not determined: a screen asking to allow location in the browser, with a "Retry" button.
- Weather request error: a short message and a "Retry" button.

## Visual check
- The `/test/` page shows all backgrounds and states with sample data, without geolocation, weather or search requests. English and Ukrainian show the full set of scenarios (including °F); the other 26 languages show two screens: the temperature and the "needs location" screen (the longest texts). Arabic and Hebrew appear in the mirrored layout.

## Out of scope for the current version
Forecast, humidity, wind, themes, saving settings (language, units, city), managing a list of cities.
