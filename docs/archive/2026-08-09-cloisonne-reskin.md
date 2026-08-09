# Cloisonné Re-skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the China 2026 site from muted lacquer-museum to Chinese cloisonné enamel — saturated teal/gold/coral, chunky display type, tactile plates — and turn the "10 Mind-Blowing Facts" into teaser tiles that open an interactive popout with Maisie's photo and the fact in quotes.

**Architecture:** The site is static and no-build: five near-identical HTML shells, one shared `assets/styles.css` driven by `:root` custom properties, and one `assets/site.js` of independent IIFEs. The re-skin is therefore mostly a token swap plus a per-component pass over the stylesheet. Task 2 remaps the legacy token names onto the new palette so the entire site re-colours coherently in one step and every later task is an isolated refinement rather than a partial breakage. Only one behaviour changes: the facts IIFE is rewritten and `story.html` gains a popout dialog.

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla ES5-flavoured JS (no modules, no framework), Google Fonts, Pillow (one-off image crop), Node 24 (checks only — the site itself ships no JS tooling).

**Reference spec:** `docs/superpowers/specs/2026-08-09-cloisonne-reskin-design.md`

## Global Constraints

- **No build step.** No `package.json`, no bundler, no dependencies added to the shipped site. `tools/check.mjs` runs on stock Node with no install.
- **No content edits.** `assets/data.js` copy is not touched except `SITE_VERSION`. Maisie's wording is the family's, not ours.
- **Never invent family moments.** Any new user-facing copy must be factual or structural (button labels, aria-labels). "age 11 · was actually there" is the only new Maisie-adjacent string, and it is true.
- **Never caption a photo without opening it.** Task 7 requires reading the produced avatar image back.
- **`?trip=` routing is untouchable:** `CURRENT_TRIP`, `TRIP_LOCATIONS`, `FAMILY_PHOTO_DIR`, `photoSrc()`, and the internal-link rewriter including its `if(query && /(^|&)trip=/.test(query)) return;` skip check.
- **`PHOTOS.indexOf(p)` / `PHOTOS[i]` in the map popout is positional.** Do not point that render path at a filtered array.
- **`FAMILY[].file` already contains its trip folder.** It is used verbatim as `Photographs/${person.file}`. Never prepend a trip directory.
- **Both copies of the photo-modal markup** (`map.html` and `gallery.html`) must stay structurally identical. `tools/check.mjs` enforces this.
- **The `#facts` scroll-pin must survive verbatim.** The 1.2-second `requestAnimationFrame` pin with its `wheel`/`keydown`/`pointerdown`/`touchstart` release exists because the section is script-revealed and the CJK webfonts reflow the intro by hundreds of pixels after load. Do not "simplify" it.
- **`#facts` stays `hidden` in the markup** and is only revealed when `FACTS[CURRENT_TRIP.id]` is non-empty. Same guard reveals `#factsJump`.
- **The photo modal's `type:"video"` branching and `unloadVideo()`** (which drops `src` rather than pausing) must keep working.
- **Photo credits render in two places** — `creditBadge()` inside the thumb (plain text, because a thumb is a `<button>` and a nested `<a>` is invalid) and `#modalCredit` in the modal. Both must survive.
- **All motion sits under `prefers-reduced-motion`.** The existing blanket at `assets/styles.css:50-52` covers CSS; the JS count-up needs its own `matchMedia` guard.
- **Remote check:** `git remote -v` must say `china-2026`. The old `forbidden-city-maisie` remote is a redirect stub — pushing there silently publishes nothing.
- **Encode `#` as `%23`** inside inline SVG data URIs, or the URL terminates at the fragment.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `tools/check.mjs` | **create** | Structural regression checks — data integrity, cross-page markup parity, required CSS tokens, required facts markup. Replaces the "no test command" gap for the duration of a change this broad. |
| `assets/styles.css` | modify throughout | The re-skin. Tokens, ornament primitives, per-component restyle, facts CSS, mobile block. |
| `index.html` | modify `<head>` line 9 | Font link. |
| `family.html` | modify `<head>` line 9 | Font link. |
| `map.html` | modify `<head>` line 15 | Font link. |
| `gallery.html` | modify `<head>` line 9 | Font link. |
| `story.html` | modify `<head>` line 9, add popout markup after line 49 | Font link + the facts dialog. |
| `assets/maisie-avatar.jpg` | **create** | 240×240 square crop of Maisie for the popout medallion. |
| `assets/site.js` | modify lines 138-213 | Facts IIFE rewrite: teaser tiles, popout, navigation, focus trap, count-up. |
| `assets/data.js` | modify line 4 | `SITE_VERSION` → `2.0.0`. |
| `CLAUDE.md` | modify | Record the new palette/typography, `tools/check.mjs`, and the facts popout. |
| `docs/HANDOFF-*.md` | rename + rewrite | Session close-out, per the existing convention. |

---

### Task 1: Structural check harness

The repo has no test runner and no build. Before changing five HTML files and a 755-line stylesheet, build a script that mechanically asserts the invariants a re-skin can silently break — cross-page nav/modal parity, the data graph, and the presence of tokens and element ids the JS depends on. Run it before and after every later task.

This file is an addition beyond the spec; Task 11 records it in `CLAUDE.md`.

**Files:**
- Create: `tools/check.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `node tools/check.mjs` — exits 0 when every check passes, 1 otherwise, printing one `ok`/`FAIL` line per check. Every later task ends by running it.

- [ ] **Step 1: Write the check script**

Create `tools/check.mjs`:

```js
#!/usr/bin/env node
/* ============================================================
   Structural checks for a site with no build and no test runner.
   These are not unit tests — they assert the invariants that a
   wide-reaching edit can silently break:
     * data.js still evaluates and its cross-references still resolve
     * site.js still parses
     * the five page shells still agree with each other
     * the CSS tokens and element ids the JS depends on still exist
   Run: node tools/check.mjs
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), "..");
const read  = f => readFileSync(join(ROOT, f), "utf8");
const PAGES = ["index.html", "story.html", "family.html", "map.html", "gallery.html"];

let failures = 0;
function check(name, fn){
  let problem;
  try { problem = fn(); }
  catch (err) { problem = err.message; }
  if (problem) { failures++; console.log(`FAIL  ${name}\n      ${problem}`); }
  else console.log(`ok    ${name}`);
}

/* data.js uses top-level `const`, so vm.runInNewContext never exposes the
   bindings. Evaluating the source with an explicit return is the recipe that
   actually works. */
function loadData(){
  const src = read("assets/data.js");
  return new Function(src + ";return {TRIPS,LOCATIONS,PHOTOS,FACTS,FAMILY,SITE_VERSION};")();
}

/* Strip HTML comments before comparing blocks — the two modal copies carry
   different "also in the other page" comments by design. */
const stripComments = s => s.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim();
const block = (src, startRe, endRe) => {
  const a = src.search(startRe);
  if (a < 0) return null;
  const b = src.slice(a).search(endRe);
  if (b < 0) return null;
  return src.slice(a, a + b);
};

check("data.js evaluates and exposes its bindings", () => {
  const d = loadData();
  for (const k of ["TRIPS","LOCATIONS","PHOTOS","FACTS","FAMILY","SITE_VERSION"])
    if (d[k] === undefined) return `${k} is undefined`;
  return null;
});

check("site.js parses", () => { new Function(read("assets/site.js")); return null; });

check("every page loads data.js then site.js", () => {
  for (const p of PAGES){
    const s = read(p);
    const d = s.indexOf("assets/data.js"), j = s.indexOf("assets/site.js");
    if (d < 0 || j < 0) return `${p} is missing a script tag`;
    if (d > j) return `${p} loads site.js before data.js`;
  }
  return null;
});

check("every page links the same font stylesheet", () => {
  const links = PAGES.map(p => (read(p).match(/^.*fonts\.googleapis\.com.*$/m) || [""])[0].trim());
  if (links.some(l => !l)) return "a page has no Google Fonts link";
  if (new Set(links).size !== 1) return "font links differ:\n      " + [...new Set(links)].join("\n      ");
  return null;
});

check("every page links assets/styles.css", () =>
  PAGES.filter(p => !read(p).includes('href="assets/styles.css"')).join(", ") || null);

check("the site nav is identical on all five pages", () => {
  const navs = PAGES.map(p => stripComments(block(read(p), /<header class="site-nav">/, /<\/header>/) || ""));
  if (navs.some(n => !n)) return "a page has no .site-nav header";
  if (new Set(navs).size !== 1) return "nav markup has drifted between pages";
  return null;
});

check("the photo modal is identical in map.html and gallery.html", () => {
  const m = PAGES.filter(p => read(p).includes('id="modalOverlay"'))
    .map(p => [p, stripComments(block(read(p), /<div class="modal-overlay"/, /<script/) || "")]);
  if (m.length !== 2) return `expected 2 pages with a modal, found ${m.length}`;
  return m[0][1] === m[1][1] ? null : `${m[0][0]} and ${m[1][0]} have diverged`;
});

check("required CSS custom properties are defined", () => {
  const css = read("assets/styles.css");
  const need = ["--enamel-deep","--enamel-mid","--enamel-teal","--enamel-teal-2",
    "--enamel-teal-3","--wire","--gold","--gold-2","--gold-deep","--coral","--coral-2",
    "--mint","--cream","--jade","--jade-2","--paper","--paper-dark","--ink","--ink-soft",
    "--font-display","--font-ui","--font-body","--font-hanzi","--radius-panel",
    "--radius-pill","--lattice","--cloud-scroll","--fret","--fret-v"];
  const missing = need.filter(t => !new RegExp(`^\\s*${t}\\s*:`, "m").test(css));
  return missing.length ? `not defined: ${missing.join(", ")}` : null;
});

check("story.html carries the facts popout markup", () => {
  const s = read("story.html");
  const need = ["factsGrid","factsSub","factsJump","factOverlay","factClose","factBadge",
    "factStat","factLabel","factQuote","factDots","factCount","factPrev","factNext"];
  const missing = need.filter(id => !s.includes(`id="${id}"`));
  if (missing.length) return `missing ids: ${missing.join(", ")}`;
  if (!/<section class="wide" id="facts" hidden>/.test(s)) return "#facts is no longer hidden in the markup";
  return null;
});

check("FACTS are well formed and belong to a real trip", () => {
  const { TRIPS, FACTS } = loadData();
  const ids = new Set(TRIPS.map(t => t.id));
  for (const [trip, list] of Object.entries(FACTS)){
    if (!ids.has(trip)) return `FACTS has no matching trip: ${trip}`;
    list.forEach((f, i) => {
      if (!f.stat || !f.label || !f.text) throw new Error(`${trip}[${i}] is missing a field`);
      if (f.stat.length > 9) throw new Error(`${trip}[${i}].stat "${f.stat}" is over 9 characters`);
    });
  }
  return null;
});

check("every photo points at a location on its own trip", () => {
  const { LOCATIONS, PHOTOS } = loadData();
  const bad = PHOTOS.filter(p =>
    !LOCATIONS.some(l => l.id === p.location && l.trip === p.trip));
  return bad.length ? bad.map(p => p.id).join(", ") : null;
});

check("every referenced image and portrait exists on disk", () => {
  const { TRIPS, PHOTOS, FAMILY } = loadData();
  const dir = id => (TRIPS.find(t => t.id === id) || {}).photoDir;
  const missing = [
    ...PHOTOS.filter(p => !existsSync(join(ROOT, "Photographs", dir(p.trip) || "", p.file)))
             .map(p => `Photographs/${dir(p.trip)}/${p.file}`),
    ...FAMILY.filter(f => !existsSync(join(ROOT, "Photographs", f.file)))
             .map(f => `Photographs/${f.file}`),
    ...TRIPS.filter(t => !existsSync(join(ROOT, "assets", t.map)))
            .map(t => `assets/${t.map}`)
  ];
  return missing.length ? missing.join(", ") : null;
});

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run it against the unmodified site**

Run: `node tools/check.mjs`

Expected: every check prints `ok` **except** these two, which fail because the work has not been done yet:

```
FAIL  required CSS custom properties are defined
      not defined: --enamel-deep, --enamel-mid, ... --cloud-scroll
FAIL  story.html carries the facts popout markup
      missing ids: factOverlay, factClose, factBadge, factStat, factLabel, factQuote, factDots, factCount, factPrev, factNext
```

Those two are the plan's finish line and go green in Tasks 2 and 8.

If any **other** check fails, that is a genuine pre-existing problem or a bug in the check — stop and investigate before touching the stylesheet. A wrong baseline makes every later run meaningless.

- [ ] **Step 3: Commit**

```bash
git add tools/check.mjs
git commit -m "Add a structural check harness for the re-skin

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens and typography

Swap the palette and the three type families. Legacy token names are kept as aliases pointing at the new values, so the whole site re-colours coherently in this single step and every later task refines one component instead of un-breaking the site. Task 10 deletes the aliases.

**Files:**
- Modify: `assets/styles.css:1-52` (the `:root` block, `body`, base element rules)
- Modify: `index.html:9`, `story.html:9`, `family.html:9`, `gallery.html:9`, `map.html:15`

**Interfaces:**
- Consumes: nothing.
- Produces: the token names listed in the check script's `required CSS custom properties` list, plus the legacy aliases `--lacquer`, `--lacquer-2`, `--vermillion`, `--vermillion-dark`, `--vermillion-bright`, `--gold-bright`, `--gold-dim`, `--seal-ink`, `--seal-ink-dark`. Later tasks may use any of them; Task 10 removes the aliases.

- [ ] **Step 1: Replace the font link on all five pages**

The same one-line replacement in each of `index.html:9`, `story.html:9`, `family.html:9`, `gallery.html:9`, `map.html:15`.

Old (identical on all five):

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700;900&family=Noto+Sans+SC:wght@400;500;600&display=swap" rel="stylesheet">
```

New (identical on all five — the check script compares them byte for byte):

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Outfit:wght@400;600;800&family=Nunito:wght@400;600;700&family=Noto+Serif+SC:wght@500;700;900&family=Noto+Sans+SC:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Replace the `:root` block and base rules**

Replace `assets/styles.css` lines 1-52 (from `:root{` through the closing `}` of the `prefers-reduced-motion` block) with:

```css
:root{
  /* ---- Cloisonné (景泰蓝) enamel palette ----
     Jewel enamel fields divided by thin gold wire. The teal trio is the
     plate gradient; --wire is the hairline that outlines every surface. */
  --enamel-deep:#062430;
  --enamel-mid:#0A3644;
  --enamel-teal:#1D7C86;
  --enamel-teal-2:#106072;
  --enamel-teal-3:#0A4757;
  --wire:#D9B65A;
  --gold:#F5C542;
  --gold-2:#C9922E;
  --gold-deep:#8A6418;
  --coral:#F2604C;
  --coral-2:#B7332A;
  --mint:#8FE3DE;
  --cream:#F5EDD8;
  --jade:#2E8B72;
  --jade-2:#17604F;

  /* Light surfaces, kept for the long-form reading panel only. */
  --paper:#F7EFDA;
  --paper-dark:#EBDFC0;
  --ink:#20323A;
  --ink-soft:#4C6570;

  /* ---- Legacy aliases -------------------------------------------------
     Rules further down still name the lacquer-era tokens. Remapping them
     here re-colours the whole site in one step; the component tasks replace
     the usages and the final CSS task deletes this block. */
  --lacquer:#062430;
  --lacquer-2:#0A3644;
  --vermillion:#F2604C;
  --vermillion-dark:#B7332A;
  --vermillion-bright:#FF7A63;
  --gold-bright:#FFD86B;
  --gold-dim:#D9B65A;
  --seal-ink:#F2604C;
  --seal-ink-dark:#B7332A;

  --font-display:'Fraunces', Georgia, 'Times New Roman', serif;
  --font-ui:'Outfit', "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-body:'Nunito', "Segoe UI", system-ui, -apple-system, sans-serif;
  /* The three new families carry no Chinese glyphs, so every hanzi element
     names Noto explicitly rather than falling through to a system default. */
  --font-hanzi:'Noto Serif SC', Georgia, serif;
  --font-hanzi-sans:'Noto Sans SC', system-ui, sans-serif;

  --radius-panel:14px;
  --radius-pill:99px;
  --shadow-lift: 0 6px 16px rgba(3,18,24,0.45);
  --shadow-soft: 0 12px 26px rgba(3,18,24,0.45);
  --shadow-deep: 0 34px 70px rgba(3,18,24,0.65);

  /* Ornament primitives — self-contained inline SVG so nothing needs
     duplicating across the five hand-maintained HTML files.
     Note every "#" is encoded %23; a literal one truncates the data URI. */
  --texture-paper:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  --texture-lacquer:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  /* Key-fret (回纹) molding, drawn once, repeated as a border strip.
     Drawn 1:1 at its rendered size so the meander never squashes. */
  --fret:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'%3E%3Cpath d='M0 5 H5 V2 H15 V8 H20' fill='none' stroke='%23D9B65A' stroke-width='1.5'/%3E%3C/svg%3E");
  --fret-bright:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'%3E%3Cpath d='M0 5 H5 V2 H15 V8 H20' fill='none' stroke='%23F5C542' stroke-width='1.5'/%3E%3C/svg%3E");
  /* Same molding rotated 90° for the vertical runs of a full frame. */
  --fret-v:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='20' viewBox='0 0 10 20'%3E%3Cpath d='M5 0 V5 H8 V15 H2 V20' fill='none' stroke='%23D9B65A' stroke-width='1.5'/%3E%3C/svg%3E");
  /* Window lattice (窗棂) — shows through the enamel on every plate. */
  --lattice:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cg fill='none' stroke='%23F5E3B0' stroke-width='.9' opacity='.5'%3E%3Cpath d='M0 24h48M24 0v48M0 0l24 24M48 0L24 24M0 48l24-24M48 48L24 24'/%3E%3C/g%3E%3C/svg%3E");
  /* Auspicious clouds (祥云) — the page and hero ground. */
  --cloud-scroll:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='48' viewBox='0 0 72 48'%3E%3Cg fill='none' stroke='%23D9B65A' stroke-width='1' opacity='.28'%3E%3Cpath d='M4 34c-2-6 3-11 8-9 0-6 7-9 12-5 4-5 12-3 13 3 6 0 9 5 7 11'/%3E%3Cpath d='M40 14c-1-4 2-7 5-6 0-4 5-6 8-3'/%3E%3Ccircle cx='12' cy='31' r='2.6'/%3E%3Ccircle cx='24' cy='27' r='2.6'/%3E%3C/g%3E%3C/svg%3E");
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;font-size:17px;}
body{
  margin:0;
  background-color:var(--enamel-deep);
  background-image:var(--cloud-scroll);
  color:var(--cream);
  font-family:var(--font-body);
  font-size:1rem;
  line-height:1.62;
}
h1,h2,h3,.display{font-family:var(--font-display);font-weight:900;}
button{font-family:var(--font-ui);}
a{color:inherit;}
img{max-width:100%;display:block;}
/* The three Latin families carry no CJK, so every hanzi element is pinned. */
.seal-mini, .seal-title span, .hero-hanzi, .nav-card .hanzi, .panel .chinese{
  font-family:var(--font-hanzi);
}
:focus-visible{outline:3px solid var(--gold);outline-offset:3px;}
@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.001ms !important;animation-iteration-count:1 !important;transition-duration:0.001ms !important;scroll-behavior:auto !important;}
}
```

- [ ] **Step 3: Verify the tokens check goes green**

Run: `node tools/check.mjs`

Expected: `ok    required CSS custom properties are defined`, `ok    every page links the same font stylesheet`, and only the `story.html carries the facts popout markup` check still failing.

- [ ] **Step 4: Look at it**

Open `story.html` and `index.html` in a browser. Expected: everything is now teal and gold, headings are Fraunces, body is Nunito. Cards are still paper-coloured and square-cornered — that is correct at this stage; Tasks 3-6 turn them into enamel.

- [ ] **Step 5: Commit**

```bash
git add assets/styles.css index.html story.html family.html map.html gallery.html
git commit -m "Swap in the cloisonne palette and the new type families

Legacy token names stay as aliases so the whole site re-colours in one
step; the component passes replace their usages.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Ornament primitives and the enamel plate recipe

Replace the lacquer-era corner-bracket primitive with the enamel-plate surface that every raised element in the site now shares, recolour the seal stamp, and restyle the plaque buttons as gold enamel pills.

**Files:**
- Modify: `assets/styles.css` — the `ORNAMENT PRIMITIVES` section, currently lines 54-158

**Interfaces:**
- Consumes: the tokens from Task 2.
- Produces: the class `.enamel` (any element can opt in), and the enamel treatment applied by name to `.nav-card`, `.family-card`, `.location-card`, `.modal`, `.bonus-feature`, `.fact-tile`, `.fact-pop`. Also produces the convention that **direct children of an enamel plate need `position:relative`** so they paint above the absolutely-positioned lattice overlay.

- [ ] **Step 1: Replace the corner-bracket and seal blocks**

In `assets/styles.css`, replace everything from the comment header `/* --- 2. Corner brackets` down to the end of the plaque-button block (currently lines 89-158, ending with the `.gallery-filter button:hover::before` rule) with:

```css
/* --- 2. Enamel plate (景泰蓝): one material for every raised surface ---
   A gradient enamel field, a hairline gold wire, a dark setting around it,
   a glaze highlight along the top and a domed falloff at the bottom.
   The corner-bracket mounts this replaces were a lacquer-era device; the
   wire outline now does that job on every edge rather than four corners. */
.enamel,
.nav-card, .family-card, .location-card, .modal,
.bonus-feature, .fact-tile, .fact-pop{
  position:relative;
  border:0;
  border-radius:var(--radius-panel);
  background:linear-gradient(158deg,
    var(--enamel-teal) 0%, var(--enamel-teal-2) 45%, var(--enamel-teal-3) 100%);
  box-shadow:
    0 0 0 1.5px var(--wire),
    0 0 0 5px rgba(6,36,48,.5),
    0 12px 26px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.32),
    inset 0 -16px 30px rgba(0,0,0,.26);
  color:var(--cream);
}
/* The lattice shows through the enamel rather than sitting behind it. */
.enamel::before,
.nav-card::before, .family-card::before, .location-card::before, .modal::before,
.bonus-feature::before, .fact-tile::before, .fact-pop::before{
  content:"";
  position:absolute;inset:0;
  border-radius:inherit;
  background-image:var(--lattice);
  opacity:.36;
  pointer-events:none;
}
/* That overlay is absolutely positioned, so it paints above ordinary in-flow
   children — including photographs. Lift the content back over it.
   .location-close is sticky (which is already positioned) and is excluded so
   its stickiness survives. */
.enamel > *,
.nav-card > *, .family-card > *, .modal > *,
.bonus-feature > *, .fact-tile > *, .fact-pop > *,
.location-card > .panel, .location-card > .william-toggle{
  position:relative;
}

/* --- 3. Seal stamp: carved edge, mottled ink, soft bleed ---
   Map pins are no longer seals — they became enamel discs — so they are not
   in this group. See the map section. */
.seal-mini, .seal-title{
  position:relative;
  border:none;
  border-radius:0;
  background:
    radial-gradient(ellipse at 30% 25%, rgba(255,236,214,.22), transparent 58%),
    radial-gradient(ellipse at 74% 84%, rgba(183,51,42,.45), transparent 62%),
    linear-gradient(150deg, #FF7A63 0%, var(--coral) 62%, var(--coral-2) 100%);
  clip-path:polygon(2% 5%, 96% 0%, 100% 95%, 95% 100%, 5% 97%, 0% 6%);
  /* drop-shadow follows the carved silhouette; box-shadow would be clipped.
     First layer is the ink bleed, second is the physical shadow. */
  filter:
    drop-shadow(0 0 3px rgba(242,96,76,.55))
    drop-shadow(0 3px 6px rgba(3,18,24,.5));
}

/* --- 4. Pill controls: one shape language for every labelled control.
   The fill lives on a pseudo-element so the real control keeps a rectangular
   hit box and an unclipped focus ring. --- */
.nav-links a.nav-cta, .location-close, .gallery-filter button{
  position:relative;
  background:none;
  border:none;
  border-radius:var(--radius-pill);
  isolation:auto;
  font-family:var(--font-ui);
  font-weight:600;
}
.nav-links a.nav-cta::before, .location-close::before, .gallery-filter button::before{
  content:"";
  position:absolute;inset:0;
  z-index:-1;
  border-radius:var(--radius-pill);
  background:linear-gradient(158deg, rgba(245,237,216,.16), rgba(6,36,48,.4));
  box-shadow:0 0 0 1.5px var(--wire), inset 0 1px 0 rgba(255,255,255,.25);
  transition:box-shadow .18s ease, background .18s ease;
}
/* Filled (emphasis) variant */
.nav-links a.nav-cta::before, .gallery-filter button.active::before{
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  box-shadow:0 0 0 1.5px var(--wire), inset 0 1px 0 rgba(255,255,255,.45);
}
.nav-links a.nav-cta:hover::before, .location-close:hover::before,
.gallery-filter button:hover::before{
  box-shadow:0 0 0 1.5px var(--cream), inset 0 1px 0 rgba(255,255,255,.5);
}
.location-close{color:var(--cream);}
.gallery-filter button{color:var(--mint);}
.gallery-filter button.active{color:var(--enamel-mid);font-weight:800;}
.nav-links a.nav-cta{color:var(--enamel-mid);font-weight:800;}
```

- [ ] **Step 2: Delete the two `::after` references the brackets left behind**

The bracket primitive is gone, so two rules now point at nothing. In `assets/styles.css`, delete these lines:

```css
.nav-card:hover::after, .nav-card:focus-visible::after{opacity:1;}
```

and

```css
.nav-card.featured::after{opacity:.85;}
```

Then confirm nothing else references them:

Run: `grep -n "::after{opacity" assets/styles.css`
Expected: no output.

- [ ] **Step 3: Verify**

Run: `node tools/check.mjs`
Expected: unchanged from Task 2 — only the `story.html` popout check failing.

Open `family.html` and `index.html`. Expected: the cards are now glossy teal enamel plates with a gold hairline and a faint lattice; their text is still dark ink and largely unreadable on the new ground. That is fixed in Tasks 4-6.

- [ ] **Step 4: Commit**

```bash
git add assets/styles.css
git commit -m "Replace the corner-bracket primitive with the enamel plate recipe

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Chrome — nav, hero, sections, footer, version stamp

**Files:**
- Modify: `assets/styles.css` — the `Site nav`, `Hero` and `Sections` sections, plus `footer` and `.version-stamp`

**Interfaces:**
- Consumes: tokens from Task 2, the pill-control primitive from Task 3.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Restyle the nav**

Replace the `.site-nav`, `.nav-brand`, `.nav-toggle` and `.nav-links` rules (from `/* ---------- Site nav ---------- */` down to but **not including** the `@media (max-width:760px)` block) with:

```css
/* ---------- Site nav ---------- */
.site-nav{
  position:sticky;top:0;z-index:80;
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;
  padding:.8rem 1.2rem 1rem;
  background:linear-gradient(180deg, rgba(10,54,68,.97), rgba(6,36,48,.97));
  backdrop-filter:blur(6px);
  border-bottom:1px solid var(--wire);
}
.nav-brand{
  display:flex;align-items:center;gap:.55rem;
  font-family:var(--font-ui);
  color:var(--gold);
  text-decoration:none;
  font-weight:800;
  font-size:1.02rem;
  letter-spacing:.01em;
  white-space:nowrap;
}
.nav-brand .seal-mini{
  width:30px;height:30px;
  display:flex;align-items:center;justify-content:center;
  font-size:.85rem;color:#FFF1EA;flex-shrink:0;
  text-shadow:0 1px 1px rgba(0,0,0,.45);
}
.nav-toggle{
  display:none;
  background:none;border:1.5px solid var(--wire);border-radius:var(--radius-pill);
  color:var(--gold);font-size:1.2rem;width:44px;height:38px;
  cursor:pointer;
}
.nav-links{
  display:flex;align-items:center;gap:.4rem;
  font-family:var(--font-ui);
  font-size:.9rem;
}
.nav-links a{
  text-decoration:none;color:var(--mint);
  padding:.35rem .7rem;
  border-bottom:none;
  border-radius:var(--radius-pill);
  font-weight:600;
  transition:color .15s ease, background .15s ease;
}
.nav-links a:hover{color:var(--cream);background:rgba(245,197,66,.15);}
.nav-links a.current{
  color:var(--enamel-mid);font-weight:800;
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  box-shadow:0 0 0 1.5px var(--wire);
}
.nav-links a.nav-cta{
  padding:.5rem 1.05rem;
}
/* The CTA already draws a gold pill on its ::before, so the .current fill
   would stack a second one on top of it. */
.nav-links a.nav-cta.current{background:none;box-shadow:none;}
.nav-links a.nav-cta:hover{color:var(--enamel-deep);background:none;}
```

- [ ] **Step 2: Repoint the mobile nav panel**

In the `@media (max-width:760px)` block, change:

```css
    background:var(--lacquer);
```

to:

```css
    background:linear-gradient(180deg, var(--enamel-mid), var(--enamel-deep));
```

- [ ] **Step 3: Restyle the hero and delete the dead cloud-drift rules**

`.cloud-layer`, `.cloud-1` and `.cloud-2` have no markup on any page (verified: no `cloud-layer` in any HTML file) and the `drift` keyframes animate at rest, which the design forbids. Delete these five lines:

```css
.cloud-layer{position:absolute;inset:0;pointer-events:none;opacity:0.35;}
.cloud-layer svg{position:absolute;width:160%;max-width:none;}
.cloud-1{top:6%;left:-30%;animation:drift 70s linear infinite;}
.cloud-2{top:22%;left:-60%;animation:drift 95s linear infinite reverse;opacity:0.6;}
@keyframes drift{from{transform:translateX(0);}to{transform:translateX(55%);}}
```

Then replace the `.hero` rule, the `.hero.home-hero::before` rule, and the hero typography rules with:

```css
/* ---------- Hero ---------- */
.hero{
  position:relative;
  padding:5rem 1.5rem 3.5rem;
  text-align:center;
  color:var(--cream);
  overflow:hidden;
  background-image:
    var(--cloud-scroll),
    radial-gradient(ellipse 70% 60% at 50% -10%, rgba(29,124,134,.55), transparent 70%),
    linear-gradient(180deg, var(--enamel-mid) 0%, var(--enamel-deep) 80%);
}
.hero.compact{padding:2.2rem 1.5rem 1.8rem;}
```

Leave `.hero.home-hero` itself alone (it carries the photograph and the no-JS fallback URL), but replace its scrim:

```css
.hero.home-hero::before{
  content:"";position:absolute;inset:0;
  background:
    linear-gradient(180deg, rgba(6,36,48,.55) 0%, rgba(6,36,48,.88) 100%),
    radial-gradient(ellipse 70% 60% at 50% 30%, rgba(29,124,134,.22), transparent 70%);
}
```

And the type:

```css
.hero-hanzi{
  position:relative;z-index:1;
  font-weight:700;
  color:var(--gold);opacity:.9;
  font-size:.85rem;letter-spacing:.3em;
  margin-bottom:.3rem;
}
.hero .kicker{
  position:relative;z-index:1;
  font-family:var(--font-ui);
  letter-spacing:.22em;text-transform:uppercase;font-size:.68rem;font-weight:800;
  color:var(--gold);margin-bottom:.4rem;
}
.hero h1{
  position:relative;z-index:1;
  font-family:var(--font-display);font-weight:900;
  font-size:clamp(1.9rem, 5vw, 2.9rem);
  margin:0 0 .45rem;color:var(--cream);
  text-shadow:0 2px 0 rgba(0,0,0,.45), 0 0 34px rgba(43,179,176,.45);
}
.hero.compact h1{font-size:clamp(1.5rem, 4vw, 2.05rem);}
.hero p.sub{
  position:relative;z-index:1;
  max-width:580px;margin:0 auto;font-size:.98rem;color:var(--mint);
}
.hero.home-hero p.sub{font-size:.92rem;}
.hero .byline{
  position:relative;z-index:1;
  margin-top:.8rem;font-size:.8rem;color:var(--gold);font-style:italic;
}
```

- [ ] **Step 4: Restyle the jump button**

Replace `.hero-jump` and `.hero-jump:hover` with:

```css
/* Jump link to the facts section. The facts sit below a long intro, so without
   a signpost above the fold nobody scrolls far enough to find them. */
.hero-jump{
  position:relative;z-index:1;
  display:inline-block;margin-top:1.1rem;
  padding:.6rem 1.3rem;
  font-family:var(--font-ui);font-size:.88rem;font-weight:800;
  color:var(--enamel-mid);text-decoration:none;
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  border:0;border-radius:var(--radius-pill);
  box-shadow:0 0 0 1.5px var(--wire), 0 6px 0 var(--gold-deep), 0 10px 20px rgba(0,0,0,.4);
  transition:transform .15s ease, box-shadow .15s ease;
}
.hero-jump:hover{
  transform:translateY(-3px);
  box-shadow:0 0 0 1.5px var(--cream), 0 9px 0 var(--gold-deep), 0 14px 26px rgba(0,0,0,.5);
}
.hero-jump:active{
  transform:translateY(3px);
  box-shadow:0 0 0 1.5px var(--wire), 0 2px 0 var(--gold-deep);
}
.hero-jump[hidden]{display:none;}
```

- [ ] **Step 5: Restyle sections, footer and the version stamp**

Replace the `Sections` block, `footer` and `.version-stamp` colour lines:

```css
/* ---------- Sections ---------- */
main{background:var(--enamel-deep);}
section{max-width:920px;margin:0 auto;padding:4rem 1.5rem;}
section.wide{max-width:1140px;}
section.tight{padding:1.2rem 1.5rem 2rem;}
.section-head{text-align:center;margin-bottom:1.1rem;}
section.tight .section-head{margin-bottom:.8rem;}
.section-title{
  font-family:var(--font-display);font-weight:900;
  color:var(--cream);font-size:2rem;margin:0 0 .7rem;
  text-shadow:0 2px 0 rgba(0,0,0,.35);
}
section.tight .section-title{font-size:1.35rem;margin-bottom:.4rem;}
.section-sub{color:var(--mint);margin-top:.9rem;font-style:normal;font-size:.95rem;}
section.tight .section-sub{margin-top:.5rem;font-size:.84rem;}
```

```css
footer{position:relative;text-align:center;color:var(--mint);opacity:.8;padding:3rem 1.5rem 4rem;font-size:.9rem;font-style:italic;}
```

In `.version-stamp`, change `font-family:var(--font-body);` to `font-family:var(--font-ui);` and `color:var(--gold);` to `color:var(--mint);`.

- [ ] **Step 6: Verify**

Run: `node tools/check.mjs`
Expected: unchanged — only the `story.html` popout check failing.

Run: `grep -n "cloud-layer\|@keyframes drift" assets/styles.css`
Expected: no output.

Open `index.html` and `story.html`. Expected: teal nav with a gold current-page pill, hero heading in heavy Fraunces cream over a teal glow, gold jump button with a hard bottom edge that depresses when clicked.

- [ ] **Step 7: Commit**

```bash
git add assets/styles.css
git commit -m "Re-skin the nav, hero, sections and footer in enamel

Also drops the .cloud-layer drift rules: no page carries the markup and
the design forbids motion at rest.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Content surfaces — nav cards, scroll panel, family cards, bonus feature

**Files:**
- Modify: `assets/styles.css` — the `Home nav cards`, `Scroll panel`, `Family` and `Bonus feature` sections

**Interfaces:**
- Consumes: the enamel plate from Task 3.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Nav cards and the trip chooser**

Replace the `.nav-card` rules (keep `.nav-cards` grid as it is) with:

```css
.nav-card{
  display:block;text-decoration:none;
  padding:1.35rem 1rem 1.25rem;
  text-align:center;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease;
}
.nav-card:hover, .nav-card:focus-visible{
  transform:translateY(-6px) rotate(-1.2deg) scale(1.03);
  box-shadow:
    0 0 0 1.5px var(--gold),
    0 0 0 5px rgba(6,36,48,.5),
    0 20px 38px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.4);
}
.nav-card .icon{font-size:2rem;margin-bottom:.35rem;}
.nav-card .hanzi{display:block;font-size:.74rem;color:var(--gold);opacity:.9;margin-bottom:.2rem;letter-spacing:.12em;}
.nav-card h3{margin:0 0 .35rem;color:var(--cream);font-size:1.05rem;}
.nav-card p{margin:0;font-family:var(--font-body);font-size:.8rem;color:var(--mint);line-height:1.45;}
/* The featured card takes the coral enamel field instead of the teal one. */
.nav-card.featured{
  background:linear-gradient(158deg, var(--coral) 0%, #C93B2E 55%, var(--coral-2) 100%);
}
.nav-card.featured h3{color:#FFF3E4;}
.nav-card.featured p{color:#FFD8CE;}
.nav-card.featured .hanzi{color:#FFE07A;}
```

- [ ] **Step 2: Scroll panel**

The long-form intro stays dark-on-light — it is the only place on the site with paragraphs long enough to need it. What changes is its frame: paper inside a gold wire, with enamel rods.

Replace the `Scroll panel` section with:

```css
/* ---------- Scroll panel (signature element) ----------
   Deliberately the one light surface left: this is the only block with enough
   continuous prose to punish light-on-dark. It is mounted in gold wire so it
   still reads as part of the enamel system. */
.scroll-panel{position:relative;margin:0 auto;max-width:780px;}
.scroll-rod{
  height:20px;border-radius:10px;
  background:linear-gradient(180deg, var(--enamel-teal), var(--enamel-teal-3));
  box-shadow:
    0 0 0 1.5px var(--wire),
    inset 0 2px 3px rgba(255,255,255,0.25),
    inset 0 -2px 4px rgba(0,0,0,0.4);
  position:relative;z-index:2;
}
.scroll-rod::before, .scroll-rod::after{
  content:"";position:absolute;top:-6px;
  width:26px;height:32px;border-radius:9px;
  background:radial-gradient(circle at 35% 30%, #FFE08A, var(--gold) 55%, var(--gold-2) 100%);
  box-shadow:0 0 0 1.5px var(--wire), var(--shadow-lift);
}
.scroll-rod::before{left:-14px;}
.scroll-rod::after{right:-14px;}
.scroll-body{
  background-color:var(--paper);
  background-image:
    var(--texture-paper),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-dark) 100%);
  background-blend-mode:multiply, normal;
  box-shadow:0 0 0 1.5px var(--wire), 0 0 0 5px rgba(6,36,48,.5), var(--shadow-soft);
  color:var(--ink);
  font-size:1.06rem;
  padding:2.4rem 2.6rem;position:relative;
}
.scroll-body::before{
  content:"";position:absolute;left:0;right:0;top:0;height:14px;
  background:linear-gradient(180deg, rgba(0,0,0,0.14), transparent);
}
.diary p{margin:0 0 1em;}
.diary p:last-child{margin-bottom:0;}
.diary strong{color:var(--coral-2);}
```

- [ ] **Step 3: Family cards**

Replace the `Family` section with:

```css
/* ---------- Family: enamel cards with medallion portraits ---------- */
.family-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(210px,1fr));gap:1.7rem;}
.family-card{
  padding:1.8rem 1.4rem 1.6rem;
  text-align:center;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease;
}
.family-card:hover{
  transform:translateY(-5px) rotate(-1deg) scale(1.02);
  box-shadow:
    0 0 0 1.5px var(--gold),
    0 0 0 5px rgba(6,36,48,.5),
    0 20px 38px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.4);
}
/* A gold-ringed medallion, matching Maisie's avatar in the facts popout. */
.seal-avatar{
  width:96px;height:96px;margin:0 auto 1rem;
  border:0;border-radius:50%;
  background:linear-gradient(150deg, var(--coral), var(--coral-2));
  box-shadow:0 0 0 2px var(--wire), 0 0 0 6px rgba(6,36,48,.55), var(--shadow-lift);
  display:flex;align-items:center;justify-content:center;
  font-size:2.4rem;color:#FFF1EA;overflow:hidden;
}
.seal-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.family-card h3{margin:.2rem 0 0;color:var(--cream);font-size:1.2rem;}
.family-role{
  font-family:var(--font-ui);
  font-size:.68rem;text-transform:uppercase;letter-spacing:.14em;
  color:var(--gold);font-weight:800;margin:.35rem 0 .75rem;
}
.family-card p{font-family:var(--font-body);font-size:.9rem;color:var(--mint);margin:0;}
```

Then delete the now-dead rotation rule:

```css
.family-card:nth-child(even) .seal-avatar{transform:rotate(3deg);}
```

- [ ] **Step 4: Bonus feature**

Replace the `.bonus-feature` colour and border rules (keep the grid layout and the `@media (max-width:640px)` block underneath it):

```css
/* ---------- Bonus feature (e.g. Maisie's princess photo) ---------- */
.bonus-feature{
  display:grid;grid-template-columns:minmax(200px,320px) 1fr;
  gap:1.7rem;align-items:center;
  padding:1.5rem;
}
.bonus-feature img{
  border-radius:10px;
  box-shadow:0 0 0 1.5px var(--wire), 0 0 0 5px rgba(6,36,48,.5), var(--shadow-lift);
}
.bonus-feature .bonus-eyebrow{
  font-family:var(--font-ui);
  font-size:.68rem;text-transform:uppercase;letter-spacing:.14em;
  color:var(--gold);font-weight:800;margin-bottom:.4rem;
}
.bonus-feature h3{margin:0 0 .55rem;color:var(--cream);font-size:1.25rem;}
.bonus-feature p{margin:0 0 .7rem;font-family:var(--font-body);font-size:.93rem;color:var(--mint);}
.bonus-feature p:last-child{margin-bottom:0;}
```

- [ ] **Step 5: Verify**

Run: `node tools/check.mjs`
Expected: unchanged — only the `story.html` popout check failing.

Open `index.html`, `family.html` and `story.html`. Expected: trip cards lift and tilt on hover with the wire brightening to gold; the Map card is coral; family portraits are gold-ringed circles; the story intro is still dark text on paper, now framed in gold wire with teal rods.

- [ ] **Step 6: Commit**

```bash
git add assets/styles.css
git commit -m "Re-skin the nav cards, scroll panel, family cards and bonus feature

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Map, location popout, photo thumbs, gallery and modal

The map plans are pale scans on what is now a dark ground. This task mats them in cream so they read as mounted prints rather than glaring holes — using `box-shadow` spread rather than padding, because `#pinLayer` positions pins as percentages of `.map-inner` and any padding there would shift every pin off its landmark.

**Files:**
- Modify: `assets/styles.css` — the `Map`, `Location popout`, `Photo thumbs`, `Gallery` and `Modal` sections

**Interfaces:**
- Consumes: the enamel plate from Task 3 (which already covers `.location-card` and `.modal`).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Map case, mat, pins and compass**

Replace `.map-case`, `.map-inner`, `.pin`, the `.pin:hover, .pin.active` rule, `.compass` and `.map-legend`. Keep the `.map-case::before` fret frame, `.map-case.dimmed`, and all four `:root[data-trip=...]` rules exactly as they are.

```css
.map-case{
  position:relative;
  width:100%;max-width:760px;
  background:linear-gradient(158deg,
    var(--enamel-teal) 0%, var(--enamel-teal-2) 45%, var(--enamel-teal-3) 100%);
  border:0;border-radius:var(--radius-panel);padding:24px;
  box-shadow:0 0 0 1.5px var(--wire), 0 0 0 5px rgba(6,36,48,.5), var(--shadow-deep);
  transition:filter .55s ease, transform .55s ease, opacity .4s ease;
}
/* A cream mat and a wire around it, drawn with box-shadow spread rather than
   padding: #pinLayer places pins as percentages of .map-inner, so padding here
   would push every pin off its landmark. box-shadow takes no layout space. */
.map-inner{
  position:relative;background:var(--paper);
  border:0;border-radius:4px;overflow:hidden;
  box-shadow:0 0 0 8px var(--paper), 0 0 0 9.5px var(--wire);
}
.map-inner img{width:100%;display:block;}
/* An enamel disc with a gold wire, not a map-app marker: no glow, no pulse. */
.pin{
  position:absolute;transform:translate(-50%,-50%);
  width:32px;height:32px;
  border:0;border-radius:50%;padding:0;
  background:linear-gradient(150deg, var(--coral), var(--coral-2));
  box-shadow:0 0 0 2px var(--wire), 0 4px 10px rgba(0,0,0,.5);
  color:#FFF1EA;
  font-family:var(--font-ui);font-weight:800;font-size:.85rem;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  text-shadow:0 1px 1px rgba(0,0,0,.45);
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.pin:hover, .pin.active{
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  color:var(--enamel-mid);
  text-shadow:none;
  transform:translate(-50%,-50%) scale(1.16);
  box-shadow:0 0 0 2px var(--cream), 0 6px 14px rgba(0,0,0,.55);
}
.compass{
  position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:50%;
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  border:0;
  box-shadow:0 0 0 1.5px var(--wire), inset 0 1px 0 rgba(255,255,255,.45);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-ui);font-weight:800;color:var(--enamel-mid);font-size:.72rem;
}
.map-legend{font-family:var(--font-ui);font-size:.76rem;color:var(--mint);margin-top:.9rem;text-align:center;opacity:.85;}
```

- [ ] **Step 2: Location popout**

`.location-card` is already an enamel plate from Task 3. Replace the remaining rules in that section:

```css
.location-overlay{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:1.5rem;pointer-events:none;}
.location-backdrop{position:absolute;inset:0;background:rgba(4,22,30,0);transition:background .5s ease;}
.location-overlay.open{pointer-events:auto;}
.location-overlay.open .location-backdrop{background:rgba(4,22,30,.78);backdrop-filter:blur(5px);}
.location-card{
  width:100%;max-width:640px;max-height:86vh;overflow-y:auto;
  padding:2rem 2.1rem 2.2rem;
  transform:scale(.82) translateY(24px);opacity:0;
  transition:transform .5s cubic-bezier(.2,.85,.25,1), opacity .35s ease;
}
.location-overlay.open .location-card{transform:scale(1) translateY(0);opacity:1;}
.location-close{
  position:sticky;top:0;z-index:2;float:right;margin:-.4rem -.4rem .6rem 1rem;
  padding:.45rem 1.05rem;font-size:.78rem;
  cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;
}
.panel{min-height:180px;clear:both;}
.panel .placeholder{color:var(--mint);font-style:italic;text-align:center;padding:3rem 1rem;}
.panel h2{font-family:var(--font-display);font-weight:900;color:var(--cream);margin:0 0 .1rem;font-size:1.5rem;}
.panel .chinese{color:var(--gold);opacity:.9;font-size:.95rem;margin-bottom:1rem;}
.panel .story{font-family:var(--font-body);color:#E7F4F2;}
.panel .story p{margin:0 0 .9em;}
.william-toggle{
  display:flex;align-items:center;gap:.5rem;
  font-family:var(--font-ui);font-size:.78rem;color:var(--mint);
  justify-content:flex-end;margin:0 0 .8rem;clear:both;
}
/* William gets the coral enamel inset — same plate as the facts quotes. */
.william-box{
  margin-top:1.1rem;
  background:linear-gradient(160deg, var(--coral), #A82C24);
  border:0;border-radius:13px;
  box-shadow:0 0 0 1.5px var(--wire), inset 0 1px 0 rgba(255,255,255,.3);
  padding:.9rem 1.05rem;
  font-family:var(--font-body);font-size:.9rem;color:#FFF1EA;
}
.william-box b{color:#FFE07A;}
```

- [ ] **Step 3: Photo thumbs**

Delete the whole `.photo-thumb::before` album-corner rule (the 10-line block containing the two `%3Csvg` corner triangles) — a paper photo corner makes no sense on an enamel mount. Then replace the rest:

```css
/* ---------- Photo thumbs (used in popout + gallery page) ---------- */
.photo-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(130px,1fr));gap:1.1rem;margin-top:1.5rem;}
.photo-thumb{
  position:relative;cursor:pointer;overflow:visible;
  border:0;border-radius:12px;
  padding:6px 6px 3px;
  background:linear-gradient(158deg, var(--enamel-teal-2), var(--enamel-teal-3));
  box-shadow:0 0 0 1.5px var(--wire), 0 0 0 4px rgba(6,36,48,.5), var(--shadow-lift);
  text-align:left;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s ease;
}
.photo-thumb:hover{
  transform:translateY(-5px) rotate(-1deg) scale(1.02);
  box-shadow:0 0 0 1.5px var(--gold), 0 0 0 4px rgba(6,36,48,.5), var(--shadow-soft);
}
.photo-thumb img,
.photo-thumb video{aspect-ratio:4/3;object-fit:cover;width:100%;display:block;border-radius:7px;}
.photo-thumb .cap{padding:.5rem .3rem .25rem;font-family:var(--font-body);font-size:.78rem;color:var(--mint);}
/* Attribution line for the few sourced photos. Sits in normal flow between the
   image and the caption rather than overlaying the picture. Plain text, not a
   link: the thumb is a <button> and a nested <a> is invalid. */
.photo-thumb .thumb-credit{
  display:block;padding:.4rem .3rem 0;
  font-family:var(--font-ui);
  font-size:.62rem;line-height:1.35;letter-spacing:.02em;
  color:var(--mint);opacity:.7;
}
/* Play badge marks a video thumb. Stays click-through so the whole thumb
   remains one button. */
.play-badge{
  position:absolute;left:50%;top:calc(50% - .9rem);transform:translate(-50%,-50%);
  z-index:2;pointer-events:none;
  width:2.7rem;height:2.7rem;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(150deg, var(--coral), var(--coral-2));
  color:#FFF1EA;font-size:1rem;
  padding-left:.18rem;
  box-shadow:0 0 0 2px var(--wire), 0 4px 10px rgba(0,0,0,.5);
  border:0;
}
.photo-empty{
  grid-column:1/-1;text-align:center;color:var(--mint);font-style:italic;
  padding:1.7rem 1.4rem;border-radius:12px;
  box-shadow:inset 0 0 0 1.5px var(--wire);
  background-image:var(--fret), var(--fret);
  background-repeat:repeat-x, repeat-x;
  background-size:20px 10px, 20px 10px;
  background-position:left top, left bottom;
  opacity:.9;
}
```

- [ ] **Step 4: Gallery filter and modal**

Replace the `Gallery page` and `Modal` sections (`.gallery-filter button` colours already come from the pill primitive in Task 3, so only the layout and sizing stay here):

```css
/* ---------- Gallery page ---------- */
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(160px,1fr));gap:1.3rem;}
.gallery-filter{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:2rem;}
.gallery-filter button{
  padding:.45rem 1.05rem;font-size:.78rem;cursor:pointer;
}

/* ---------- Modal ---------- */
.modal-overlay{position:fixed;inset:0;background:rgba(4,22,30,.86);backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;padding:1.5rem;z-index:100;}
.modal-overlay.open{display:flex;}
.modal{
  max-width:640px;width:100%;max-height:88vh;overflow-y:auto;
  box-shadow:
    0 0 0 2px var(--wire),
    0 0 0 7px rgba(6,36,48,.75),
    var(--shadow-deep),
    inset 0 1px 0 rgba(255,255,255,.34);
}
.modal img{width:100%;border-radius:var(--radius-panel) var(--radius-panel) 0 0;}
.modal video{width:100%;display:block;background:#000;max-height:70vh;border-radius:var(--radius-panel) var(--radius-panel) 0 0;}
.modal-body{padding:1.6rem 1.9rem 2.1rem;}
.modal-body h3{font-family:var(--font-display);font-weight:900;color:var(--cream);margin:.2rem 0 .8rem;font-size:1.3rem;}
.modal-body .modal-location{font-family:var(--font-ui);font-size:.72rem;color:var(--gold);text-transform:uppercase;letter-spacing:.12em;font-weight:800;margin-bottom:.35rem;}
#modalDetail{font-family:var(--font-body);color:#E7F4F2;}
/* Full CC attribution, shown only for sourced photos (the element is hidden
   otherwise, so the rule never leaves a stray divider under a family photo). */
.modal-credit{
  margin-top:1.3rem;padding-top:.8rem;border-top:1px solid rgba(217,182,90,.45);
  font-family:var(--font-ui);
  font-size:.72rem;line-height:1.5;color:var(--mint);font-style:italic;
}
.modal-credit a{color:var(--gold);}
/* Stays circular on purpose — an icon-only close is more recognisable
   as a disc than forced into the pill shape. */
.modal-close{
  position:absolute;top:.8rem;right:.8rem;z-index:3;
  width:36px;height:36px;border-radius:50%;
  background:linear-gradient(150deg, var(--coral), var(--coral-2));
  color:#FFE9DF;border:0;
  font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 0 1.5px var(--wire), 0 4px 10px rgba(0,0,0,.5);
}
.modal-close:hover{
  background:linear-gradient(150deg, #FF7A63, var(--coral));
  box-shadow:0 0 0 1.5px var(--cream), 0 4px 10px rgba(0,0,0,.5);
}
```

- [ ] **Step 5: Verify in the browser — this is the risk step**

Run: `node tools/check.mjs`
Expected: unchanged — only the `story.html` popout check failing.

Then serve the site and check all three map plans:

```bash
python3 -m http.server 8000
```

Open, in order:
- `http://localhost:8000/map.html` (Forbidden City, a pale PNG plan)
- `http://localhost:8000/map.html?trip=xian` (hand-drawn SVG)
- `http://localhost:8000/map.html?trip=great-wall` (panorama SVG; the compass must stay hidden)

Expected on each: the plan sits inside a cream mat with a gold wire around it, on the teal enamel case. **The pins must still sit exactly on their landmarks** — that is what the `box-shadow`-instead-of-padding decision protects. Compare against `git stash`-ed output if unsure.

Then click a pin (popout opens, coral William box), click a photo (modal opens), and on `?trip=great-wall` click the chairlift video thumb to confirm the play badge and modal playback still work.

- [ ] **Step 6: Commit**

```bash
git add assets/styles.css
git commit -m "Re-skin the map, location popout, photo thumbs, gallery and modal

Mats the pale map plans in cream using box-shadow spread rather than
padding, because #pinLayer positions pins as percentages of .map-inner.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Maisie's avatar

One image, used on all three trips. `Photographs/the-great-wall/maisie-portrait.jpg` is the only strong headshot in the repo, and the Xi'an folder contains no photograph of Maisie at all, so a per-trip avatar is not possible.

**Files:**
- Create: `assets/maisie-avatar.jpg`

**Interfaces:**
- Consumes: nothing.
- Produces: `assets/maisie-avatar.jpg`, a 240×240 JPEG. Task 8 references it as `assets/maisie-avatar.jpg` from `story.html` (page-relative, same directory depth).

- [ ] **Step 1: Crop and resize**

The source is 646×1400 portrait. Maisie's head runs roughly y=340 to y=720, centred near x=185, so the square below keeps her face centred with headroom and clears the strangers standing behind her on the right.

```bash
python -c "
from PIL import Image
im = Image.open('Photographs/the-great-wall/maisie-portrait.jpg')
im.crop((20, 300, 480, 760)).resize((240, 240), Image.LANCZOS).save('assets/maisie-avatar.jpg', quality=86, optimize=True)
print(Image.open('assets/maisie-avatar.jpg').size)
"
```

Expected output: `(240, 240)`

- [ ] **Step 2: Open the file and look at it**

Read `assets/maisie-avatar.jpg`. Expected: Maisie's face roughly centred, the whole head inside the frame, no other identifiable person prominent.

If a stranger's shoulder intrudes at the left edge, redo Step 1 with the crop box shifted right: `im.crop((60, 300, 520, 760))`. If the top of her hair is cut, raise the box: `im.crop((20, 270, 480, 730))`. Re-read the file after any change — do not ship an avatar you have not looked at.

- [ ] **Step 3: Check the file size**

Run: `ls -l assets/maisie-avatar.jpg`
Expected: under 30 KB. If it is larger, re-save with `quality=80`.

- [ ] **Step 4: Commit**

```bash
git add assets/maisie-avatar.jpg
git commit -m "Add Maisie's medallion avatar for the facts popout

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Facts markup and styling

**Files:**
- Modify: `story.html` — add the popout dialog after the `.facts-grid` div
- Modify: `assets/styles.css` — replace the `Ten mind-blowing facts` section

**Interfaces:**
- Consumes: `assets/maisie-avatar.jpg` from Task 7.
- Produces: the element ids Task 9's JS queries — `factOverlay`, `factClose`, `factBadge`, `factStat`, `factLabel`, `factQuote`, `factDots`, `factCount`, `factPrev`, `factNext` — and the classes `.fact-tile`, `.fact-index`, `.fact-stat`, `.fact-label`, `.fact-hint`, `.fact-dot`, plus the `data-enamel` attribute contract with values `teal | coral | jade | deep`.

- [ ] **Step 1: Add the popout to `story.html`**

Replace the facts section (currently `story.html:43-50`) with:

```html
  <!-- Ten facts for the current trip, rendered from FACTS in data.js.
       The tiles carry only the number; the fact itself lives in the popout. -->
  <section class="wide" id="facts" hidden>
    <div class="section-head reveal">
      <h2 class="section-title">10 Mind-Blowing Facts</h2>
      <p class="section-sub" id="factsSub">Things I genuinely did not believe until I checked.</p>
    </div>
    <div class="facts-grid reveal" id="factsGrid"></div>

    <!-- Opened by site.js when a tile is clicked; ←/→ step through all ten
         without closing. Unhidden by script, never by CSS alone. -->
    <div class="fact-overlay" id="factOverlay" hidden>
      <div class="fact-pop" role="dialog" aria-modal="true" aria-labelledby="factStat" data-enamel="teal">
        <button class="fact-close" id="factClose" aria-label="Close">✕</button>
        <span class="fact-badge" id="factBadge"></span>
        <div class="fact-pop-stat" id="factStat"></div>
        <div class="fact-pop-label" id="factLabel"></div>
        <div class="fact-quote-plate">
          <div class="fact-qmark" aria-hidden="true">&ldquo;</div>
          <p class="fact-quote" id="factQuote"></p>
        </div>
        <div class="fact-who">
          <img src="assets/maisie-avatar.jpg" alt="Maisie" width="46" height="46">
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
  </section>
```

- [ ] **Step 2: Replace the facts CSS**

Replace the whole `/* ---------- Ten mind-blowing facts (story page) ---------- */` section (currently `assets/styles.css:630-666`, `.facts-grid` through `.fact-text strong`) with:

```css
/* ---------- Ten mind-blowing facts (story page) ----------
   Teaser tiles carry only the number; the fact is the reward for opening the
   popout. Tiles cycle through four enamel fields by index — real cloisonné is
   polychrome, and one colour turns the grid into a spreadsheet.
   The plate, wire and lattice come from the shared .fact-tile / .fact-pop
   entries in the ORNAMENT PRIMITIVES section. */
.facts-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(170px, 1fr));
  gap:1.5rem 1.1rem;
  max-width:1100px;margin:0 auto;padding:.9rem 1.5rem 0;
}
.fact-tile{
  display:block;text-align:left;cursor:pointer;
  padding:1.2rem 1rem 1rem;
  font-family:var(--font-ui);
  transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease;
}
.fact-tile:hover, .fact-tile:focus-visible{
  transform:translateY(-6px) rotate(-1.2deg) scale(1.03);
  box-shadow:
    0 0 0 1.5px var(--gold),
    0 0 0 5px rgba(6,36,48,.5),
    0 20px 38px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.4);
}
.fact-index{
  position:absolute;top:-11px;left:14px;
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  color:var(--enamel-mid);font-weight:800;font-size:.62rem;letter-spacing:.06em;
  padding:.18rem .62rem;border-radius:var(--radius-pill);
  box-shadow:0 0 0 1.5px var(--enamel-mid), 0 4px 9px rgba(0,0,0,.45);
}
.fact-stat{
  display:block;
  font-family:var(--font-display);font-weight:900;
  font-size:clamp(1.7rem, 4.2vw, 2.1rem);line-height:1;
  color:var(--gold);overflow-wrap:anywhere;
  text-shadow:0 2px 0 rgba(0,0,0,.35);
}
.fact-label{
  display:block;margin-top:.4rem;
  font-size:.64rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  color:var(--mint);
}
.fact-hint{
  display:block;margin-top:.75rem;
  font-size:.64rem;font-weight:700;color:#FFC9BE;opacity:.62;
  transition:opacity .2s ease;
}
.fact-tile:hover .fact-hint, .fact-tile:focus-visible .fact-hint{opacity:1;}

/* Enamel fields, cycled by index in site.js. */
.fact-tile[data-enamel="coral"], .fact-pop[data-enamel="coral"]{
  background:linear-gradient(158deg, var(--coral) 0%, #C93B2E 55%, var(--coral-2) 100%);
}
.fact-tile[data-enamel="jade"], .fact-pop[data-enamel="jade"]{
  background:linear-gradient(158deg, #37A187 0%, var(--jade) 50%, var(--jade-2) 100%);
}
.fact-tile[data-enamel="deep"], .fact-pop[data-enamel="deep"]{
  background:linear-gradient(158deg, #14586B 0%, #0C4457 50%, #072E3C 100%);
}
.fact-tile[data-enamel="coral"] .fact-stat{color:#FFE07A;}
.fact-tile[data-enamel="coral"] .fact-label{color:#FFD8CE;}
.fact-tile[data-enamel="coral"] .fact-hint{color:#FFE9DF;}

/* ---- The popout ---- */
.fact-overlay{
  position:fixed;inset:0;z-index:95;
  display:grid;place-items:center;padding:1.2rem;
  background:rgba(4,22,30,.86);
  backdrop-filter:blur(5px);
}
.fact-overlay[hidden]{display:none;}
.fact-pop{
  width:min(560px, 100%);max-height:88vh;overflow-y:auto;
  padding:1.7rem 1.7rem 1.4rem;
  border-radius:20px;
  font-family:var(--font-ui);
  box-shadow:
    0 0 0 2px var(--wire),
    0 0 0 7px rgba(6,36,48,.75),
    var(--shadow-deep),
    inset 0 1px 0 rgba(255,255,255,.34),
    inset 0 -30px 60px rgba(0,0,0,.3);
  animation:factPop .38s cubic-bezier(.34,1.56,.64,1);
}
@keyframes factPop{
  from{transform:scale(.86) translateY(14px);opacity:0;}
  to{transform:none;opacity:1;}
}
.fact-close{
  position:absolute;top:1rem;right:1rem;z-index:3;
  width:34px;height:34px;border-radius:50%;border:0;cursor:pointer;
  background:linear-gradient(150deg, var(--coral), var(--coral-2));
  color:#FFE9DF;font-size:.95rem;font-weight:700;
  box-shadow:0 0 0 1.5px var(--wire), 0 4px 10px rgba(0,0,0,.5);
}
.fact-badge{
  display:inline-block;
  background:linear-gradient(150deg, var(--gold), var(--gold-2));
  color:var(--enamel-mid);font-weight:800;font-size:.64rem;letter-spacing:.1em;
  text-transform:uppercase;padding:.3rem .8rem;border-radius:var(--radius-pill);
  box-shadow:0 0 0 1.5px var(--enamel-mid), 0 4px 10px rgba(0,0,0,.45);
}
.fact-pop-stat{
  font-family:var(--font-display);font-weight:900;
  font-size:clamp(2.4rem, 9vw, 3.6rem);line-height:1;
  color:var(--gold);margin-top:.85rem;overflow-wrap:anywhere;
  text-shadow:0 3px 0 rgba(0,0,0,.35);
}
.fact-pop-label{
  color:var(--mint);font-size:.7rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;margin-top:.35rem;
}
/* The quote sits on its own coral enamel inset, the same plate as William's
   box on the map — it is Maisie talking, not body copy. */
.fact-quote-plate{
  margin-top:1.15rem;padding:1rem 1.1rem 1.05rem;
  border-radius:15px;
  background:linear-gradient(160deg, var(--coral), #A82C24);
  box-shadow:0 0 0 1.5px var(--wire), 0 10px 24px rgba(0,0,0,.4),
             inset 0 1px 0 rgba(255,255,255,.3);
}
.fact-qmark{font-family:var(--font-display);font-size:2.6rem;line-height:.6;color:#FFD3C7;opacity:.55;}
.fact-quote{
  font-family:var(--font-body);font-size:.96rem;line-height:1.62;
  color:#FFF1EA;margin:.2rem 0 0;
}
.fact-quote strong{color:#FFE07A;}
.fact-who{display:flex;align-items:center;gap:.7rem;margin-top:1rem;}
.fact-who img{
  width:46px;height:46px;border-radius:50%;object-fit:cover;
  box-shadow:0 0 0 2px var(--wire), 0 0 0 5px rgba(6,36,48,.55);
}
.fact-who b{display:block;color:#FFF3D6;font-size:.8rem;}
.fact-who span span{color:#FFC9BE;font-size:.68rem;}
.fact-foot{display:flex;align-items:center;gap:.75rem;margin-top:1.3rem;}
.fact-arrow{
  width:40px;height:40px;border-radius:50%;border:0;cursor:pointer;
  font-size:1rem;font-weight:800;
  background:linear-gradient(var(--gold), var(--gold-2));
  color:var(--enamel-mid);
  box-shadow:0 0 0 1.5px var(--enamel-mid), 0 5px 0 var(--gold-deep);
  transition:transform .12s ease, box-shadow .12s ease;
}
.fact-arrow:active{
  transform:translateY(4px);
  box-shadow:0 0 0 1.5px var(--enamel-mid), 0 1px 0 var(--gold-deep);
}
.fact-dots{display:flex;gap:.35rem;margin:0 auto;}
.fact-dot{
  width:8px;height:8px;border-radius:50%;cursor:pointer;
  background:rgba(245,237,216,.28);
  transition:transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.fact-dot.on{background:var(--gold);transform:scale(1.45);box-shadow:0 0 9px var(--gold);}
.fact-count{color:var(--mint);font-size:.7rem;font-weight:700;letter-spacing:.08em;}
```

- [ ] **Step 3: Verify the markup check goes green**

Run: `node tools/check.mjs`
Expected: **all checks pass**, including `ok    story.html carries the facts popout markup`.

- [ ] **Step 4: Look at it**

Open `story.html`. Expected: the facts grid still renders the **old** cards (Task 9 has not run yet), so it will look wrong — unstyled `.fact-card` markup against the new rules. The popout is not visible because `#factOverlay` is `hidden`. That is correct at this stage.

- [ ] **Step 5: Commit**

```bash
git add story.html assets/styles.css
git commit -m "Add the facts popout markup and the enamel tile styling

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: The facts interaction

Rewrite the facts IIFE. Everything that guards the section today — the `hidden` reveal, the `#factsSub` sentence, the `#facts` scroll-pin and the `#factsJump` wiring — is carried over unchanged; the tile rendering is replaced and the popout, keyboard handling, focus trap and count-up are new.

**Files:**
- Modify: `assets/site.js:138-213` (the facts IIFE)

**Interfaces:**
- Consumes: the ids and classes from Task 8; `FACTS`, `CURRENT_TRIP` from the module scope.
- Produces: nothing other IIFEs use. The block stays self-contained and guards on `document.getElementById("factsGrid")`, so the other four pages are unaffected.

- [ ] **Step 1: Replace the IIFE**

Replace `assets/site.js` lines 138-213 — the whole block from the `/* ---------- Ten mind-blowing facts (story page) ----------` comment through its closing `})();` — with:

```js
/* ---------- Ten mind-blowing facts (story page) ----------
   Teaser tiles show only the number. The fact itself lives in a popout you
   step through with ←/→ without closing, so reading all ten is one gesture
   rather than ten. The section is hidden in the markup and only revealed if
   the current trip actually has facts, so a trip without them doesn't leave
   an empty heading. */
(function(){
  const grid = document.getElementById("factsGrid");
  if(!grid || typeof FACTS === "undefined" || !CURRENT_TRIP) return;
  const facts = FACTS[CURRENT_TRIP.id];
  if(!facts || !facts.length) return;

  /* Four enamel fields, cycled by index. Real cloisonné is polychrome, and a
     grid of identical tiles reads as a spreadsheet. */
  const ENAMELS = ["teal", "coral", "jade", "deep"];

  grid.innerHTML = facts.map((f, i)=>`
    <button class="fact-tile" data-index="${i}" data-enamel="${ENAMELS[i % ENAMELS.length]}">
      <span class="fact-index">${String(i + 1).padStart(2, "0")}</span>
      <span class="fact-stat" data-stat="${f.stat}">${f.stat}</span>
      <span class="fact-label">${f.label}</span>
      <span class="fact-hint">tap to find out →</span>
    </button>
  `).join("");

  const sub = document.getElementById("factsSub");
  if(sub) sub.textContent = `Ten things about ${CURRENT_TRIP.name} I genuinely did not believe until I checked.`;

  const section = document.getElementById("facts");
  section.hidden = false;

  /* The section starts hidden, so the browser can't honour a #facts fragment on
     first paint — there's nothing to scroll to yet. Redo the jump by hand once
     it's revealed, then again after load: images and the reveal animations
     change the page height after first paint, and a jump made before that
     settles lands several hundred pixels off.

     `behavior:"auto"` is deliberate: the stylesheet sets scroll-behavior:smooth,
     and an animated jump started during load gets cancelled partway, leaving you
     at the top of the page. An instant jump can't be interrupted. scrollIntoView
     (rather than scrollTo) is used so #facts's scroll-margin-top keeps the
     heading clear of the sticky nav. */
  if(location.hash === "#facts"){
    /* Landing here from another page is surprisingly awkward to get right: the
       section is revealed by script (so there's nothing for the browser's own
       fragment handling to find), and the big CJK webfonts land after load and
       reflow the long intro above it by several hundred pixels. A single jump
       at any one moment therefore lands short, long, or not at all depending on
       what has finished loading.

       So rather than guess the right moment, re-assert the position every frame
       for a short window and stop the instant the reader takes over. */
    const jumpToFacts = ()=> section.scrollIntoView({ block:"start", behavior:"auto" });
    let settled = false;
    const release = ()=>{ settled = true; };
    // pointerdown covers a scrollbar drag, which fires none of the others and
    // would otherwise be fought by the pin for the rest of the window.
    ["wheel","keydown","pointerdown","touchstart"].forEach(e =>
      window.addEventListener(e, release, { once:true, passive:true }));

    const until = Date.now() + 1200;
    (function pin(){
      if(settled) return;
      jumpToFacts();
      if(Date.now() < until) requestAnimationFrame(pin);
    })();
  }

  /* The jump link lives above the fold; hide it if there's nothing to jump to. */
  const jump = document.getElementById("factsJump");
  if(jump){
    jump.hidden = false;
    /* Supplement the browser's own fragment jump rather than replacing it — no
       preventDefault, so if this scroll ever fails the plain anchor still works
       and the button can't end up dead. It's here because clicking the link
       when the URL already ends in #facts is a same-fragment navigation, which
       browsers ignore; without this the button would do nothing on the second
       press, or when arriving via the nav's "10 Facts" link. */
    jump.addEventListener("click", ()=>{
      section.scrollIntoView({ block:"start" });
    });
  }

  /* ---- Count the stats up when the grid first comes into view ----
     Only the leading number animates; any suffix ("52 m", "19 million") is
     re-appended every frame so the tile never changes shape mid-count. This is
     a content change rather than a CSS animation, so the stylesheet's
     prefers-reduced-motion blanket can't suppress it — it needs its own guard. */
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el){
    const raw = el.dataset.stat;
    const parts = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    if(!parts) return;                                   // e.g. a purely verbal stat
    const target = parseFloat(parts[1].replace(/,/g, ""));
    if(!isFinite(target)) return;
    const suffix = parts[2];
    const decimals = (parts[1].split(".")[1] || "").length;
    const DURATION = 900;
    const started = performance.now();
    (function frame(now){
      const t = Math.min(1, (now - started) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      if(t < 1){
        el.textContent = (target * eased).toLocaleString("en-GB", {
          minimumFractionDigits:decimals, maximumFractionDigits:decimals
        }) + suffix;
        requestAnimationFrame(frame);
      } else {
        el.textContent = raw;                            // land on the exact string
      }
    })(started);
  }
  if(!REDUCED && "IntersectionObserver" in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        obs.unobserve(e.target);                         // count once, never again
        countUp(e.target);
      });
    }, {threshold:0.4});
    grid.querySelectorAll(".fact-stat").forEach(el=>io.observe(el));
  }

  /* ---- The popout ----
     Guarded separately so a page served from an older cache still gets working
     tiles, a revealed section and a working jump link. */
  const overlay = document.getElementById("factOverlay");
  const pop = overlay && overlay.querySelector(".fact-pop");
  if(!overlay || !pop) return;

  const elBadge = document.getElementById("factBadge");
  const elStat  = document.getElementById("factStat");
  const elLabel = document.getElementById("factLabel");
  const elQuote = document.getElementById("factQuote");
  const elCount = document.getElementById("factCount");
  const elDots  = document.getElementById("factDots");
  const btnPrev = document.getElementById("factPrev");
  const btnNext = document.getElementById("factNext");
  const btnClose = document.getElementById("factClose");

  let index = 0;
  let lastFocused = null;

  elDots.innerHTML = facts.map((f, i)=>
    `<span class="fact-dot" data-index="${i}"></span>`).join("");

  function draw(){
    const f = facts[index];
    elBadge.textContent = `Fact ${String(index + 1).padStart(2, "0")} of ${facts.length}`;
    elStat.textContent  = f.stat;
    elLabel.textContent = f.label;
    // The opening quote mark is its own element in the markup; this closes it.
    elQuote.innerHTML   = f.text + "”";
    elCount.textContent = `${index + 1} / ${facts.length}`;
    pop.dataset.enamel  = ENAMELS[index % ENAMELS.length];
    Array.prototype.forEach.call(elDots.children, (dot, i)=>
      dot.classList.toggle("on", i === index));
  }

  function openFact(i){
    index = i;
    draw();
    lastFocused = document.activeElement;
    overlay.hidden = false;
    /* Replay the spring even if the overlay was somehow already open — reading
       the offsetHeight is what forces the restart. */
    pop.style.animation = "none";
    void pop.offsetHeight;
    pop.style.animation = "";
    btnClose.focus();
  }

  function closeFact(){
    if(overlay.hidden) return;
    overlay.hidden = true;
    if(lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }

  /* Wraps rather than stopping at either end — ten facts is a loop, not a
     queue, and a dead arrow at fact 10 reads like a bug. */
  function step(delta){
    index = (index + delta + facts.length) % facts.length;
    draw();
  }

  grid.addEventListener("click", e=>{
    const tile = e.target.closest(".fact-tile");
    if(tile) openFact(parseInt(tile.dataset.index, 10));
  });
  btnPrev.addEventListener("click", ()=>step(-1));
  btnNext.addEventListener("click", ()=>step(1));
  btnClose.addEventListener("click", closeFact);
  elDots.addEventListener("click", e=>{
    const dot = e.target.closest(".fact-dot");
    if(!dot) return;
    index = parseInt(dot.dataset.index, 10);
    draw();
  });
  overlay.addEventListener("click", e=>{ if(e.target === overlay) closeFact(); });

  /* Keyboard is bound to the overlay rather than the document: focus is moved
     inside on open and trapped there, so this can't fire while the reader is
     elsewhere on the page, and it can't collide with another page's Escape
     handler. */
  const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  overlay.addEventListener("keydown", e=>{
    if(e.key === "Escape"){ closeFact(); return; }
    if(e.key === "ArrowRight"){ e.preventDefault(); step(1); return; }
    if(e.key === "ArrowLeft"){ e.preventDefault(); step(-1); return; }
    if(e.key !== "Tab") return;
    const items = Array.prototype.filter.call(
      pop.querySelectorAll(FOCUSABLE), el => el.offsetParent !== null);
    if(!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
})();
```

- [ ] **Step 2: Verify the script still parses**

Run: `node tools/check.mjs`
Expected: all checks pass, including `ok    site.js parses`.

- [ ] **Step 3: Test the interaction in the browser**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/story.html` and work through every one of these:

| Check | Expected |
|---|---|
| Tile contents | number, label, "tap to find out →" — **no fact text on the tile** |
| Tile colours | cycle teal, coral, jade, deep, teal… |
| Scroll the grid into view | each stat counts up from zero once, then lands on the exact string (`1,000,000`, `52 m`, `19 million`) |
| Scroll away and back | stats do **not** re-count |
| Click a tile | popout springs in on that fact, quote in coral, Maisie's medallion below |
| → button ×10 | wraps from fact 10 to fact 1 |
| ← button from fact 1 | wraps to fact 10 |
| ArrowRight / ArrowLeft keys | same as the buttons |
| Dots | the active dot is gold and larger; clicking one jumps to that fact |
| Tab repeatedly | focus cycles inside the popout and never escapes to the page behind |
| Escape | closes; focus returns to the tile you opened |
| ✕ | closes |
| Click the dark backdrop | closes |
| Click inside the popout | does **not** close |

- [ ] **Step 4: Test the guards that must not have regressed**

| Check | URL | Expected |
|---|---|---|
| Facts hidden for a factless trip | any trip with no `FACTS` entry | no facts heading, no jump button (all three trips currently have facts — confirm by temporarily commenting a `FACTS` key out, then restoring it) |
| Anchor jump | `story.html#facts` | lands on the facts heading after the webfonts load, not at the top |
| Jump button | click `🤯 Jump to the 10 Mind-Blowing Facts ↓` twice | scrolls both times |
| Nav "10 Facts" link | from `gallery.html?trip=xian` | opens `story.html?trip=xian#facts` at the facts section, showing **Xi'an** facts |
| Reduced motion | OS "reduce motion" on | stats show their final value immediately, no count-up, no spring |

- [ ] **Step 5: Commit**

```bash
git add assets/site.js
git commit -m "Rewrite the facts as teaser tiles with an interactive popout

Tiles carry only the number; the fact opens in a dialog you step through
with the arrows or the arrow keys, wrapping at either end. Stats count up
once on scroll-into-view, guarded by matchMedia because a content change
can't be suppressed by the stylesheet's reduced-motion blanket.

The #facts scroll-pin, the hidden-until-populated guard and the jump
button are carried over unchanged.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Mobile, contrast and the legacy token cleanup

**Files:**
- Modify: `assets/styles.css` — the mobile media query at the end, plus the `:root` legacy alias block

**Interfaces:**
- Consumes: everything from Tasks 2-9.
- Produces: a stylesheet with no legacy token names left.

- [ ] **Step 1: Extend the mobile block**

Add these rules inside the existing `@media (max-width:600px)` block at the end of `assets/styles.css`:

```css
  .facts-grid{grid-template-columns:repeat(auto-fit, minmax(140px,1fr));gap:1.4rem .8rem;padding:.9rem 1rem 0;}
  .fact-tile{padding:1.1rem .85rem .9rem;}
  .fact-overlay{padding:.6rem;}
  .fact-pop{padding:1.4rem 1.15rem 1.1rem;max-height:92vh;}
  .fact-pop-stat{font-size:2.5rem;}
  .fact-foot{gap:.5rem;margin-top:1.1rem;}
  .fact-arrow{width:36px;height:36px;}
  .fact-count{display:none;}   /* the dots already say where you are */
  .fact-who img{width:40px;height:40px;}
  .family-grid{grid-template-columns:repeat(auto-fit, minmax(150px,1fr));gap:1.1rem;}
  .bonus-feature{padding:1.1rem;}
```

Then update two existing rules in that same block, which still assume the old pin and card sizes:

```css
  .pin{width:30px;height:30px;font-size:.8rem;}
```

```css
  .location-card{max-width:100%;max-height:100vh;height:100vh;border-radius:0;padding:1.3rem 1.2rem 2rem;box-shadow:none;}
```

- [ ] **Step 2: Remove the legacy token aliases**

First find every remaining usage:

```bash
grep -n -- "--lacquer\|--vermillion\|--gold-bright\|--gold-dim\|--seal-ink" assets/styles.css
```

Expected: only the nine definitions inside the `/* ---- Legacy aliases ---- */` block. If any *usage* is listed, replace it with the equivalent new token before continuing:

| Legacy | Replace with |
|---|---|
| `var(--lacquer)` | `var(--enamel-deep)` |
| `var(--lacquer-2)` | `var(--enamel-mid)` |
| `var(--vermillion)` | `var(--coral)` |
| `var(--vermillion-dark)` | `var(--coral-2)` |
| `var(--vermillion-bright)` | `#FF7A63` |
| `var(--gold-bright)` | `var(--gold)` |
| `var(--gold-dim)` | `var(--wire)` |
| `var(--seal-ink)` | `var(--coral)` |
| `var(--seal-ink-dark)` | `var(--coral-2)` |

Then delete the whole legacy alias block from `:root` — the comment header and the nine declarations.

Re-run the grep. Expected: no output at all.

- [ ] **Step 3: Check contrast**

Measure, don't eyeball. The pairs that matter, against the enamel field they sit on:

| Foreground | Background | Minimum |
|---|---|---|
| `--mint` `#8FE3DE` | `--enamel-teal-2` `#106072` | 4.5:1 (body/label text) |
| `--cream` `#F5EDD8` | `--enamel-teal-2` `#106072` | 4.5:1 |
| `--gold` `#F5C542` | `--enamel-teal-2` `#106072` | 3:1 (large display type only) |
| `#FFF1EA` | `#A82C24` (quote plate) | 4.5:1 |
| `#FFC9BE` | `--enamel-teal-3` `#0A4757` | 4.5:1 |
| `--mint` `#8FE3DE` | `--jade` `#2E8B72` | 4.5:1 |

Compute them:

```bash
python -c "
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def ratio(a,b):
    l1,l2=sorted((lum(a),lum(b)),reverse=True)
    return (l1+0.05)/(l2+0.05)
for fg,bg,need in [('#8FE3DE','#106072',4.5),('#F5EDD8','#106072',4.5),
                   ('#F5C542','#106072',3.0),('#FFF1EA','#A82C24',4.5),
                   ('#FFC9BE','#0A4757',4.5),('#8FE3DE','#2E8B72',4.5)]:
    r=ratio(fg,bg)
    print(f'{fg} on {bg}: {r:.2f}  need {need}  {\"PASS\" if r>=need else \"FAIL\"}')
"
```

Any `FAIL`: darken the background token or lighten the foreground until it passes, then re-run. Record the final values in the commit message.

- [ ] **Step 4: Verify**

Run: `node tools/check.mjs`
Expected: all checks pass.

Open `story.html` and `map.html` at a 375px-wide viewport. Expected: the facts grid is two columns, the popout fills the screen with the count hidden, the location popout is full-height.

- [ ] **Step 5: Commit**

```bash
git add assets/styles.css
git commit -m "Add the mobile rules for the new components and drop the legacy tokens

Contrast measured for mint/cream/gold on the enamel fields and for the
coral quote plate; all pairs meet WCAG AA at their intended size.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Full verification pass, version bump and close-out

**Files:**
- Modify: `assets/data.js:4` (`SITE_VERSION`)
- Modify: `CLAUDE.md`
- Rename + rewrite: `docs/HANDOFF-2026-08-09-0352.md`

**Interfaces:**
- Consumes: everything.
- Produces: a pushed, live site.

- [ ] **Step 1: Bump the version**

In `assets/data.js` line 4, change:

```js
const SITE_VERSION = "1.4.1";
```

to:

```js
const SITE_VERSION = "2.0.0";
```

- [ ] **Step 2: Run the full browser matrix**

```bash
python3 -m http.server 8000
```

Fifteen page loads — five pages × three trips. For each, check the console is clean and the page renders:

```
http://localhost:8000/index.html
http://localhost:8000/story.html?trip=forbidden-city
http://localhost:8000/story.html?trip=xian
http://localhost:8000/story.html?trip=great-wall
http://localhost:8000/family.html?trip=forbidden-city
http://localhost:8000/family.html?trip=xian
http://localhost:8000/family.html?trip=great-wall
http://localhost:8000/map.html?trip=forbidden-city
http://localhost:8000/map.html?trip=xian
http://localhost:8000/map.html?trip=great-wall
http://localhost:8000/gallery.html?trip=forbidden-city
http://localhost:8000/gallery.html?trip=xian
http://localhost:8000/gallery.html?trip=great-wall
http://localhost:8000/map.html?trip=xian&loc=<any Xi'an location id>
http://localhost:8000/map.html?trip=forbidden-city&loc=imperial-garden
```

Then the regression checklist — every item is one of the documented gotchas:

| # | Check | Expected |
|---|---|---|
| 1 | Home chooser cards | each opens a **different** trip's map (the `trip=` skip check in the link rewriter) |
| 2 | Gallery "See Them on the Map" on `?trip=great-wall` | opens the **Great Wall** map, not the Forbidden City |
| 3 | `story.html#facts` from the nav | lands on the facts section |
| 4 | Great Wall gallery | the chairlift video thumb shows a frame plus a play badge |
| 5 | Video in the modal | plays; closing it stops the audio dead (no bleed behind the overlay) |
| 6 | Open a video, then an image | no audio continues |
| 7 | Xi'an gallery | the three sourced photos show `© <author> · <licence>` on the thumb |
| 8 | Those photos in the modal | full credit line with a working licence link |
| 9 | Family photos in the modal | **no** credit line, no stray divider |
| 10 | Map pins | sit on their landmarks on all three plans |
| 11 | Great Wall map | compass hidden |
| 12 | Xi'an and Great Wall pins | smaller and semi-transparent until hovered |
| 13 | `?trip=xian&loc=<a Forbidden City id>` | map opens normally with no popout (mismatch ignored) |
| 14 | A location with no `william` quote | no empty William box |
| 15 | Version stamp, bottom-left | reads `v2.0.0` |
| 16 | Mobile nav at 375px | ☰ opens a full-screen panel; tapping a link closes it |

Anything that fails here is a regression from this plan — fix it before continuing.

- [ ] **Step 3: Update `CLAUDE.md`**

Three edits.

(a) In the "Running it locally" section, replace:

```
There is no lint, test, or build command — verify changes by loading the pages in a browser.
```

with:

```
There is no lint or build command. There is one check script:

```bash
node tools/check.mjs
```

It asserts the structural invariants a wide edit can silently break — that
`data.js` still evaluates and its cross-references resolve, that `site.js`
parses, that the five page shells still agree on their nav/fonts/scripts, that
both copies of the photo modal are still identical, that the CSS defines every
token the stylesheet needs, and that `story.html` still carries the ids the
facts popout queries. It is not a test suite: everything visual still has to be
verified by loading the pages in a browser.
```

(b) In the `assets/styles.css` paragraph under **Architecture**, replace the description with:

```
**`assets/styles.css`** is one shared stylesheet for all pages, built around CSS
custom properties defined in `:root` — a cloisonné (景泰蓝) enamel palette: deep
teal grounds (`--enamel-deep/-mid/-teal*`), a gold wire hairline (`--wire`),
gold (`--gold`), coral (`--coral`) and jade (`--jade`) enamel fields, with
`--mint` and `--cream` for type on dark. Three Latin families —
`--font-display` (Fraunces 900), `--font-ui` (Outfit), `--font-body` (Nunito) —
plus `--font-hanzi` (Noto Serif SC), which every hanzi element names explicitly
because the Latin faces carry no CJK.

Every raised surface shares one **enamel plate** recipe in the ORNAMENT
PRIMITIVES section: a gradient field, a 1.5px gold wire, a dark setting ring, a
glaze highlight and a lattice (`--lattice`) overlay on a `::before`. That
overlay is absolutely positioned, so **direct children of a plate need
`position:relative`** or they paint underneath it — there is a grouped rule that
does this for every plate class; extend it when adding a new one. `--cloud-scroll`
is the page/hero ground pattern. The scroll panel is deliberately the one light
surface left, because it is the only block with enough prose to punish
light-on-dark. Component styles are grouped by page/feature under comment
headers, followed by a single mobile media query block at the end.

⚠️ The map's cream mat is drawn with `box-shadow` spread, not padding:
`#pinLayer` positions pins as percentages of `.map-inner`, so any padding there
shifts every pin off its landmark.
```

(c) In the bullet list describing `site.js`, replace the "10 Mind-Blowing Facts" bullet with:

```
- The "10 Mind-Blowing Facts" feature, rendered from `FACTS[CURRENT_TRIP.id]`
  (`story.html`). Tiles are teasers — index, `stat`, `label`, a hint — and
  deliberately do **not** render `text`; clicking one opens `#factOverlay`, a
  `role="dialog"` popout with the fact in quotes and Maisie's medallion
  (`assets/maisie-avatar.jpg`, one photo shared by all three trips because the
  Xi'an folder has none of her). ←/→ buttons, dots and the arrow keys step
  through all ten and wrap at either end; Escape, ✕ or a backdrop click closes
  and returns focus to the tile. Tab is trapped inside the dialog. Stats count
  up once on scroll-into-view, guarded by its own `matchMedia` check because a
  `textContent` change is not something the stylesheet's `prefers-reduced-motion`
  blanket can suppress. Tiles and the popout cycle four enamel colours via a
  `data-enamel` attribute. The section is `id="facts"` and `hidden` in the
  markup, only unhidden when the current trip actually has facts; the same guard
  reveals `#factsJump`.
```

- [ ] **Step 4: Refresh the handoff**

```bash
git mv docs/HANDOFF-2026-08-09-0352.md docs/HANDOFF-$(date +%Y-%m-%d-%H%M).md
```

Rewrite the renamed file to describe the finished state: the cloisonné re-skin shipped at `SITE_VERSION 2.0.0`, the facts popout, `tools/check.mjs` and how to run it, `assets/maisie-avatar.jpg` and where its crop came from, and the "don't regress these" list carried forward with three additions — the enamel `position:relative` child rule, the map mat's `box-shadow`-not-padding constraint, and the count-up's own reduced-motion guard.

- [ ] **Step 5: Final check and commit**

```bash
node tools/check.mjs
git remote -v          # must say china-2026, not forbidden-city-maisie
git add -A
git commit -m "Ship the cloisonne re-skin at v2.0.0

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Push and confirm live**

```bash
git push origin master
```

Wait for GitHub Pages to rebuild, then load `https://pbranfield-lab.github.io/china-2026/` and confirm the version stamp reads `v2.0.0` and the facts popout works on the live site (browser caches `styles.css` and `site.js` aggressively — hard-refresh).

---

## Deviation from the spec

One, deliberate. The spec says "the corner-bracket and seal-stamp primitives survive". This plan **deletes the corner-bracket primitive** (Task 3) and keeps only the seal stamp. Reason: the brackets drew four small gold mounts at the corners of a panel, which made sense when panels had no outline. Every plate now carries a continuous gold wire around its entire edge plus a lattice overlay — brackets on top of that are a third gold element competing for the same edge. The seal stamp survives, recoloured to coral, and still does the nav brand and hero title. Map pins leave the seal group and become enamel discs, which the spec's map section already called for.

## Notes for the implementer

- **This plan never edits `assets/data.js` except line 4.** If a task seems to need a copy change, it is wrong — stop and ask.
- **Run `node tools/check.mjs` after every task**, not just where the plan says to. It is three seconds and it catches cross-page drift immediately.
- **The stylesheet is edited by replacing named blocks, not by line number.** The line numbers in this plan were accurate when it was written and will drift as soon as Task 2 lands. Locate blocks by their comment headers and selectors.
- **If a browser check fails, do not paper over it in CSS.** The gotchas listed in the Global Constraints exist because each one was a real bug once.
