# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build multi-page HTML/CSS/JS site: **"China 2026"**, a family travel journal/photo album covering a family's 2026 trips across China, narrated in-character by "Maisie," an 11-year-old. There is no `package.json`, no bundler, no test suite, and no server-side code — every page is plain HTML that loads `assets/data.js` then `assets/site.js` directly via `<script>` tags.

**No single trip is the theme.** The site began as a Forbidden City album and was rebranded once it covered more than one destination; the Forbidden City is now just `TRIPS[0]`. It remains first in the array purely because a bare URL with no `?trip=` falls back to `TRIPS[0]`, which keeps every pre-existing link working — that's a compatibility default, not a statement about billing. Don't reintroduce Forbidden City branding into the shared nav, titles or home hero.

## Where it lives

- **Site:** `https://pbranfield-lab.github.io/china-2026/` — GitHub Pages, built
  from `master` at the repo root. Pushing to `master` publishes.
- **Repo:** `https://github.com/pbranfield-lab/china-2026`

Renamed from `forbidden-city-maisie` on 2026-08-09. A separate public repo still
sits at that old name containing nothing but a redirect page, because renaming a
repo does **not** redirect its GitHub Pages URL. Consequences: the old
`github.com` repo URL now shows that stub rather than redirecting here, and
pushing this project to the old remote URL would push to the stub — check
`git remote -v` says `china-2026`. See `docs/HANDOFF.md` for the full reasoning.

## Running it locally

There's no build or dev-server command defined in the repo. To preview changes, either open the HTML files directly in a browser or serve the directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

There is no lint, test, or build command — verify changes by loading the pages in a browser.

## Architecture

**Pages** (`index.html`, `story.html`, `family.html`, `map.html`, `gallery.html`) are near-identical shells: same `<head>`, same `.site-nav` header/nav markup, same `assets/data.js` + `assets/site.js` script includes at the end of `<body>`. Each page only differs in its `<main>` content and which optional DOM containers it includes (e.g. `#historyIntro`, `#familyGrid`, `#pinLayer`/`#detailPanel`, `#galleryGrid`, `#modalOverlay`). When adding a new page, copy an existing one as the template to keep the header/nav/script wiring consistent.

**Trips.** The site covers more than one trip (currently the Forbidden City in Beijing, Xi'an, and the Great Wall at Mutianyu). There is still only one set of pages — they're made trip-aware by a `?trip=<id>` query param. With no `?trip=` the site falls back to `TRIPS[0]`, so every pre-existing link keeps working. A further trip is pure data: add a `TRIPS` entry, tag its `LOCATIONS`/`PHOTOS`, add a plan image and a photo folder.

**`assets/data.js`** is the single source of content/data, loaded before `site.js`:
- `TRIPS` — the top-level concept. Each entry has `id` (used in `?trip=`), `name`, `chinese`, `city`, `icon`, `blurb`, `map` (filename under `assets/`), `mapAlt`, `mapCredit`, `photoDir` (folder under `Photographs/`), `hero` (image for the home-page rotation), and `intro` (the HTML string for `story.html`). `photoDir` is deliberately separate from `id` so URLs stay short while folders stay descriptive (`id:"xian"` → `photoDir:"terracotta-warriors"`). ⚠️ **`map` is resolved under `assets/`, but `hero` is a full page-relative path** — they aren't the same kind of value. Pick a wide/panoramic image for `hero`; it sits behind a dark scrim in a short, full-width band, so portrait shots crop badly.
- `HISTORY_INTRO` / `TERRACOTTA_INTRO` — per-trip intro HTML strings, referenced from `TRIPS[].intro`.
- `ofTrip(trip, items)` — small helper that stamps `trip` onto every object in a group, so the tag is declared once per group instead of on every entry.
- `FAMILY` — array of family member objects (`id`, `name`, `role`, `file`, `emoji`, `bio`) rendered into `family.html`. **`file` is a path relative to `Photographs/` that includes the trip folder** (e.g. `"forbidden-city/mum.jpg"`), because a portrait lives in the folder of the trip it was actually taken on. `site.js` uses it verbatim as `Photographs/${person.file}` — never prepend a trip directory.
- `LOCATIONS` — flat array built from `...ofTrip("<trip>", [...])` groups. Each entry: `id`, `trip`, `num`, `x`/`y` as percentage coordinates over that trip's plan image, `name`, `chinese`, `story` HTML, and an **optional** `william` quote. `num` restarts at 1 per trip (pins are filtered per trip, so it needn't be globally unique). Drives the pins in `map.html`.
- `PHOTOS` — flat array, same `ofTrip` treatment. Each entry: `id`, `trip`, `location` (must match a `LOCATIONS.id`), `file`, `caption`, `detail` HTML, and an **optional** `type:"video"`. Backs both the map popout's photo grid and `gallery.html`. Video entries are flagged with the explicit `type` field rather than sniffing the extension — currently just `chairlift-ride-up.mp4` on the Great Wall trip.
- `FACTS` — object keyed by trip id, each holding ten `{ stat, label, text }` objects for the "10 Mind-Blowing Facts" section on `story.html`. `stat` is the big headline number (keep it under ~9 characters), `label` names what it counts, `text` is 2–3 sentences of Maisie with `<strong>` on the key figure. **These must be factually true** — that is the entire point of the section. Hedge reported/traditional figures with "reportedly".
- `EMPTY_STATE_LINES` — filler text shown for a location with no photos yet.

**`assets/site.js`** is all vanilla JS, structured as independent IIFEs, one per feature, each guarding on `document.getElementById(...)` so a page only wires up the UI blocks it actually has. A few module-scope constants are resolved first, before any IIFE:
- `CURRENT_TRIP` — resolved from `?trip=`, defaulting to `TRIPS[0]`.
- `TRIP_LOCATIONS` — `LOCATIONS` filtered to the current trip; used by both the map and gallery blocks.
- `FAMILY_PHOTO_DIR` — pinned to `"forbidden-city"` for the trip-agnostic family portraits.
- `photoSrc(photo)` — builds an image src from the photo's **own** `trip`, not the current one, so a photo always points at the right folder.
- `data-trip` is set on `<html>` so CSS can tune per-trip (the Xi'an plan is sparser, so its pins are smaller and semi-transparent; the Great Wall panorama does the same and additionally hides the compass, because a side-on view has no meaningful north).

Then, per feature:
- Nav mobile-toggle + current-page highlighting (all pages). The highlight compares hrefs with the query string stripped from both sides, and skips links carrying a hash so the "10 Facts" anchor doesn't double-highlight alongside "The Story".
- **Rewriting every internal link to carry `?trip=`** — not just the nav. Each page ends with "what to look at next" cards pointing at bare page names; without the param those silently drop the reader back onto `TRIPS[0]` (this was a real bug: the Great Wall gallery's "See them on the map" opened the Forbidden City map). ⚠️ The rewrite **skips any href that already contains `trip=`**, which is what stops the home-page chooser cards being rewritten to all point at the same trip — don't remove that check. The hash is split off *before* the query, or `story.html#facts` becomes `story.html#facts?trip=…`.
- Hero seal (`#heroSeal`) swapped to the current trip's characters — on `story.html`/`gallery.html` only; `family.html` stays trip-agnostic.
- Scroll-reveal via `IntersectionObserver` for `.reveal` elements.
- Trip intro injection from `CURRENT_TRIP.intro` (`story.html`).
- The "10 Mind-Blowing Facts" grid, rendered from `FACTS[CURRENT_TRIP.id]` (`story.html`). The section is `id="facts"` — named so `#facts` works as an anchor — and is `hidden` in the markup, only unhidden when the current trip actually has facts, so a trip without them doesn't leave a bare heading. The same guard reveals the `#factsJump` button in the hero.
- Landing on `story.html#facts` re-asserts scroll position for ~1.2s, releasing on `wheel`/`keydown`/`pointerdown`/`touchstart`. That looks excessive but isn't: the section is revealed by script (so the browser's own fragment handling has nothing to find at first paint) and the CJK webfonts land after load and reflow the long intro by hundreds of pixels. `pointerdown` is in the release list because a scrollbar drag fires none of the others.
- Family grid rendering with async portrait swap-in (`family.html`).
- Photo modal (`#modalOverlay`) — shared by both `map.html`'s popout and `gallery.html`; exposes a shared `openPhoto(photo)` closure. It handles both `<img id="modalImg">` and `<video id="modalVideo">`, branching on `photo.type`. **Both pages carry their own copy of the modal markup**, so a change to one needs making in the other. Closing the modal (or opening an image after a video) calls `unloadVideo()`, which drops the `src` entirely rather than just pausing — a paused video that keeps its `src` carries on buffering and bleeds audio behind the closed overlay.
- `thumbMedia(photo)` builds thumbnail markup for both render paths. Videos get a `<video muted preload="metadata">` with a `#t=0.5` fragment so the browser pulls a frame as the still (no separate poster JPG), plus a `.play-badge` overlay.
- Map plan/credit swap from `CURRENT_TRIP` (`#mapImg`, `#mapLegend`), and the home-page trip chooser rendered into `#tripChooser` (`index.html`).
- Home hero image — a random trip's `hero` is applied to `.hero.home-hero` on each load, so the front page doesn't permanently lead with one trip's photograph. The stylesheet keeps a hard-coded background as the no-JS fallback (its URL is relative to `assets/`, unlike the `hero` paths).
- Home hero subtitle (`#heroSub`) — the trip count and de-duplicated city list are derived from `TRIPS` at load, so adding a trip never leaves a stale "two trips" on the front page. The markup holds a no-JS fallback. Cities are de-duplicated because trips can share one (the Forbidden City and the Great Wall are both Beijing).
- Map pins + the "focus-shift" location popout, filtered to `TRIP_LOCATIONS`, including `?loc=<id>` deep-link support validated against the current trip so a mismatched `?trip=`/`?loc=` pair degrades gracefully (`map.html`). The William box only renders when the location actually has a `william` quote.
- Gallery grid with location filter buttons, both scoped to the current trip (`gallery.html`).

⚠️ **`PHOTOS.indexOf(p)` / `PHOTOS[i]` in the map popout is positional** — the popout's thumbnails index into the single flat global `PHOTOS`. Don't swap that render path onto a filtered copy or the indices go stale. The gallery is safe to filter because it looks photos up by `id`.

**`assets/styles.css`** is one shared stylesheet for all pages, built around CSS custom properties (lacquer/vermillion/gold palette, `--font-display`/`--font-body`) defined in `:root`. Component styles are grouped by page/feature under comment headers (site nav, hero, nav cards, scroll panel, family cards, map, location popout, photo thumbs, gallery, modal), followed by a single mobile media query block at the end covering all components.

## Adding content

- **New photo**: drop the image into that trip's folder (`Photographs/<photoDir>/` — `forbidden-city/`, `terracotta-warriors/` or `the-great-wall/`), then add an entry to the matching `ofTrip(...)` group in `PHOTOS`, with a `location` matching a `LOCATIONS.id` from the same trip. Web-size it first: the existing photos are ~1400px on the long edge and 60–250 KB, not raw camera dumps.
- **New video**: same, but re-encode to **H.264** first (phone video is usually HEVC, which most browsers won't play) and add `type:"video"` to the entry. The repo has no LFS, so keep it small — `chairlift-ride-up.mp4` went 204 MB → 17 MB with `-vf scale=960:-2 -c:v libx264 -preset slow -crf 30 -c:a aac -b:a 80k -movflags +faststart`.
- **New map location**: add an entry to the right `ofTrip(...)` group in `LOCATIONS`, with `x`/`y` read off that trip's plan image as percentages, plus `story` copy. `william` is optional — omit it rather than stubbing it.
- **New trip**: add a `TRIPS` entry, create `Photographs/<photoDir>/`, add a plan image to `assets/`, and add `ofTrip("<id>", [...])` groups to `LOCATIONS` and `PHOTOS`. No HTML changes needed — the pages and the home-page chooser pick it up automatically.
- **Family portraits**: place the image in `Photographs/forbidden-city/` and reference it via the `file` field in `FAMILY`; it's picked up automatically on every trip.
- `Guide/guide.txt` holds raw exported chat notes (photo-by-photo historical detail) used as source material when writing `story`/`detail` copy — not code, and not wired into the site.
- `docs/xian-moments.md` and `docs/great-wall-moments.md` track the family anecdotes and William quotes still missing from those trips, and how to add them. The Great Wall one also lists which people were identified by outfit-matching rather than being confirmed — check it before trusting a name in a caption.
- `docs/great-wall-curation.md` records which 27 of the 82 raw Great Wall files were kept and why.

## Content voice

Copy throughout (trip intros, location `story`/`william` fields, photo `caption`/`detail`) is written in Maisie's first-person, wry-11-year-old voice, with recurring bits (Mum as "Queen of China," William's deadpan one-liners, Dad's obsessive photo-taking). Match this tone when writing new copy rather than reverting to neutral museum-guide text. `docs/maisie-voice-interview.md` is the grounding source for the voice; the `maisie` subagent writes in it.

**Two rules on truthfulness, which override tone:**

1. **Don't invent what happened on the trip.** Factual/historical copy about a place is fine to write. Specific family moments, quotes and reactions are the family's to supply — leave them out and log them in a `docs/*-moments.md` checklist instead. Nothing half-written ships: omit the field rather than stubbing it with placeholder text.
2. **Describe only what's actually in the photo.** Check the image before writing its caption. Several Xi'an files were originally misnamed, and captions written from the filename rather than the picture were wrong.

**Sourced (non-family) photos** must not mention any family member and must stay factual. Currently: `bell-tower-day.jpg` (Wang Zhongyin, CC BY-SA 4.0), `muslim-quarter-great-mosque-sign.jpg` (Qianeal, CC BY-SA 4.0), `muslim-quarter-xiyangshi-arch.jpg` (thierrytutin, CC BY 2.0). All three are Xi'an; the Great Wall trip is entirely family photos.

**Privacy.** Curation must also drop anything that isn't a photograph of a place — the raw Great Wall set included a phone screenshot of the entry ticket showing a name and partial passport digits, which was excluded rather than resized. Check for screenshots, tickets and boarding passes before publishing a batch.
