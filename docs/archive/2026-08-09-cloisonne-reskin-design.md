# Cloisonné re-skin — design

**Date:** 2026-08-09
**Status:** approved design, ready for implementation planning
**Scope:** visual re-skin of the whole site + one behavioural change (the facts section)

## Problem

The site works. The copy is Maisie's — wry, funny, eleven. The *look* is not: dark
lacquer, muted antique gold, serif headings, small type, everything at rest. It reads
as a well-mannered museum microsite. A reader arriving at it has no idea, before they
read a word, that this is a kid's trip of a lifetime.

The Chinese theme is not the problem and must stay. The execution is: too flat, too
muted, and the palette in particular is doing the damage.

## Direction: Cloisonné (景泰蓝)

Chinese enamelwork — jewel-coloured enamel fields divided by thin gold wires, over
a lattice ground. It gives us four things the current design lacks:

- **Saturated colour** with real historical authority — this is not "brightened up
  for kids", it is what the objects actually look like.
- **Gold linework** that outlines every surface, so the ornament is structural
  rather than a border stuck on the edge.
- **Depth** — enamel is glossy and domed; highlights and inset shadows give every
  card physical presence.
- **Pattern doing real work** — the lattice shows *through* the enamel rather than
  sitting behind the content.

Three flat/graphic directions and two other traditional ones (Dunhuang mural, peach
blossom silk) were shown and rejected before this one was chosen.

## 1. Design tokens

`styles.css` is already custom-property driven off `:root`, so retuning the tokens
cascades most of the re-skin. Replace the lacquer palette with:

| Token | Value | Role |
|---|---|---|
| `--enamel-deep` | `#062430` | page ground, darkest field |
| `--enamel-mid` | `#0A3644` | nav, panel grounds |
| `--enamel-teal` | `#1D7C86` | plate gradient, light stop |
| `--enamel-teal-2` | `#106072` | plate gradient, mid stop |
| `--enamel-teal-3` | `#0A4757` | plate gradient, dark stop |
| `--wire` | `#D9B65A` | the gold cloisonné wire — hairline outlines |
| `--gold` | `#F5C542` | headline numbers, CTAs |
| `--gold-2` | `#C9922E` | gold gradient dark stop, pressed states |
| `--coral` | `#F2604C` | hot accent, quote plates, seals |
| `--coral-2` | `#B7332A` | coral gradient dark stop |
| `--mint` | `#8FE3DE` | labels and small type on dark |
| `--cream` | `#F5EDD8` | display headings |
| `--jade` | (kept) `#4f7a63` | fourth enamel field |

Retired: `--vermillion*` (coral replaces it and sits properly against teal, where
vermillion muddies), `--lacquer*`. `--paper*`, `--ink*` are kept for the few genuinely
light surfaces.

Shadow tokens are re-tuned to the deeper ground. `--radius-panel` goes from `3px` to
a soft `14px` — enamel plates are rounded, not sharp-cut lacquer.

## 2. Typography

Three new families from Google Fonts, alongside the existing Noto SC pair:

- **Fraunces 700/900** — display: big stat numbers, page headings. Chunky and
  characterful without reading as a "kids' font".
- **Outfit 400/600/800** — UI: nav, labels, buttons, eyebrows.
- **Nunito 400/600/700** — body copy and Maisie's quotes. Warm, highly readable
  at length.
- **Noto Serif SC / Noto Sans SC** stay, used only for the hanzi — the new faces
  have no Chinese coverage and the fallback is ugly.

`--font-display` → Fraunces, `--font-body` → Nunito, and a new `--font-ui` → Outfit.
Hanzi elements (`.seal-mini`, `.seal-title`, `#heroSeal`, `.chinese`) get an explicit
Noto family so they don't fall through.

Base body size goes from the browser default 16px to **17px**, with the long-form
`.scroll-panel` copy at 18px; this is a site for an eleven-year-old and their
relatives, not a broadsheet.

## 3. The enamel surface system

One reusable recipe replaces every flat card, so the whole site reads as one material:

```
background : linear-gradient(158deg,
               var(--enamel-teal) 0%, var(--enamel-teal-2) 45%, var(--enamel-teal-3) 100%)
box-shadow : 0 0 0 1.5px var(--wire)              ← the gold wire
             0 0 0 5px rgba(6,36,48,.5)           ← dark setting around it
             0 12px 26px rgba(0,0,0,.45)          ← lift off the ground
             inset 0 1px 0 rgba(255,255,255,.32)  ← glaze highlight
             inset 0 -16px 30px rgba(0,0,0,.26)   ← domed enamel falloff
::before   : lattice SVG at .36 opacity, inset 0, pointer-events none
```

Applied to: home nav cards, the scroll panel, family cards, the map location popout,
photo thumbs, gallery tiles, the photo modal, and the new fact tiles.

**Two new ornament primitives** join the existing `--fret`, both inline SVG data URIs
in `:root` so no page markup changes (remember `#` must be encoded `%23`):

- `--lattice` (窗棂) — the window-lattice overlay used inside plates.
- `--cloud-scroll` (祥云) — auspicious-cloud line pattern for page and hero grounds.

The existing `--fret`/`--fret-v` key-fret trim survives with its stroke colour
re-pointed at `--wire`. The corner-bracket and seal-stamp primitives survive; the seal
gradient moves from vermillion to coral.

## 4. Per-page application

Nothing structural changes. Each block is restyled in place:

- **Site nav** — enamel bar on `--enamel-mid`, gold wire underline, `--fret` trim kept.
  Active link gets a gold enamel pill rather than an underline.
- **Hero** — cloud-scroll ground under a radial teal glow. Heading in Fraunces 900,
  cream, with a soft teal bloom. `#factsJump` becomes a gold enamel button.
- **Home nav cards & trip chooser** — enamel plates with the hover lift/tilt.
- **Scroll panel** (the signature element) — keeps its shape; the paper ground gives
  way to a warm cream enamel field inside a gold wire frame, so long-form reading
  stays dark-on-light.
- **Family cards** — seal-stamp treatment retained, recoloured to coral; portraits
  get the gold ring.
- **Map** — plan images now sit on deep teal. Pins become small enamel discs with
  gold wire. **Risk: the plan images are pale — needs a browser check that they
  don't glare against the dark ground.** If they do, the map case gets a cream mat.
- **Location popout / photo thumbs / gallery** — enamel plates and wire outlines.
- **Photo modal** — enamel frame. **Both copies of the modal markup (`map.html` and
  `gallery.html`) get identical changes**; they are hand-duplicated and must stay
  in step.
- **Footer / version stamp** — deep enamel, mint text.

## 5. The facts feature (the one behavioural change)

### Markup — `story.html`

`#facts` keeps its `id`, its `hidden` attribute and its `#factsGrid` container.
A popout overlay is added as a sibling of the grid, following the same pattern as
the existing photo modal:

```html
<div class="fact-overlay" id="factOverlay" hidden>
  <div class="fact-pop" role="dialog" aria-modal="true" aria-labelledby="factStat">
    <button class="fact-close" id="factClose" aria-label="Close">✕</button>
    <span class="fact-badge" id="factBadge"></span>
    <div class="fact-pop-stat" id="factStat"></div>
    <div class="fact-pop-label" id="factLabel"></div>
    <div class="fact-quote-plate">
      <div class="fact-qmark" aria-hidden="true">“</div>
      <p class="fact-quote" id="factQuote"></p>
    </div>
    <div class="fact-who">
      <img src="assets/maisie-avatar.jpg" alt="Maisie">
      <span><b>Maisie</b><span>age 11 · was actually there</span></span>
    </div>
    <div class="fact-foot">
      <button class="fact-arrow" id="factPrev" aria-label="Previous fact">←</button>
      <div class="fact-dots" id="factDots"></div>
      <span class="fact-count" id="factCount"></span>
      <button class="fact-arrow" id="factNext" aria-label="Next fact">→</button>
    </div>
  </div>
</div>
```

### Behaviour — the facts IIFE in `site.js`

**Teaser tiles.** Each tile renders the index pill, the big `stat`, the `label`, and
a "tap to find out →" hint. **The fact text is not rendered into the tile.** Tiles are
`<button>`s.

**Popout.** Clicking a tile opens the overlay on that fact, showing stat, label, the
`text` in quotation marks, and Maisie's medallion.

**Navigation.** ←/→ buttons, dot indicators, real ArrowLeft/ArrowRight keys.
**Wraps** from 10 back to 1 and vice versa — it never dead-ends.

**Close.** ✕ button, Escape, or a click on the backdrop (target === overlay).

**Focus.** Opening moves focus into the popout and remembers the invoking tile;
closing returns focus to it. Focus is trapped inside the dialog while open.

**Count-up.** When `#facts` scrolls into view, each `stat` counts from zero to its
value once, over ~900 ms. Numeric prefixes are animated and any suffix preserved
(`"52 m"` → counts to 52, keeps " m"; `"19 million"` → counts to 19, keeps " million").
Non-numeric stats are written straight out. The count-up fires **once**, and is
skipped entirely under `prefers-reduced-motion`.

**Everything currently guarding this section survives unchanged**: the `hidden`
attribute until `FACTS[CURRENT_TRIP.id]` exists, the `#factsSub` sentence, the `#facts`
anchor, the 1.2-second scroll-pin with its `wheel`/`keydown`/`pointerdown`/`touchstart`
release, and the `#factsJump` reveal. The scroll-pin exists because the section is
script-revealed and the CJK webfonts reflow the intro by hundreds of pixels after
load — do not "simplify" it.

### Settled sub-decisions

- **Tile colour cycles** through four enamel fields (teal / coral / jade / deep teal)
  rather than being uniform. Real cloisonné is polychrome, and it stops the grid
  reading as a spreadsheet. Cycle is by index, so it is stable per trip.
- **No per-fact icons.** Thirty icons across three trips would be a lot of mediocre
  glyphs, and the number already is the icon.
- **Arrows wrap around.**

### Maisie's avatar

One image for all three trips: a square crop of
`Photographs/the-great-wall/maisie-portrait.jpg`, web-sized to ~200 px, saved as
`assets/maisie-avatar.jpg`. Displayed as a circle with a gold wire ring. One photo
rather than per-trip because the Xi'an folder contains no photograph of Maisie.

## 6. Motion

Interaction-driven only. Nothing moves at rest — no ambient animation anywhere.

| Trigger | Motion |
|---|---|
| Tile / card hover | lift 6px, rotate −1.2°, scale 1.03, wire brightens to `--gold` |
| Popout open | spring in — `scale(.86) translateY(14px)` → none, `cubic-bezier(.34,1.56,.64,1)`, 380 ms |
| Arrow press | depresses 4px, hard shadow collapses |
| Dots | active dot scales 1.45 and glows gold |
| Stat into view | counts up once from zero |
| Focus | gold wire ring |

All of it sits under the stylesheet's existing `prefers-reduced-motion` block, which
already neutralises animation and transition durations globally. The count-up is
additionally guarded in JS, because it is a content change rather than a CSS animation
and the media query cannot suppress it.

## 7. Accessibility

- Body text on enamel is `--cream`/`#FFF1EA`; small labels are `--mint`. Contrast of
  mint on `--enamel-teal` and of the quote text on the coral plate must be **verified
  against WCAG AA** during implementation, and darkened if they fall short.
- The popout is a real `role="dialog" aria-modal="true"` with a focus trap, an
  accessible name, and focus return.
- Every control is a `<button>` with an `aria-label` where its text is a glyph.
- Keyboard: Tab reaches tiles, Enter/Space opens, Escape closes, arrows navigate.
- `:focus-visible` keeps a visible ring throughout; the existing gold outline is
  re-pointed at `--gold`.

## 8. What does not change

- `assets/data.js` — no content edits. All of Maisie's copy is untouched.
- `?trip=` resolution, `CURRENT_TRIP`, `TRIP_LOCATIONS`, `FAMILY_PHOTO_DIR`,
  `photoSrc()`, and the internal-link rewriting (including its `trip=` skip check).
- The `PHOTOS.indexOf(p)` / `PHOTOS[i]` positional indexing in the map popout.
- `FAMILY[].file` path handling (`Photographs/${person.file}`, never prefixed).
- Map pins, `?loc=` deep-links, the William-quote conditional.
- The photo modal's `type:"video"` branching and `unloadVideo()` behaviour.
- Photo credit rendering — `creditBadge()`, `#modalCredit`, the plain-text-in-thumb
  constraint (a thumb is a `<button>`; a nested `<a>` is invalid).
- Page structure, nav links, routing, file layout.

`SITE_VERSION` goes to **2.0.0**.

## 9. Risks

1. **Pale map plans on a dark ground** — the largest unknown. Mitigation above.
2. **Contrast** — mint and coral on teal need measuring, not eyeballing.
3. **Breadth** — this touches nearly every rule in a 755-line stylesheet and five
   hand-maintained HTML files. It wants a full browser pass across all five pages
   and all three trips at the end, not blind trust.
4. **The 13 documented gotchas** in the handoff must all still hold afterwards; they
   are the regression checklist.
5. **Two modal copies** drifting apart if only one is edited.

## Verification

No test suite exists. Verification is a browser pass:

- All five pages × all three trips render without console errors.
- Facts: tiles show only numbers; popout opens, navigates, wraps, closes three ways;
  focus returns; count-up runs once.
- `story.html#facts` still lands on the facts section after webfonts load.
- `?trip=`/`?loc=` deep links still work; home chooser cards still point at different
  trips.
- Video thumbnail and modal playback still work on the Great Wall trip.
- Photo credits still render on the three sourced Xi'an photos.
- Mobile width: the single media query block at the end of the stylesheet covers
  every component, including the new ones.
