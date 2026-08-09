# CLAUDE.md

Guidance for Claude Code working in this repository.

**Start a fresh session by reading the newest `docs/HANDOFF-*.md`, then this
file.** The handoff is timestamped in its filename, rewritten at the end of every
session, and is authoritative on what's done and what's next. This file describes
how the site is built and is meant to stay true indefinitely.

## What this is

**"China 2026"** — a static, no-build, multi-page HTML/CSS/JS family travel
journal covering 2026 trips across China, narrated in character by "Maisie," an
11-year-old. No `package.json`, no bundler, no server-side code.

**No single trip is the theme.** It began as a Forbidden City album and was
rebranded once it covered more than one destination. The Forbidden City is first
in `TRIPS` only because a URL with no `?trip=` falls back to `TRIPS[0]` — a
compatibility default, not top billing. Don't reintroduce Forbidden City branding
into the shared nav, titles or home hero.

## Where it lives

- **Site:** `https://pbranfield-lab.github.io/china-2026/` — GitHub Pages from
  `master` at the repo root. Pushing to `master` publishes.
- **Repo:** `https://github.com/pbranfield-lab/china-2026`

⚠️ Renamed from `forbidden-city-maisie` (2026-08-09). A separate public repo still
holds that old name with nothing but a redirect stub, because renaming a repo does
**not** redirect its Pages URL. **Pushing to the old remote URL publishes to the
stub and silently does nothing here — check `git remote -v` says `china-2026`.**

## Running and checking it

No build or dev-server command. Preview by opening the HTML directly, or:

```bash
python3 -m http.server 8000
```

No lint or build. One check script:

```bash
node tools/check.mjs
```

It asserts the structural invariants a wide edit can silently break (~24
checks): the data files still evaluate and their cross-references resolve,
`site.js` parses, all seven pages agree on nav/fonts/scripts and load the data
files in the right order, exactly two pages carry the (identical) photo modal,
the CSS defines every token the stylesheet needs, the feature sections carry
their ids, and every extras.js structure resolves — journey legs chain,
timeline eras are contiguous, audio/historic files exist with full credits,
hanzi have stroke-data files, comparators stay declarative, and each page has
exactly one hidden cat. It is not a test suite — everything visual still needs
a browser.

A second, advisory script — `node tools/orphans.mjs` — lists media files in
`Photographs/` and `assets/` that nothing references (data layer, hard-coded
page markup, and CSS all count as references). Everything tracked is published
by GitHub Pages, so an orphan should be a deliberate decision, not drift.

## Architecture

**Pages** (`index.html`, `story.html`, `family.html`, `map.html`,
`gallery.html`, `journey.html`, `play.html`) are near-identical shells: same
`<head>`, same `.site-nav` markup, same script includes at the end of `<body>`
(play.html adds the vendored hanzi-writer between `data.js` and `site.js`).
They differ only in `<main>` and which optional containers they carry
(`#historyIntro`, `#familyGrid`, `#pinLayer`/`#detailPanel`, `#galleryGrid`,
`#modalOverlay`, `#factsGrid`/`#factOverlay`, `#quiz`/`#quizCard`,
`#teaser`/`#teaserCard`, `#scale`, `#thenNow`, `#journeyStage`,
`#timelineRibbon`, `#hanziGrid`, `#spotCard`, `#passportBook`, `#catBonus`,
`#playCredits`). Copy an existing page as the template for a new one — a new
page must also join check.mjs's `PAGES`, the link-rewrite whitelist in site.js,
orphans.mjs's CODE list, and the nav on **every** page (check 7 enforces
byte-identity). ⚠️ Only map.html and gallery.html may carry `#modalOverlay` —
check 8 hard-asserts exactly two.

**Trips.** One set of trip pages, made trip-aware by `?trip=<id>`; no param
falls back to `TRIPS[0]`. Currently the Forbidden City (Beijing), Xi'an, the
Great Wall at Mutianyu, Xitang Water Town (⚠️ its `photoDir` is `"xitan"` — the
folder's spelling, not the town's), and Shanghai. `journey.html` and
`play.html` are trip-agnostic like family.html (no `#heroSeal`, visible in the
index nav). **The real itinerary order** — Shanghai base first with Xitang as
a day trip, then three nights in Xi'an (Terracotta Warriors day trip), then
Beijing as base (Forbidden City in the city, Mutianyu day trip) — is encoded
in `JOURNEY` and narrated on the journey page; don't contradict it in copy.
`TRIP_MODULES` order is a compatibility default, not chronology.

### The data layer

Split across `assets/data/<trip-id>.js`, the cross-trip file
`assets/data/extras.js`, and the assembler `assets/data.js`, loaded in that
order by every page. The trip files are large (30–46 KB each) — to edit one
entry, Grep for its id and read a window around it rather than reading the
whole file. Each trip file declares one object:

```js
const TRIP_XIAN = { trip: {...}, facts: [...], locations: [...], photos: [...] };
```

`assets/data.js` holds `SITE_VERSION`, `ofTrip()`, `FAMILY`, `EMPTY_STATE_LINES`,
and stitches `TRIP_MODULES` into the flat globals `TRIPS`, `LOCATIONS`, `PHOTOS`,
`FACTS`. ⚠️ **`TRIP_MODULES` order is load-bearing twice:** it fixes `TRIPS[0]`
(the no-param fallback), and it fixes the flattened `PHOTOS` order that the map
popout indexes into positionally.

Field notes, per global:

- **`TRIPS[]`** — `id` (used in `?trip=`), `name`, `chinese`, `city`, `icon`,
  `blurb`, `map`, `mapAlt`, `mapCredit`, `photoDir`, `hero`, `intro`.
  `photoDir` is deliberately separate from `id` so URLs stay short while folders
  stay descriptive (`id:"xian"` → `photoDir:"terracotta-warriors"`).
  ⚠️ **`map` resolves under `assets/`, but `hero` is a full page-relative path** —
  different kinds of value. `hero` wants a wide/panoramic image: it sits behind a
  dark scrim in a short full-width band, so portraits crop badly.
- **`LOCATIONS[]`** — `id`, `trip`, `num`, `x`/`y` as percentages over that trip's
  plan image, `name`, `chinese`, `story` HTML, **optional** `william` quote.
  `num` restarts at 1 per trip. Drives the map pins.
- **`PHOTOS[]`** — `id`, `trip`, `location` (must match a `LOCATIONS.id` on the
  same trip), `file`, `caption`, `detail` HTML, **optional** `type:"video"`,
  **optional** `credit:{author, license, licenseUrl}`. Backs both the map popout
  grid and the gallery. Video is flagged by the explicit `type` field, never by
  sniffing the extension.
- **`FACTS`** — keyed by trip id, ten `{stat, label, text}` each, plus an
  optional `q`: a plain-English quiz question ("How many rooms has the
  Forbidden City got?") that The Big Quiz shows instead of the cryptic
  label-based fallback — give one to every fact whose stat is a single
  leading number. `stat` is the headline number (keep it short — under ~9
  characters), `text` is 2–3 sentences
  of Maisie with `<strong>` on the key figure. **These must be factually true** —
  that is the entire point of the section. Hedge reported figures with
  "reportedly".
- **`FAMILY[]`** — `id`, `name`, `role`, `file`, `emoji`, `bio`.
  ⚠️ **`file` already includes its trip folder** (`"forbidden-city/mum.jpg"`)
  because a portrait lives in the folder of the trip it was taken on. `site.js`
  uses it verbatim as `` `Photographs/${person.file}` `` — never prepend a
  trip directory.
- **`assets/data/extras.js`** carries the interactive features' cross-trip
  data, all declarative (check.mjs evaluates it — no functions): `JOURNEY`
  (route stops + legs; `day:true` legs return to their base city, and the leg
  chain is checked), `TIMELINE` (contiguous eras + events with the Britain
  lines), `HANZI` (each char needs a stroke file at
  `assets/vendor/hanzi-data/<codepoint-hex>.js`), `COMPARATORS` (unitValues
  mirror numbers already in FACTS — one copy of the truth), `THEN_NOW`
  (historic `then.file` under `Photographs/historic/` with a full credit
  object; `now` is a PHOTOS **id**), `AUDIO` (per-trip loops + credits), and
  `CATS`/`CAT_BONUS` (one cat per page; bonus facts verified and hedged).

### `assets/site.js`

Vanilla JS, structured as independent IIFEs — one per feature, each guarding on
`document.getElementById(...)` so a page only wires up what it has. Module-scope
constants resolve first: `CURRENT_TRIP` (from `?trip=`, default `TRIPS[0]`),
`TRIP_LOCATIONS`, `photoSrc(photo)` — which builds a src from the photo's
**own** `trip`, not the current one, so a photo always points at the right
folder — plus three v4 foundations: `REDUCED_MOTION` (JS-driven animation
must check it; the CSS blanket can't reach `textContent`/dash-offset changes),
`store` (the **only** localStorage surface: one namespaced JSON blob under
`china2026:v1` with keys `sound, visited, quizBest, spotBest, cats, hanzi,
inputs`, every access try/caught so private browsing degrades silently), and
`SoundKit` (ambient loop per trip, WebAudio feedback chirps, zh-CN
`speak()`/`hasZhVoice()`; audio only ever starts inside a user gesture).
`data-trip` is set on `<html>` so CSS can tune per-trip.

The features with gotchas worth knowing before touching them:

- **Contextual nav.** The header markup is identical on every page
  (check.mjs asserts it); site.js adapts it at load. On `index.html` the
  trip-scoped links (story/facts/map/gallery) are hidden — the home page is the
  trip chooser, and those links would silently land on `TRIPS[0]` before a trip
  was chosen; the trip-agnostic Journey/Family/Play links stay. On every other
  page a `.nav-trip` chip is injected after the brand, naming the current trip
  and linking back to the chooser.
- **The Big Quiz** (`story.html#quiz`) is built from the same `FACTS` as the
  tiles — there is no separate quiz data to drift out of truth. Only facts
  whose `stat` is one leading number qualify ("east", "rice" and ranges like
  "7–8 m" sit out); decoys are scaled — or shifted, for years — and formatted
  to match the real stat's commas/decimals/suffix so the shape never gives the
  answer away. The section stays `hidden` unless the trip has ≥4 quizzable
  facts. A chooser fronts it: solo (5 questions) or pass-the-phone 2-player
  (6, alternating, per-player stars, winner card). Best scores feed the
  passport, and `finish()` can draw a 640px share sticker onto a canvas —
  **vectors/text/emoji only, never photos**, so the canvas stays untainted.
- **The home teaser** (`#teaser`) shows one random fact from any trip with a
  reshuffle button; its "plus the quiz" link names the fact's own trip
  explicitly, which is what stops the link-rewrite pass re-pointing it at
  `TRIPS[0]`. Trip chooser cards carry computed `.card-counts` cover lines, so
  counts never go stale.

- ⚠️ **Every internal link is rewritten to carry `?trip=`**, not just the nav —
  the "what to look at next" cards point at bare page names and would silently
  drop the reader onto `TRIPS[0]` (a real bug once: the Great Wall gallery's "See
  them on the map" opened the Forbidden City map). The rewrite **skips any href
  already containing `trip=`**, which is the only thing stopping the home-page
  chooser cards all pointing at the same trip — don't remove that check. The hash
  is split off *before* the query, or `story.html#facts` becomes
  `story.html#facts?trip=…`. Two corollaries: the whitelist regex names all
  seven pages (a new page must join it), and the rewrite **discards any other
  query params** — so no feature may introduce its own; deep links use `#hash`
  only. Links injected by JS after load must carry their own `?trip=` — the
  pass has already run.
- ⚠️ **`PHOTOS.indexOf(p)` / `PHOTOS[i]` in the map popout is positional** — its
  thumbnails index into the flat global `PHOTOS`. Don't point that render path at
  a filtered copy. The gallery is safe to filter because it looks photos up by
  `id`.
- ⚠️ **Both `map.html` and `gallery.html` carry their own copy of the modal
  markup** — change one, change the other. `check.mjs` enforces it.
- ⚠️ Closing the photo modal calls `unloadVideo()`, which **drops the `src`
  entirely** rather than pausing. A paused video that keeps its `src` carries on
  buffering and bleeds audio behind the closed overlay.
- ⚠️ Landing on `story.html#facts` re-asserts scroll position every frame for
  ~1.2 s, releasing on `wheel`/`keydown`/`pointerdown`/`touchstart`. That looks
  excessive but isn't: the section is revealed by script (so the browser's own
  fragment handling finds nothing at first paint) and the CJK webfonts land after
  load and reflow the intro by hundreds of pixels. `pointerdown` is in the release
  list because a scrollbar drag fires none of the others.
- **Facts** render from `FACTS[CURRENT_TRIP.id]` into `#factsGrid`. Tiles are
  teasers — index, `stat`, `label`, a hint — and deliberately do **not** render
  `text`; clicking one opens `#factOverlay`, a `role="dialog"` popout with the
  fact in quotes and Maisie's medallion (`assets/maisie-avatar.jpg`, one photo
  shared by all three trips because the Xi'an folder has none of her). ←/→
  buttons, dots and the arrow keys step through all ten and wrap at either end;
  Escape, ✕ or a backdrop click closes and returns focus to the tile. Tab is
  trapped inside the dialog. Stats count up once on scroll-into-view, guarded by
  its own `matchMedia` check because a `textContent` change is not something the
  stylesheet's `prefers-reduced-motion` blanket can suppress — and the count
  inherits thousands-grouping from the stat string, or a year counts as "1,974".
  Tiles and the popout cycle four enamel colours via a `data-enamel` attribute.
  `#facts` is `hidden` in the markup and only unhidden when the current trip
  actually has facts, so a trip without them doesn't leave a bare heading; the
  same guard reveals the `#factsJump` button in the hero.
- **Attribution** for sourced photos renders twice: `creditBadge()` puts plain
  text inside the thumb (plain text because a thumb is a `<button>` and a nested
  `<a>` is invalid), and `#modalCredit` carries the full line with the licence
  linked. `#modalCredit` stays `hidden` for family photos so there's no stray
  divider.
- **The v4 features**, briefly (each its own IIFE, each hiding its section
  when its data is empty): the **Journey** scroll-draw (measures route path
  lengths at runtime, drives `stroke-dashoffset` from an IntersectionObserver;
  reduced motion renders everything drawn), the **timeline** ribbon (events
  render *inside* their era blocks so nothing overlaps), **Then & Now** (an
  invisible full-frame range input drives the clip-path divider — keyboard and
  touch for free; credits render under every frame, including public domain),
  the **hanzi playground** (data loads by injected `<script>`, not fetch, so
  file:// works; speak button hidden without a zh voice), **Spot-It** (pool is
  `!p.credit && p.type !== "video"` — family photos only, so no in-game
  attribution), the **Scale-o-matic** (ops live in JS, data stays
  declarative), the **passport** (trip-scoped pages stamp `visited`; play.html
  renders the book), and the **cats** (one per page from `CATS`; all found
  unlocks `#catBonus` and the print-only certificate — `@media print` shows
  only `.cert-print`).
- Also: nav toggle + current-page highlight, `?loc=` deep links validated against
  the current trip, scroll-reveal, the home hero image rotation and the hero
  subtitle counted from `TRIPS`, the trip chooser, the gallery location filter,
  the injected sound toggle (bottom-right; stamp owns bottom-left) and the
  play-page credits panel (audio + vendored-library attribution).

### `assets/styles.css`

One shared stylesheet for all pages, built on `:root` custom properties — the
**"Maisie's zine" print palette**: bright warm rice paper (`--paper`, with
`--cream` as the card/sticker fill), warm ink (`--ink`/`--ink-soft`) for type
and outlines, and four accent inks cycled through the components — vermilion
(`--red*`), gold (`--gold*`), jade (`--jade*`) and porcelain blue (`--blue*`).
The register is lianhuanhua (连环画) comic print / tween magazine, chosen
deliberately for the 11–14 audience: bright but not childish, everything
outlined and scannable. Three Latin families — `--font-display` (Lilita One,
single 400 weight, chunky), `--font-ui` (Outfit), `--font-body` (Nunito) — plus
`--font-hanzi` (Noto Serif SC), which every hanzi element names explicitly
because the Latin faces carry no CJK.

Every raised surface shares one **sticker panel** recipe in the ORNAMENT
PRIMITIVES section: a cream card with faint paper grain, a 2.5px warm-ink
outline and a **hard offset shadow** (`--pop`/`--pop-big` — solid print
shadows, never soft blurs). Cards rest at a slight `nth-child` tilt and
straighten on hover. The grouped `position:relative` rule for panel children
is kept as a stacking hook — extend it when adding a new panel class.
`--cloud-scroll` is the page ground pattern; `--tape` is the washi-tape strip
on photo thumbs (polaroid treatment). Fact tiles stay cream and cycle their
`data-enamel` value ("teal"/"coral"/"jade"/"deep" — the JS contract) into
border/stat/chip colours, so text is always ink-on-cream and passes AA — the
v2 contrast problem no longer exists. Component styles are grouped by
page/feature under comment headers — site nav, hero, nav cards, scroll panel,
family cards, map, location popout, photo thumbs, gallery, modal, facts,
teaser, quiz, journey, timeline, then & now, hanzi, spot-it, scale-o-matic,
passport, cats/toast/certificate, sound toggle — followed by a single mobile
media query block at the end covering all of them. New feature CSS goes in its
own commented section **before** the mobile block, with its mobile rules
**inside** that block; SVG `#` colours in CSS data-URIs must be `%23` (inline
DOM SVG is exempt).

⚠️ **The map's mat is drawn with `box-shadow` spread, not padding:**
`#pinLayer` positions pins as percentages of `.map-inner`, so any padding there
shifts every pin off its landmark. (The mobile block overrides that same
box-shadow smaller — keep the technique if editing either.)

The zine re-skin shipped at `SITE_VERSION` 3.0.0, replacing the dark cloisonné
skin (v2.0.0), whose design docs remain at
`docs/archive/2026-08-09-cloisonne-reskin-design.md` and
`docs/archive/2026-08-09-cloisonne-reskin.md`.

## Adding content or writing copy

**Read `docs/authoring.md` first.** It covers adding a photo, video, location or
whole trip, the source-material files, Maisie's voice, and the attribution and
privacy rules. Three things from it are absolute and repeated here so they can't
be missed by a session that skipped the file:

1. **Don't invent what happened on the trip.** Factual/historical copy about a
   place is fine to write. Specific family moments, quotes and reactions are the
   family's to supply — omit the field and log it in a `docs/*-moments.md`
   checklist instead. Nothing half-written ships.
2. **Describe only what's actually in the photo.** Open the image before writing
   its caption. Several Xi'an files were misnamed, and captions written from the
   filename rather than the picture were wrong.
3. **A sourced (non-family) photo needs a `credit` object** in its `photos` entry
   — CC BY / BY-SA require the attribution to be visible wherever the work is
   shown, so naming it in a doc is not enough. Sourced photos must not mention any
   family member. Curation drops screenshots, tickets and boarding passes.
