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

It asserts the structural invariants a wide edit can silently break: the data
files still evaluate and their cross-references resolve, `site.js` parses, all
five pages agree on nav/fonts/scripts and load the data files in the right order,
both copies of the photo modal are identical, the CSS defines every token the
stylesheet needs, and `story.html` carries the ids the facts popout queries. It is
not a test suite — everything visual still needs a browser.

## Architecture

**Pages** (`index.html`, `story.html`, `family.html`, `map.html`, `gallery.html`)
are near-identical shells: same `<head>`, same `.site-nav` markup, same script
includes at the end of `<body>`. They differ only in `<main>` and which optional
containers they carry (`#historyIntro`, `#familyGrid`, `#pinLayer`/`#detailPanel`,
`#galleryGrid`, `#modalOverlay`, `#factsGrid`/`#factOverlay`). Copy an existing
page as the template for a new one.

**Trips.** One set of pages, made trip-aware by `?trip=<id>`; no param falls back
to `TRIPS[0]`. Currently the Forbidden City (Beijing), Xi'an, and the Great Wall
at Mutianyu.

### The data layer

Split across `assets/data/<trip-id>.js` plus the assembler `assets/data.js`,
loaded in that order by every page. Each trip file declares one object:

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
- **`FACTS`** — keyed by trip id, ten `{stat, label, text}` each. `stat` is the
  headline number (keep it short — under ~9 characters), `text` is 2–3 sentences
  of Maisie with `<strong>` on the key figure. **These must be factually true** —
  that is the entire point of the section. Hedge reported figures with
  "reportedly".
- **`FAMILY[]`** — `id`, `name`, `role`, `file`, `emoji`, `bio`.
  ⚠️ **`file` already includes its trip folder** (`"forbidden-city/mum.jpg"`)
  because a portrait lives in the folder of the trip it was taken on. `site.js`
  uses it verbatim as `` `Photographs/${person.file}` `` — never prepend a
  trip directory.

### `assets/site.js`

Vanilla JS, structured as independent IIFEs — one per feature, each guarding on
`document.getElementById(...)` so a page only wires up what it has. Module-scope
constants resolve first: `CURRENT_TRIP` (from `?trip=`, default `TRIPS[0]`),
`TRIP_LOCATIONS`, `FAMILY_PHOTO_DIR` (pinned to `"forbidden-city"`), and
`photoSrc(photo)` — which builds a src from the photo's **own** `trip`, not the
current one, so a photo always points at the right folder. `data-trip` is set on
`<html>` so CSS can tune per-trip.

The features with gotchas worth knowing before touching them:

- ⚠️ **Every internal link is rewritten to carry `?trip=`**, not just the nav —
  the "what to look at next" cards point at bare page names and would silently
  drop the reader onto `TRIPS[0]` (a real bug once: the Great Wall gallery's "See
  them on the map" opened the Forbidden City map). The rewrite **skips any href
  already containing `trip=`**, which is the only thing stopping the home-page
  chooser cards all pointing at the same trip — don't remove that check. The hash
  is split off *before* the query, or `story.html#facts` becomes
  `story.html#facts?trip=…`.
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
- **Facts** render from `FACTS[CURRENT_TRIP.id]` into `#factsGrid` (`story.html`).
  Tiles are teasers — index, `stat`, `label`, a hint — and deliberately do **not**
  render `text`; clicking one opens `#factOverlay`, a `role="dialog"` popout with
  the fact in quotes and Maisie's medallion (`assets/maisie-avatar.jpg`, one photo
  shared by all three trips because the Xi'an folder has none of her). ←/→
  buttons, dots and the arrow keys step through all ten and wrap at either end;
  Escape, ✕ or a backdrop click closes and returns focus to the tile. Tab is
  trapped inside the dialog. Tiles and the popout cycle four enamel colours via a
  `data-enamel` attribute. `#facts` is `hidden` in the markup and only unhidden
  when the current trip actually has facts, so a trip without them doesn't leave a
  bare heading; the same guard reveals the `#factsJump` button in the hero.
- ⚠️ The facts **count-up needs its own `matchMedia` guard** — it changes
  `textContent`, which the stylesheet's `prefers-reduced-motion` blanket cannot
  suppress. It also only groups thousands if the written `stat` does, so the year
  stats (`1974`, `1368`) don't animate as `1,974` and then snap.
- **Attribution** for sourced photos renders twice: `creditBadge()` puts plain
  text inside the thumb (plain text because a thumb is a `<button>` and a nested
  `<a>` is invalid), and `#modalCredit` carries the full line with the licence
  linked. `#modalCredit` stays `hidden` for family photos so there's no stray
  divider.
- Also: nav toggle + current-page highlight, `?loc=` deep links validated against
  the current trip, scroll-reveal, the home hero image rotation and the hero
  subtitle counted from `TRIPS`, the trip chooser, and the gallery location filter.

### `assets/styles.css`

One shared stylesheet for all five pages, built on `:root` custom properties — a
cloisonné (景泰蓝) enamel palette: deep teal grounds (`--enamel-deep/-mid/-teal*`),
a gold wire hairline (`--wire`), and gold (`--gold`), coral (`--coral`) and jade
(`--jade`) enamel fields, with `--mint` and `--cream` for type on dark. Three
Latin families — `--font-display` (Fraunces 900), `--font-ui` (Outfit),
`--font-body` (Nunito) — plus `--font-hanzi` (Noto Serif SC), which every hanzi
element names explicitly because the Latin faces carry no CJK.

Every raised surface shares one **enamel plate** recipe in the ORNAMENT
PRIMITIVES section: a gradient field, a 1.5px gold wire, a dark setting ring, a
glaze highlight and a `--lattice` overlay on a `::before`.

- ⚠️ That overlay is absolutely positioned, so **direct children of a plate need
  `position:relative`** or they paint underneath it. One grouped rule does this
  for every plate class — extend it when you add a new one.
- ⚠️ **The map's cream mat is drawn with `box-shadow` spread, not padding.**
  `#pinLayer` positions pins as percentages of `.map-inner`, so padding there
  shifts every pin off its landmark.
- ⚠️ **`--coral` and `--jade` are not text grounds.** A 158deg gradient puts its
  lightest stop exactly under the first line of text, and both miss WCAG AA
  there. Surfaces that carry prose use the darker `--coral-field*` /
  `--coral-plate` / `--jade-field*` variants instead; pins, close buttons, play
  badges and the seal keep the bright fields because they carry a glyph, not
  prose. Measure before introducing a new pairing.

`--cloud-scroll` is the page and hero ground pattern. The scroll panel is
deliberately the one light surface left, because it is the only block with
enough continuous prose to punish light-on-dark. Component styles are grouped by
page/feature under comment headers — site nav, hero, nav cards, scroll panel,
family cards, map, location popout, photo thumbs, gallery, modal, facts —
followed by a single mobile media query block at the end covering all of them.

The re-skin's design spec and implementation plan are kept for reference at
`docs/superpowers/specs/2026-08-09-cloisonne-reskin-design.md` and
`docs/superpowers/plans/2026-08-09-cloisonne-reskin.md`.

## Adding content

- **New photo** — drop it into `Photographs/<photoDir>/`, add an entry to that
  trip's `photos` array in `assets/data/<trip>.js`, with a `location` matching a
  `LOCATIONS.id` on the same trip. Web-size it first: existing photos are ~1400px
  on the long edge and 60–250 KB, not raw camera dumps.
- **New video** — same, but re-encode to **H.264** first (phone video is usually
  HEVC, which most browsers won't play) and add `type:"video"`. No LFS in this
  repo, so keep it small: `chairlift-ride-up.mp4` went 204 MB → 17 MB with
  `-vf scale=960:-2 -c:v libx264 -preset slow -crf 30 -c:a aac -b:a 80k -movflags +faststart`.
- **New map location** — add to that trip's `locations` array with `x`/`y` read
  off its plan image as percentages, plus `story` copy. `william` is optional —
  omit it rather than stubbing it.
- **New trip** — create `assets/data/<id>.js` on the pattern of the existing
  three, add it to `TRIP_MODULES` in `assets/data.js`, add a `<script>` tag to all
  five pages, create `Photographs/<photoDir>/`, and add a plan image to `assets/`.
  `check.mjs` catches a missed script tag.
- **Family portraits** — place in `Photographs/forbidden-city/` and reference via
  `file` in `FAMILY`; picked up automatically on every trip.

Source material, not wired into the site: `Guide/guide.txt` (raw exported chat
notes with photo-by-photo historical detail); `docs/xian-moments.md` and
`docs/great-wall-moments.md` (family anecdotes and William quotes still missing —
the Great Wall one flags which people were identified by outfit-matching rather
than confirmed, so check it before trusting a name in a caption);
`docs/great-wall-curation.md` (which 27 of 82 raw files were kept, and why).

## Content voice

All copy — trip intros, `story`/`william`, photo `caption`/`detail` — is Maisie's
first-person, wry-11-year-old voice, with recurring bits (Mum as "Queen of China,"
William's deadpan one-liners, Dad's obsessive photo-taking). Match it rather than
reverting to neutral museum-guide text. `docs/maisie-voice-interview.md` is the
grounding source; the `maisie` subagent writes in it.

**Two rules on truthfulness, which override tone:**

1. **Don't invent what happened on the trip.** Factual/historical copy about a
   place is fine to write. Specific family moments, quotes and reactions are the
   family's to supply — leave them out and log them in a `docs/*-moments.md`
   checklist instead. Nothing half-written ships: omit the field rather than
   stubbing it.
2. **Describe only what's actually in the photo.** Open the image before writing
   its caption. Several Xi'an files were misnamed, and captions written from the
   filename rather than the picture were wrong.

**Sourced (non-family) photos** must not mention any family member and must stay
factual. Currently three, all Xi'an: `bell-tower-day.jpg` (Wang Zhongyin, CC
BY-SA 4.0), `muslim-quarter-great-mosque-sign.jpg` (Qianeal, CC BY-SA 4.0),
`muslim-quarter-xiyangshi-arch.jpg` (thierrytutin, CC BY 2.0). The Great Wall trip
is entirely family photos. Each carries a `credit` object so the attribution
renders on the page — **a new sourced photo needs one; listing it here is not
sufficient.** The `credit` objects still have no `source` URL: the originals' URLs
were never recorded, so full TASL attribution remains incomplete.

**Privacy.** Curation must drop anything that isn't a photograph of a place — the
raw Great Wall set included a phone screenshot of the entry ticket showing a name
and partial passport digits, excluded rather than resized. Check for screenshots,
tickets and boarding passes before publishing a batch.
