#!/usr/bin/env node
/* ============================================================
   Repo hygiene report: files in Photographs/ and assets/ that
   nothing references. Advisory, not a failing check — an orphan
   may be content awaiting curation, but everything tracked here
   is published by GitHub Pages, so unreferenced files deserve a
   deliberate decision rather than drift.

   References are gathered from the data layer (PHOTOS, FAMILY,
   trip maps and heroes) AND from paths hard-coded in the page
   markup, CSS and site.js — family.html embeds one photo
   directly, and the stylesheet embeds the no-JS hero fallback.
   Run: node tools/orphans.mjs
   ============================================================ */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = f => readFileSync(join(ROOT, f), "utf8");

/* Same deliberate new Function-over-own-repo-files recipe as check.mjs —
   the input is this checkout's own data, nothing attacker-supplied. */
const DATA_FILES = readdirSync(join(ROOT, "assets/data")).map(f => "assets/data/" + f);
const src = DATA_FILES.map(read).join("\n") + read("assets/data.js");
const { TRIPS, PHOTOS, FAMILY } = new Function(src + ";return {TRIPS,PHOTOS,FAMILY};")();

const used = new Set();
const dirOf = id => (TRIPS.find(t => t.id === id) || {}).photoDir || "";
for (const p of PHOTOS) used.add(`Photographs/${dirOf(p.trip)}/${p.file}`.toLowerCase());
for (const f of FAMILY) used.add(`Photographs/${f.file}`.toLowerCase());
for (const t of TRIPS) {
  if (t.map) used.add(("assets/" + t.map).toLowerCase());
  if (t.hero) used.add(t.hero.toLowerCase());
}

/* Paths hard-coded outside the data layer. */
const CODE = ["index.html", "story.html", "family.html", "map.html", "gallery.html",
  "assets/site.js", "assets/styles.css"].map(read).join("\n");
for (const m of CODE.matchAll(/(?:Photographs|assets)\/[\w./-]+\.(?:jpg|jpeg|png|svg|webp|mp4)/gi))
  used.add(m[0].toLowerCase());
/* styles.css URLs are relative to assets/. */
for (const m of read("assets/styles.css").matchAll(/url\(['"]?([\w./-]+\.(?:jpg|jpeg|png|svg|webp))/gi))
  used.add(("assets/" + m[1]).toLowerCase().replace("assets/assets/", "assets/"));

function walk(dir) {
  return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
}
const MEDIA = /\.(jpg|jpeg|png|svg|webp|mp4)$/i;
const onDisk = [...walk("Photographs"), ...walk("assets")].filter(f => MEDIA.test(f));
const orphans = onDisk.filter(f => !used.has(f.toLowerCase()));

console.log(`${onDisk.length} media files on disk, ${orphans.length} unreferenced:`);
for (const f of orphans) console.log("  " + f);
if (!orphans.length) console.log("  (none — every file is referenced)");
