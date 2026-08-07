# Adding the Terracotta Warriors trip — implementation plan

Approved plan, not yet implemented. Nothing in this document has been built
yet; the repo is still single-trip at the time of writing.

Starting point: commit `8427f38` (site version 1.1.0) on branch
`claude/init-mzblxr`.

---

# Context

The site currently covers one trip (the Forbidden City). The user wants to add a second — the Terracotta Warriors in Xi'an — in the same format, as its own section.

Nothing in the data model knows about trips. `LOCATIONS` and `PHOTOS` are flat arrays, `map.html` hardcodes the Forbidden City floor plan and its credit line, and `HISTORY_INTRO` is a single Forbidden-City-specific string. So this needs a genuine trip dimension rather than more entries.

Decisions made by the user:
- **Photos**: they'll add the image files to the repo themselves.
- **Structure**: one shared set of pages, made trip-aware via a `?trip=` link. No duplicated HTML; a third trip later is pure data.
- **Copy**: I write the factual/historical content; the family moments come from them.
- **Map**: yes, the Terracotta section gets the clickable pin map too.

Two constraints worth stating up front, because they shape the plan:

1. **Nothing half-written gets published.** The factual copy ships complete. Family anecdotes are *omitted*, not stubbed with placeholder text — they're collected in a checklist doc instead, so the live site never shows `[TODO]` to visitors.
2. **I won't invent what happened on their trip.** Every family moment, quote and reaction is theirs to supply.

# Plan

## 1. Data model — `assets/data.js`

Add a `TRIPS` array as the new top-level concept:

```js
const TRIPS = [
  { id:"forbidden-city", name:"The Forbidden City", chinese:"紫禁城", city:"Beijing",
    blurb:"…", map:"forbidden-city-map.png",
    mapAlt:"Schematic plan of the Forbidden City",
    mapCredit:"Base plan: labeled Forbidden City floor plan by Tommy Chen, Wikimedia Commons (CC BY-SA 3.0 / GFDL) — my pins and commentary are extra.",
    intro: HISTORY_INTRO },
  { id:"terracotta", name:"The Terracotta Warriors", chinese:"兵马俑", city:"Xi'an",
    blurb:"…", map:"terracotta-map.svg",
    mapAlt:"Schematic plan of the Terracotta Army site",
    mapCredit:"Site plan drawn for this page — not to scale.",
    intro: TERRACOTTA_INTRO }
];
```

Tag `LOCATIONS` and `PHOTOS` by trip without hand-editing 56 existing entries, using a small helper so the tag is declared once per group:

```js
const ofTrip = (trip, items) => items.map(o => ({ ...o, trip }));

const LOCATIONS = [
  ...ofTrip("forbidden-city", [ /* the existing 12, unchanged */ ]),
  ...ofTrip("terracotta",     [ /* the new ones */ ])
];
```

Same pattern for `PHOTOS`. The arrays stay flat, so `site.js`'s existing `.filter`/`.find`/`.indexOf` calls keep working.

`FAMILY` and `EMPTY_STATE_LINES` stay trip-agnostic — same family, same jokes.

**Proposed Terracotta locations** (confirm against their photos): Pit 1, Pit 2, Pit 3, the Bronze Chariots hall, and the burial mound. Each gets `story` written from researched history; the `william` field is simply omitted until they supply it.

## 2. Trip resolution and navigation — `assets/site.js`

Resolve the current trip once, near the top:

```js
const CURRENT_TRIP = (function(){
  if(typeof TRIPS === "undefined") return null;
  const id = new URLSearchParams(location.search).get("trip");
  return TRIPS.find(t => t.id === id) || TRIPS[0];
})();
```

**Defaulting to `TRIPS[0]` is deliberate**: a URL with no `?trip=` still shows the Forbidden City, so every existing link and the already-deployed Pages site keep working unchanged.

Then:
- **Carry the trip through the nav.** Rewrite `.nav-links a[href]` to append `?trip=<id>`, so you stay inside a trip while browsing. Same for the home page's cards.
- **Fix the current-page highlight.** It currently does `a.getAttribute("href") === here`, which breaks the moment hrefs carry a query string. Compare the href's pathname instead.
- **Guard the William box.** `renderPanel()` renders the box whenever the toggle is checked; add a truthiness check on `loc.william` so Terracotta locations don't render an empty box before their quotes exist.
- **Filter by trip** in the map pins, the gallery grid, and the gallery's location filter buttons.
- **Validate `?loc=`** against the current trip, so `?trip=terracotta&loc=meridian-gate` can't half-open a mismatched popout. The two params coexist.
- **Swap the map image and credit** from `CURRENT_TRIP`.
- **Render the home page trip chooser** from `TRIPS`.

## 3. Markup — minimal, additive

- `map.html`: give the `<img>` and the `.map-legend` `id`s so JS can swap `src`/`alt`/credit per trip.
- `index.html`: give the `.nav-cards` container an `id` so the trip chooser can render into it. Home becomes: a card per trip, plus Meet the Expedition.
- `story.html`, `family.html`, `gallery.html`: no markup changes.

Each trip page shows its trip name in the hero so you always know which section you're in; home is where you switch.

## 4. The Terracotta map — draw it, don't source it

Create `assets/terracotta-map.svg` as a hand-drawn schematic (three pit halls, the bronze chariots exhibition hall, the mound, entrance) styled to match the site's palette.

This is better than sourcing a third-party plan: no licensing risk, no new binary asset, it scales cleanly, it matches the refined aesthetic, and I control the pin percentages exactly. It drops into the existing `<img src>` + percentage-pin mechanism unchanged. The real site genuinely is a few big halls, so a clean schematic reads as intentional rather than sparse.

## 5. Photos — the section works before they arrive

The user adds files to `Photographs/`. Until then the Terracotta section is fully functional: `EMPTY_STATE_LINES` already renders a friendly message for any location with no photos, so nothing looks broken.

Deliver `docs/terracotta-photos.md` explaining exactly where to put files and the naming convention, so the follow-up pass is just writing `PHOTOS` entries.

## 6. Two supporting docs

- `docs/terracotta-moments.md` — the fill-in checklist: per location, what family moment is missing, plus prompts for William's one-liners and Mum's Queen-of-China bits. This is where the anecdotes live until they're written.
- `CLAUDE.md` — update the architecture section. It currently documents `LOCATIONS`/`PHOTOS` as flat arrays and gives "adding content" instructions that are about to be wrong; it needs the `TRIPS` concept and the `?trip=` convention.

Bump `SITE_VERSION` to `1.2.0` — this is a feature addition.

# Verification

No test suite or build; verify in a browser against `python3 -m http.server`.

1. **No regression on the existing trip.** Load all five pages with no `?trip=` — identical to now: 12 pins, 44 photos, correct map and credit.
2. **The new section works.** `?trip=terracotta` on story/map/gallery shows the Terracotta intro, its own pins over the new SVG plan, its own credit line, and its own (initially empty) gallery with the friendly empty-state message.
3. **Trip stays sticky.** Starting from a Terracotta page, every nav link keeps you in the Terracotta section; the current-page highlight still marks the right link.
4. **Deep links.** `?trip=terracotta&loc=pit-1` opens that popout; a mismatched `trip`/`loc` pair degrades gracefully instead of half-opening.
5. **No empty William boxes** on Terracotta locations.
6. **Home** lists both trips and routes into each correctly.
7. Sweep both trips at 1280px and 375px: no JS errors, no horizontal overflow, version stamp present.
