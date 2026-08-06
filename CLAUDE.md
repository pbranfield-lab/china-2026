# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build multi-page HTML/CSS/JS site: a family travel journal/photo album about a trip to the Forbidden City in Beijing, narrated in-character by "Maisie," an 11-year-old. There is no `package.json`, no bundler, no test suite, and no server-side code — every page is plain HTML that loads `assets/data.js` then `assets/site.js` directly via `<script>` tags.

## Running it locally

There's no build or dev-server command defined in the repo. To preview changes, either open the HTML files directly in a browser or serve the directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

There is no lint, test, or build command — verify changes by loading the pages in a browser.

## Architecture

**Pages** (`index.html`, `story.html`, `family.html`, `map.html`, `gallery.html`) are near-identical shells: same `<head>`, same `.site-nav` header/nav markup, same `assets/data.js` + `assets/site.js` script includes at the end of `<body>`. Each page only differs in its `<main>` content and which optional DOM containers it includes (e.g. `#historyIntro`, `#familyGrid`, `#pinLayer`/`#detailPanel`, `#galleryGrid`, `#modalOverlay`). When adding a new page, copy an existing one as the template to keep the header/nav/script wiring consistent.

**`assets/data.js`** is the single source of content/data, loaded before `site.js`:
- `HISTORY_INTRO` — HTML string injected into `story.html`.
- `FAMILY` — array of family member objects (`id`, `name`, `role`, `file`, `emoji`, `bio`) rendered into `family.html`. `file` is a portrait filename looked up in `Photographs/` and swapped in for the emoji avatar if the image loads.
- `LOCATIONS` — array of map-pin/story entries (`id`, `num`, `x`/`y` as percentage coordinates over `assets/forbidden-city-map.png`, `name`, `chinese`, `story` HTML, `william` quote). Drives the pins in `map.html`.
- `PHOTOS` — array of photo entries (`id`, `location` — must match a `LOCATIONS.id` — `file`, `caption`, `detail` HTML). Backs both the map popout's photo grid and `gallery.html`.
- `EMPTY_STATE_LINES` — filler text shown for a location with no photos yet.

**`assets/site.js`** is all vanilla JS, structured as independent IIFEs, one per feature, each guarding on `document.getElementById(...)` so a page only wires up the UI blocks it actually has:
- Nav mobile-toggle + current-page highlighting (all pages).
- Scroll-reveal via `IntersectionObserver` for `.reveal` elements.
- History intro injection (`story.html`).
- Family grid rendering with async portrait swap-in (`family.html`).
- Photo modal (`#modalOverlay`) — shared by both `map.html`'s popout and `gallery.html`; exposes a shared `openPhoto(photo)` closure.
- Map pins + the "focus-shift" location popout, including `?loc=<id>` deep-link support (`map.html`).
- Gallery grid with location filter buttons, derived from which locations actually have photos (`gallery.html`).

**`assets/styles.css`** is one shared stylesheet for all pages, built around CSS custom properties (lacquer/vermillion/gold palette, `--font-display`/`--font-body`) defined in `:root`. Component styles are grouped by page/feature under comment headers (site nav, hero, nav cards, scroll panel, family cards, map, location popout, photo thumbs, gallery, modal), followed by a single mobile media query block at the end covering all components.

## Adding content

- **New photo**: drop the image into `Photographs/`, then add an entry to `PHOTOS` in `assets/data.js` with a `location` matching an existing `LOCATIONS.id`.
- **New map location**: add an entry to `LOCATIONS` in `assets/data.js` with `x`/`y` read off the labeled floor plan (`assets/forbidden-city-map.png`) as percentages, plus `story` and `william` copy.
- **Family portraits**: place the image in `Photographs/` and reference it via the `file` field in `FAMILY`; it's picked up automatically.
- `Guide/guide.txt` holds raw exported chat notes (photo-by-photo historical detail) used as source material when writing `story`/`detail` copy — not code, and not wired into the site.

## Content voice

Copy throughout (`HISTORY_INTRO`, location `story`/`william` fields, photo `caption`/`detail`) is written in Maisie's first-person, wry-11-year-old voice, with recurring bits (Mum as "Queen of China," William's deadpan one-liners, Dad's obsessive photo-taking). Match this tone when writing new copy rather than reverting to neutral museum-guide text.
