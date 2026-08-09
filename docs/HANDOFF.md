# Handoff — start here in a fresh session

Last updated 2026-08-08, end of session. Read this, then `CLAUDE.md` for the
architecture detail.

**State: the Great Wall trip is built and validated, NOT yet committed.**
Nothing has been pushed. See "Where things stand" below.

---

## What's just been done (this session)

The **Great Wall at Mutianyu** shipped as a third trip, `?trip=great-wall`.

1. **Two open questions from last session were answered by Paul:**
   - The Great Wall visual should be a **side-on ridge panorama** (chosen from
     three options).
   - **The Muslim Quarter question is settled — the family did go.** The
     merged `xian-by-night` location stands as-is, sourced photos stay. Logged
     in `docs/xian-moments.md` under "Resolved". Stop asking.
2. **82 raw photos + 1 video curated down to 27 photos + the video.** Folder
   went 392 MB → 22 MB. Raw files deleted with Paul's explicit OK. The full
   keep/drop table is in `docs/great-wall-curation.md`.
3. **Video support built** — the modal was `<img>`-only. Now handles both.
4. **`assets/great-wall-map.svg`** — hand-drawn panorama, modelled on the real
   Mutianyu "panoramic guide map" board that's in the photos.
5. **Trip data added**: `TRIPS` entry, `GREAT_WALL_INTRO`, 6 locations, 28
   `PHOTOS` entries, 10 verified facts. `SITE_VERSION` → `1.4.0`.
6. **Copy written by the `maisie` subagent**, per the project's workflow.
7. **The site was rebranded to "China 2026"** (asked for late in the session).
   The Forbidden City is no longer the theme, just `TRIPS[0]`. Changed: all five
   page titles, the nav brand (`紫` → `中`, "Maisie's Not-So-Forbidden City" →
   "China 2026"), the home `<h1>` and hanzi strip, and `family.html`'s seal
   (`紫禁城` → `中国`).
   - **The home hero subtitle is now derived from `TRIPS`** (`#heroSub`) — trip
     count as a word plus a de-duplicated city list — so the next trip won't
     leave a stale "Three trips" on the front page.
   - **`TRIPS[0]` deliberately stays `forbidden-city`**: a bare URL with no
     `?trip=` falls back to it, which is what keeps every pre-existing link
     working. That's a compatibility default, not a theme.
   - The two `Forbidden City` strings left in `map.html` are the no-JS fallback
     for `#mapImg`/`#mapLegend`, overwritten by `site.js`. They match `TRIPS[0]`,
     so they're consistent — leave them.
   - **The home hero image now rotates per visit** (Paul's call). Each trip
     carries a `hero` path and `site.js` picks one at random on load. Current
     picks: `assets/forbidden-city-hero.jpg`,
     `terracotta-warriors/city-wall-gate-tower.jpg`,
     `the-great-wall/wall-to-the-mountains.jpg` — all landscape, because the
     hero is a short full-width band and portrait shots crop badly.
     ⚠️ `map` resolves under `assets/`; `hero` is a full page-relative path.

### Two corrections worth knowing

- **The video is the chairlift ride UP, not the toboggan.** The previous
  handoff assumed toboggan. It isn't — at ~1:40 the toboggan chute is visible
  *below* the lift with a rider on it. Captions were written accordingly.
- **`ice-cream-on-the-steps.jpg` had no ice cream in it.** It's a pink handheld
  fan. Caught by the subagent reading the actual image, renamed to
  `fan-on-the-steps.jpg`. This is the second time a filename-derived caption
  would have been wrong — **always open the image.**

### Excluded on privacy grounds

`20260808_122454.jpg` was a phone screenshot of the entry ticket showing a
passenger name and partial passport digits. Deleted with the other raws, never
resized, never referenced. Check every batch for tickets/screenshots.

---

## Where things stand

```
modified:   CLAUDE.md, assets/data.js, assets/site.js, assets/styles.css,
            gallery.html, map.html, docs/xian-moments.md
new:        assets/great-wall-map.svg, docs/great-wall-curation.md,
            docs/great-wall-moments.md, Photographs/the-great-wall/ (28 files)
```

**Not yet done:**
- Not committed, not pushed.
- **Not verified in a browser.** Paul's global CLAUDE.md says to ask first
  because Playwright is token-hungry, and he hadn't answered by end of session.
  The data validator passes clean, but nothing has actually been *rendered*.
- The panorama SVG has never been looked at by a human. Pin positions were
  computed from the SVG coordinates, so they should land on the right features,
  but that's arithmetic, not eyesight.

---

## Verification checklist (not yet run)

`cd C:\Claude\China && python -m http.server 8899`

- [ ] `?trip=great-wall` renders on all five pages
- [ ] No-`?trip=` regression: every page still defaults to the Forbidden City
- [ ] Pins land on sensible features on the panorama (village, lift line, wall,
      tower, steps, chute) and don't cover the labels
- [ ] Video thumb shows a frame + ▶ badge, not a black box
- [ ] Video plays in the modal; **audio stops when the modal closes**
- [ ] Opening an image straight after a video doesn't leave the video showing
- [ ] Deep links: `map.html?trip=great-wall&loc=toboggan`
- [ ] Mismatched pair degrades: `map.html?trip=xian&loc=toboggan`
- [ ] No William boxes on Great Wall locations (there are no `william` fields)
- [ ] Family avatars don't 404 on `?trip=great-wall`
- [ ] No console errors, no horizontal overflow at 390px

---

## Data validator

Recreated this session; it caught the `const`-in-`vm` gotcha and confirms all 94
photo files resolve on disk. **It lives in the scratchpad, not the repo** —
worth moving into the repo if it's wanted permanently, but that changes the
"no build tooling" shape of the project, so ask first.

```
node <scratchpad>/validate.js C:/Claude/China
```

Checks: orphan photos, duplicate ids, per-trip duplicate `num`, missing files on
disk, untagged entries, cross-trip photo/location mismatches, empty `william`
fields, escaped HTML in facts, `type:"video"` matching the file extension,
family portraits resolving, and files on disk nothing references.

Current output: **0 errors, 3 warnings** — all pre-existing
(`treasure-gallery` has no photos, one Forbidden City fact stat is 10 chars,
20 unreferenced files in `forbidden-city/`).

Also `node --check assets/data.js assets/site.js`.

---

## Project shape

Static, no-build, multi-page HTML/CSS/JS. No tests, no bundler. Verify by
loading pages in a browser. Deployed from `master` via GitHub Pages.

- **Site:** `https://pbranfield-lab.github.io/china-2026/`
- **Repo:** `https://github.com/pbranfield-lab/china-2026`

### ⚠️ The old name still exists as a separate repo

The project was renamed from `forbidden-city-maisie` on 2026-08-09. Renaming
redirects the old `github.com` URL and git remotes automatically, but **not the
old GitHub Pages URL**, which would just 404. So a second public repo now sits
at `pbranfield-lab/forbidden-city-maisie` whose only content is a redirect page,
served as both `index.html` and `404.html` — the 404 is what catches deep paths,
since Pages serves it for anything that isn't a real file. It preserves
sub-path, query and hash, so old deep links land on the matching page.

Two consequences:

1. **`github.com/pbranfield-lab/forbidden-city-maisie` no longer redirects** to
   this repo — a repo existing at that name overrides GitHub's automatic
   redirect. It shows the stub instead. Deleting the stub restores the redirect
   and breaks the old site URL; that's the trade-off, and it was a deliberate
   choice to favour the public URL.
2. **Never push this project to the old URL.** It would go to the stub. The
   local remote was repointed at rename time — check `git remote -v` says
   `china-2026` before pushing from a fresh clone or another machine.

### The TRIPS architecture

Three trips through **one shared set of pages**, made trip-aware by `?trip=<id>`.
No `?trip=` falls back to `TRIPS[0]`, so old links still work.

- `TRIPS` — `id`, `name`, `chinese`, `city`, `icon`, `blurb`, `map`, `mapAlt`,
  `mapCredit`, `photoDir`, `intro`. **`photoDir` is separate from `id`** so URLs
  stay short (`?trip=great-wall`) while folders stay descriptive.
- `ofTrip(trip, items)` stamps `trip` onto a whole group.
- `FACTS` — keyed by trip id, ten `{stat, label, text}` each.
- Photo id prefixes: `p*` Forbidden City, `x*` Xi'an, `g*` Great Wall.

**Adding a trip is pure data.** No HTML changes — the home-page chooser renders
from `TRIPS` automatically.

### Gotchas — don't regress these

1. **`PHOTOS.indexOf(p)` in the map popout is positional.** Those thumbnails
   index into the flat global `PHOTOS`. Don't point that path at a filtered
   copy. The gallery is safe because it looks up by `id`.
2. **`FAMILY[].file` already contains its folder** — use
   `Photographs/${person.file}`, never prepend a trip dir.
3. **`photoSrc(photo)` resolves from the photo's OWN `trip`**, not the current one.
4. **Nav highlight strips the query string from both sides** before comparing.
5. **The William box only renders when `loc.william` exists.** Neither Xi'an nor
   the Great Wall has any.
6. `?loc=` is validated against `TRIP_LOCATIONS` so a mismatched pair degrades.
7. **Per-trip pin CSS** is scoped via `:root[data-trip="..."]`. Xi'an and the
   Great Wall both shrink their pins; the Great Wall also hides the compass,
   because a side-on panorama has no north.
8. `#factsSection` is `hidden` until the current trip actually has facts.
9. **`map.html` and `gallery.html` each hold their own copy of the modal
   markup.** Change one, change the other.
10. **`unloadVideo()` drops the `src`, it doesn't just pause.** A paused video
    that keeps its `src` carries on buffering and bleeds audio behind the
    closed overlay.

---

## Photo curation workflow

1. **Triage.** Contact sheets are far cheaper than opening 82 images
   individually: scale to thumbs, then `ffmpeg -start_number N -i "%03d.jpg"
   -vf "tile=4x3:margin=8:padding=6"`. **Use
   `scale=W:H:force_original_aspect_ratio=decrease` + `pad`** — plain
   `scale=W:-2` then `pad` fails on portrait shots.
   **`drawtext` segfaults on this machine** (no fontconfig) — number tiles by
   grid position instead.
2. **Then open every finalist properly with Read** before writing about it.
   Contact sheets are good enough to group and drop, not to caption. The "ice
   cream" that was a fan was legible at full size and not at thumbnail size.
3. **Propose a rename + grouping table and wait for explicit confirmation**
   before touching disk.
4. **Resize:** `-vf "scale='if(gt(iw,ih),1400,-2)':'if(gt(iw,ih),-2,1400)'" -q:v 4`
   (`-q:v 6` for anything still over ~250 KB).
5. **Deleting raws needs an explicit OK each time.**

**ffmpeg is installed but NOT on PATH:**
```
C:\Users\Paul.branfield\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe
```
`ffprobe.exe` is alongside it.

### Video

Phone video is **HEVC** — re-encode to H.264 for browser support, not just size.
204 MB → 17 MB at `scale=960:-2 -crf 30 -preset slow -c:a aac -b:a 80k
-movflags +faststart`. Add `type:"video"` to the `PHOTOS` entry.

---

## Content rules (override tone — also in CLAUDE.md)

1. **Never invent what happened on the trip.** Factual/historical copy is fine.
   Family moments, quotes and reactions are the family's to supply — omit them
   and log them in a `docs/*-moments.md` checklist.
   - *Supplied and usable:* "the toboggan down was awesome".
2. **Describe only what's in the photo.** Read the image first.
3. **Sourced photos** must not mention family and must stay factual. Three, all
   Xi'an.
4. **Facts must be true.** All ten Great Wall facts were web-verified this
   session before being written (2012 GPS survey 21,196.18 km; Ming 8,851.8 km;
   Yang Liwei; sticky-rice/amylopectin, Zhejiang Univ.; Mutianyu 5,400 m /
   23 towers / 7–8 m × 4–5 m; Xu Da 1368 on Northern Qi; toboggan 1,580 m,
   ~30 km/h; chairlift 550 m; gondola 723 m; UNESCO 1987).

**Use the `maisie` subagent** for narrative copy. It reads photos directly and
has now twice refused to assert things it couldn't verify — including catching
the fan/ice-cream error and flagging every person it named by outfit-matching.

---

## Loose ends

- **⚠️ Identities in Great Wall captions were inferred from outfits, not
  confirmed.** The table in `docs/great-wall-moments.md` lists every one. If any
  is wrong, that caption is wrong.
- **CC attribution still isn't shown on the page** — the three sourced Xi'an
  photos are credited in `CLAUDE.md` only. CC BY-SA / CC BY want visible
  attribution. Still worth a credit line in the modal or footer.
- **No William quotes and no family moments on the Great Wall trip** — by
  design. `docs/great-wall-moments.md` is the checklist.
- Empty placeholder folders: `Photographs/shanghai/`, `Photographs/xitan/`
  (the existing bonus photo says "Xitang"). Empty dirs aren't tracked by git.
- `forbidden-city/` has ~20 unreferenced image files. Pre-existing, harmless.
- `docs/terracotta-plan.md` is the superseded original Xi'an plan. Safe to
  delete, still there — never got an explicit OK.

---

## Suggested next steps

1. Verify in a browser (checklist above) — **ask Paul first**.
2. Get the identity table in `docs/great-wall-moments.md` confirmed or corrected.
3. Commit and push. Paul has been merging straight to `master` (live).
4. Chase the Great Wall family moments / William quotes.
