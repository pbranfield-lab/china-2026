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

**Trips.** The site covers more than one trip (currently the Forbidden City in Beijing, and Xi'an). There is still only one set of pages — they're made trip-aware by a `?trip=<id>` query param. With no `?trip=` the site falls back to `TRIPS[0]`, so every pre-existing link keeps working. A third trip is pure data: add a `TRIPS` entry, tag its `LOCATIONS`/`PHOTOS`, add a plan image and a photo folder.

**`assets/data.js`** is the single source of content/data, loaded before `site.js`:
- `TRIPS` — the top-level concept. Each entry has `id` (used in `?trip=`), `name`, `chinese`, `city`, `icon`, `blurb`, `map` (filename under `assets/`), `mapAlt`, `mapCredit`, `photoDir` (folder under `Photographs/`), and `intro` (the HTML string for `story.html`). `photoDir` is deliberately separate from `id` so URLs stay short while folders stay descriptive (`id:"xian"` → `photoDir:"terracotta-warriors"`).
- `HISTORY_INTRO` / `TERRACOTTA_INTRO` — per-trip intro HTML strings, referenced from `TRIPS[].intro`.
- `ofTrip(trip, items)` — small helper that stamps `trip` onto every object in a group, so the tag is declared once per group instead of on every entry.
- `FAMILY` — array of family member objects (`id`, `name`, `role`, `file`, `emoji`, `bio`) rendered into `family.html`. Deliberately **trip-agnostic**: portraits always resolve from `Photographs/forbidden-city/` regardless of the current trip (see `FAMILY_PHOTO_DIR` in `site.js`) — pointing them at `CURRENT_TRIP.photoDir` would 404 on every other trip.
- `LOCATIONS` — flat array built from `...ofTrip("<trip>", [...])` groups. Each entry: `id`, `trip`, `num`, `x`/`y` as percentage coordinates over that trip's plan image, `name`, `chinese`, `story` HTML, and an **optional** `william` quote. `num` restarts at 1 per trip (pins are filtered per trip, so it needn't be globally unique). Drives the pins in `map.html`.
- `PHOTOS` — flat array, same `ofTrip` treatment. Each entry: `id`, `trip`, `location` (must match a `LOCATIONS.id`), `file`, `caption`, `detail` HTML. Backs both the map popout's photo grid and `gallery.html`.
- `EMPTY_STATE_LINES` — filler text shown for a location with no photos yet.

**`assets/site.js`** is all vanilla JS, structured as independent IIFEs, one per feature, each guarding on `document.getElementById(...)` so a page only wires up the UI blocks it actually has. A few module-scope constants are resolved first, before any IIFE:
- `CURRENT_TRIP` — resolved from `?trip=`, defaulting to `TRIPS[0]`.
- `TRIP_LOCATIONS` — `LOCATIONS` filtered to the current trip; used by both the map and gallery blocks.
- `FAMILY_PHOTO_DIR` — pinned to `"forbidden-city"` for the trip-agnostic family portraits.
- `photoSrc(photo)` — builds an image src from the photo's **own** `trip`, not the current one, so a photo always points at the right folder.
- `data-trip` is set on `<html>` so CSS can tune per-trip (the Xi'an plan is sparser, so its pins are smaller and semi-transparent).

Then, per feature:
- Nav mobile-toggle + current-page highlighting, and rewriting nav `href`s to carry `?trip=` (all pages). The highlight compares hrefs with the query string stripped from both sides.
- Hero seal (`#heroSeal`) swapped to the current trip's characters — on `story.html`/`gallery.html` only; `family.html` stays trip-agnostic.
- Scroll-reveal via `IntersectionObserver` for `.reveal` elements.
- Trip intro injection from `CURRENT_TRIP.intro` (`story.html`).
- Family grid rendering with async portrait swap-in (`family.html`).
- Photo modal (`#modalOverlay`) — shared by both `map.html`'s popout and `gallery.html`; exposes a shared `openPhoto(photo)` closure.
- Map plan/credit swap from `CURRENT_TRIP` (`#mapImg`, `#mapLegend`), and the home-page trip chooser rendered into `#tripChooser` (`index.html`).
- Map pins + the "focus-shift" location popout, filtered to `TRIP_LOCATIONS`, including `?loc=<id>` deep-link support validated against the current trip so a mismatched `?trip=`/`?loc=` pair degrades gracefully (`map.html`). The William box only renders when the location actually has a `william` quote.
- Gallery grid with location filter buttons, both scoped to the current trip (`gallery.html`).

⚠️ **`PHOTOS.indexOf(p)` / `PHOTOS[i]` in the map popout is positional** — the popout's thumbnails index into the single flat global `PHOTOS`. Don't swap that render path onto a filtered copy or the indices go stale. The gallery is safe to filter because it looks photos up by `id`.

**`assets/styles.css`** is one shared stylesheet for all pages, built around CSS custom properties (lacquer/vermillion/gold palette, `--font-display`/`--font-body`) defined in `:root`. Component styles are grouped by page/feature under comment headers (site nav, hero, nav cards, scroll panel, family cards, map, location popout, photo thumbs, gallery, modal), followed by a single mobile media query block at the end covering all components.

## Adding content

- **New photo**: drop the image into that trip's folder (`Photographs/<photoDir>/` — `forbidden-city/` or `terracotta-warriors/`), then add an entry to the matching `ofTrip(...)` group in `PHOTOS`, with a `location` matching a `LOCATIONS.id` from the same trip. Web-size it first: the existing photos are ~1400px on the long edge and 60–250 KB, not raw camera dumps.
- **New map location**: add an entry to the right `ofTrip(...)` group in `LOCATIONS`, with `x`/`y` read off that trip's plan image as percentages, plus `story` copy. `william` is optional — omit it rather than stubbing it.
- **New trip**: add a `TRIPS` entry, create `Photographs/<photoDir>/`, add a plan image to `assets/`, and add `ofTrip("<id>", [...])` groups to `LOCATIONS` and `PHOTOS`. No HTML changes needed — the pages and the home-page chooser pick it up automatically.
- **Family portraits**: place the image in `Photographs/forbidden-city/` and reference it via the `file` field in `FAMILY`; it's picked up automatically on every trip.
- `Guide/guide.txt` holds raw exported chat notes (photo-by-photo historical detail) used as source material when writing `story`/`detail` copy — not code, and not wired into the site.
- `docs/xian-moments.md` tracks the family anecdotes and William quotes still missing from the Xi'an trip, and how to add them.

## Content voice

Copy throughout (trip intros, location `story`/`william` fields, photo `caption`/`detail`) is written in Maisie's first-person, wry-11-year-old voice, with recurring bits (Mum as "Queen of China," William's deadpan one-liners, Dad's obsessive photo-taking). Match this tone when writing new copy rather than reverting to neutral museum-guide text. `docs/maisie-voice-interview.md` is the grounding source for the voice; the `maisie` subagent writes in it.

**Two rules on truthfulness, which override tone:**

1. **Don't invent what happened on the trip.** Factual/historical copy about a place is fine to write. Specific family moments, quotes and reactions are the family's to supply — leave them out and log them in a `docs/*-moments.md` checklist instead. Nothing half-written ships: omit the field rather than stubbing it with placeholder text.
2. **Describe only what's actually in the photo.** Check the image before writing its caption. Several Xi'an files were originally misnamed, and captions written from the filename rather than the picture were wrong.

**Sourced (non-family) photos** must not mention any family member and must stay factual. Currently: `bell-tower-day.jpg` (Wang Zhongyin, CC BY-SA 4.0), `muslim-quarter-great-mosque-sign.jpg` (Qianeal, CC BY-SA 4.0), `muslim-quarter-xiyangshi-arch.jpg` (thierrytutin, CC BY 2.0).
