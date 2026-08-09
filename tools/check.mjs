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
   actually works.

   Yes, this is `new Function` over file contents. The input is this repo's own
   data.js, read from disk, in a script only ever run by hand from a checkout —
   nothing here is attacker-supplied or reachable at runtime by the shipped
   site. Static scanners flag the pattern; it is deliberate and contained. */
const DATA_FILES = [
  "assets/data/forbidden-city.js",
  "assets/data/xian.js",
  "assets/data/great-wall.js",
  "assets/data.js"                 // the assembler; must come last
];

function loadData(){
  const src = DATA_FILES.map(read).join("\n");
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

check("every trip file is loaded, in order, before site.js", () => {
  for (const p of PAGES){
    const s = read(p);
    const at = f => s.indexOf(`src="${f}"`);
    const positions = DATA_FILES.map(at);
    if (positions.some(i => i < 0))
      return `${p} is missing: ${DATA_FILES.filter((f, i) => positions[i] < 0).join(", ")}`;
    // The assembler reads the trip consts, so every trip file must precede it.
    const assembler = positions[positions.length - 1];
    if (positions.slice(0, -1).some(i => i > assembler))
      return `${p} loads assets/data.js before one of its trip files`;
    const site = at("assets/site.js");
    if (site < 0) return `${p} is missing assets/site.js`;
    if (assembler > site) return `${p} loads site.js before the data assembler`;
  }
  return null;
});

check("every trip in TRIP_MODULES has its own data file", () => {
  const { TRIPS } = loadData();
  const declared = DATA_FILES.slice(0, -1).map(f => f.split("/").pop().replace(".js", ""));
  const missing = TRIPS.map(t => t.id).filter(id => !declared.includes(id));
  return missing.length
    ? `no assets/data/<id>.js for: ${missing.join(", ")} (or check.mjs's DATA_FILES is stale)`
    : null;
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
  const need = ["--paper","--paper-dark","--cream","--ink","--ink-soft",
    "--red","--red-deep","--red-bright","--gold","--gold-deep","--jade","--jade-deep",
    "--blue","--blue-deep","--pop","--pop-big","--pop-soft","--tape",
    "--font-display","--font-ui","--font-body","--font-hanzi","--radius-panel",
    "--radius-pill","--cloud-scroll","--fret","--fret-v"];
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

check("the quiz and teaser containers are in place", () => {
  const s = read("story.html");
  const missing = ["quiz","quizSub","quizCard"].filter(id => !s.includes(`id="${id}"`));
  if (missing.length) return `story.html missing ids: ${missing.join(", ")}`;
  if (!/<section class="wide" id="quiz" hidden>/.test(s)) return "#quiz is no longer hidden in the markup";
  const i = read("index.html");
  const missingI = ["teaser","teaserCard"].filter(id => !i.includes(`id="${id}"`));
  if (missingI.length) return `index.html missing ids: ${missingI.join(", ")}`;
  return null;
});

check("FACTS are well formed and belong to a real trip", () => {
  const { TRIPS, FACTS } = loadData();
  const ids = new Set(TRIPS.map(t => t.id));
  for (const [trip, list] of Object.entries(FACTS)){
    if (!ids.has(trip)) return `FACTS has no matching trip: ${trip}`;
    list.forEach((f, i) => {
      if (!f.stat || !f.label || !f.text) throw new Error(`${trip}[${i}] is missing a field`);
      /* CLAUDE.md says "keep it under ~9 characters" — approximate, and
         "19 million" (10) ships live and renders fine. 12 is the point where
         the headline actually starts wrapping badly. */
      if (f.stat.length > 12) throw new Error(`${trip}[${i}].stat "${f.stat}" is too long to headline`);
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
