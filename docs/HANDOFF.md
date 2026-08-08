# Handoff — start here in a fresh session

Last updated 2026-08-08, end of session. Read this, then `CLAUDE.md` for the
architecture detail.

**State: committed and clean.** The only untracked thing is
`Photographs/the-great-wall/` (deliberate — it's raw input, see below).

---

## What's just been done (this session)

1. **"10 Mind-Blowing Facts" section** on `story.html`, ten per trip, rendered
   from a new `FACTS` object in `data.js` keyed by trip id. Written in Maisie's
   voice by the `maisie` subagent. Verified rendering for both trips.
2. **Family portrait paths fixed.** Previously every portrait was pinned to
   `forbidden-city/` via a `FAMILY_PHOTO_DIR` constant. Paul corrected this:
   *"no family portraits live in the folder of where they were taken."* So
   `FAMILY[].file` is now a path **relative to `Photographs/` including the
   trip folder** (`"forbidden-city/mum.jpg"`), and `FAMILY_PHOTO_DIR` is gone.
   A portrait taken on the Great Wall would be `"the-great-wall/whoever.jpg"`.

---

## What's next (requested, NOT started)

### 1. The Great Wall (Mutianyu) trip

Raw photos are in `Photographs/the-great-wall/` — **83 files, 392 MB,
uncurated**, from 8 Aug 2026. Camera-timestamp names (`20260808_*.jpg`) plus 10
WhatsApp ones (`IMG-20260808-WA00*.jpg`). At least one duplicate-transfer pair:
`20260808_144842(0).jpg`.

- **The video is wanted.** `20260808_144628.mp4`, **204 MB**. Paul said *"there
  is a video in the section you can use this."* This is the toboggan run, most
  likely. **The modal is `<img>`-only, so video support has to be built** — see
  the recipe below. Compress before it goes anywhere near git (no LFS here).
- **Maisie's own line to use:** *"the toboggan down was awesome."* Paul supplied
  it, so it's usable copy — unlike anything else family-related.
- **Map:** Paul said *"no real need for a map but just do something creative."*
  The architecture wants a `map` image per trip and `map.html` renders
  percentage-positioned pins over it. Suggestion (unconfirmed): a hand-drawn
  **side-on panorama** of the wall over the ridges, watchtowers as the pins.
  Keeps the pin mechanism, reads as illustration not cartography. **Ask first.**
- **It needs its own 10 facts too.** Good material: total length of all
  dynasties' walls is 21,196 km per the 2012 official survey — that's roughly
  **3.8× the London–New York distance** (~5,570 km), which is close to the
  comparison Paul actually asked for. Also: it's *not* visible from space with
  the naked eye; Ming sections used **sticky-rice mortar** (amylopectin) which
  is extraordinarily strong; Mutianyu is ~5.4 km restored with 23 watchtowers,
  Ming-era on 6th-century Northern Qi foundations; beacon towers could relay a
  signal hundreds of km in hours; it's many parallel walls, not one wall.
  **Verify anything before publishing it.**

### 2. Open question Paul hasn't answered

**⚠️ The Muslim Quarter.** He said the two night photos were Ever-Bright City,
not the Muslim Quarter. Two *sourced* Muslim Quarter photos were added and both
areas merged into one location (`xian-by-night`). **If the family never actually
went to the Muslim Quarter, the live site currently implies they did.** Asked
twice, no answer. Needs splitting or those photos dropping.

---

## Project shape

Static, no-build, multi-page HTML/CSS/JS. No tests, no bundler. Verify by
loading pages in a browser. Live on `master` at
`https://github.com/pbranfield-lab/forbidden-city-maisie`.
`SITE_VERSION` is in `data.js` (one definition, one consumption site).

### The TRIPS architecture

Multiple trips through **one shared set of pages**, made trip-aware by a
`?trip=<id>` query param. No `?trip=` falls back to `TRIPS[0]`, so old links
still work.

- `TRIPS` — `id`, `name`, `chinese`, `city`, `icon`, `blurb`, `map`, `mapAlt`,
  `mapCredit`, `photoDir`, `intro`. **`photoDir` is separate from `id`** so URLs
  stay short (`?trip=xian`) while folders stay descriptive
  (`terracotta-warriors/`).
- `ofTrip(trip, items)` stamps `trip` onto a whole group, so `LOCATIONS` and
  `PHOTOS` stay flat arrays built from `...ofTrip("xian", [...])` groups.
- `FACTS` — object keyed by trip id, ten `{stat, label, text}` objects each.
- `site.js` resolves `CURRENT_TRIP` and `TRIP_LOCATIONS` once at module scope.

**Adding a trip is pure data**: a `TRIPS` entry, a photo folder, a plan image in
`assets/`, `ofTrip("<id>", [...])` groups, and a `FACTS` entry. No HTML changes —
the home-page chooser renders from `TRIPS` automatically.

### Gotchas — don't regress these

1. **`PHOTOS.indexOf(p)` in the map popout is positional.** Those thumbnails
   index into the flat global `PHOTOS`. Don't point that path at a filtered
   copy. The gallery is safe to filter because it looks up by `id`.
2. **`FAMILY[].file` already contains its folder** — use
   `Photographs/${person.file}`, never prepend a trip dir.
3. **`photoSrc(photo)` resolves from the photo's OWN `trip`**, not the current
   one.
4. **Nav highlight strips the query string from both sides** before comparing,
   because nav hrefs carry `?trip=`.
5. **The William box only renders when `loc.william` exists.** Xi'an has none.
6. `?loc=` is validated against `TRIP_LOCATIONS` so a mismatched
   `?trip=`/`?loc=` pair degrades instead of half-opening a popout.
7. **Xi'an pins are smaller/semi-transparent**, scoped via
   `:root[data-trip="xian"]` in `styles.css`, because the hand-drawn plan is
   sparse and full-size seals covered the labels. A Great Wall illustration
   will probably want the same.
8. `#factsSection` is `hidden` in the markup and only unhidden when the current
   trip actually has facts — so a factless trip doesn't leave a bare heading.

---

## Photo curation workflow (follow this again for the Great Wall)

1. **Triage** — check `(0)`-suffixed files against their twin. They're often
   *burst shots, not duplicates* — compare visually, don't assume.
2. **View every candidate** with the Read tool before writing about it.
3. **Group by content**, propose a **rename + grouping table**, and **wait for
   Paul's explicit confirmation** before touching disk.
4. **Rename + resize** to house style (~1400px long edge, 60–250 KB):
   ```
   ffmpeg -y -i IN.jpg -vf "scale='if(gt(iw,ih),1400,-2)':'if(gt(iw,ih),-2,1400)'" -q:v 4 OUT.jpg
   ```
5. **Delete unused raw files** (Xi'an went 487 MB → 3 MB). **Needs an explicit
   OK each time** — the bulk `rm` was blocked by the permission classifier until
   Paul confirmed.
6. Write `PHOTOS` entries via `ofTrip(...)`.

**ffmpeg is installed but NOT on PATH:**
```
C:\Users\Paul.branfield\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe
```
`ffprobe.exe` is alongside it.

### Video support — needs building

- **Compress first.** The Xi'an video went 128 MB → 33 MB with:
  `-vf scale=1280:-2 -c:v libx264 -preset slow -crf 27 -c:a aac -b:a 96k -movflags +faststart`
  This one is 204 MB. Phone video is likely **HEVC** — re-encode to **H.264**
  for browser support, not just for size.
- Add `type:"video"` to that `PHOTOS` entry (explicit field, not extension
  sniffing).
- `map.html` and `gallery.html` each have their **own separate copy** of the
  modal markup — both need `<video id="modalVideo" controls>` adding.
- `openPhoto()` branches on `photo.type`; **pause the video on close** or audio
  bleeds behind the closed overlay.
- Thumbnails: `<video muted preload="metadata">` as its own thumb plus a ▶ CSS
  badge, rather than a poster JPG.
- `styles.css` has `.modal img{width:100%;}` — tag-scoped, so add
  `.modal video{width:100%;display:block;}` alongside.

---

## Content rules (override tone — also in CLAUDE.md)

1. **Never invent what happened on the trip.** Factual/historical copy is fine.
   Family moments, quotes and reactions are the family's to supply — omit them
   and log them in a `docs/*-moments.md` checklist. Nothing half-written ships.
   - *Exception:* Paul supplied "the toboggan down was awesome" — usable.
2. **Describe only what's in the photo.** Read the image first. Several Xi'an
   files were misnamed and captions written from filenames were wrong; the
   `maisie` subagent caught it. Trust the picture over the filename.
3. **Sourced photos** must not mention family and must stay factual. Three so
   far: `bell-tower-day.jpg` (Wang Zhongyin, CC BY-SA 4.0),
   `muslim-quarter-great-mosque-sign.jpg` (Qianeal, CC BY-SA 4.0),
   `muslim-quarter-xiyangshi-arch.jpg` (thierrytutin, CC BY 2.0).
4. **Facts must be true** — that's the whole point of the section. The subagent
   flagged that the "1,000,000 workers" and "700,000 workers" figures are
   traditional/reported rather than verified; both now say "reportedly".

**Use the `maisie` subagent** for all narrative copy and facts. It reads photos
directly and has correctly refused to assert details it couldn't verify.

---

## Other loose ends

- **CC attribution isn't shown on the page** — the three sourced photos are
  credited in `CLAUDE.md` only. CC BY-SA / CC BY strictly want visible
  attribution. Consider a credit line in the modal or footer.
- **Xi'an has no family moments or William quotes** — by design.
  `docs/xian-moments.md` is the checklist for Paul to fill in.
- Empty placeholder folders exist: `Photographs/shanghai/` and
  `Photographs/xitan/` (note: the existing bonus photo says "Xitang"). Empty
  dirs aren't tracked by git.
- `forbidden-city/` has ~20 unreferenced image files (`3.jpg`, `37.jpg`,
  `PHOTO-2026-08-06-*.jpg`). Pre-existing, harmless, could be cleaned up.
- `docs/terracotta-plan.md` is the superseded original plan; the Xi'an work
  actually shipped per a revised plan. Safe to delete.

---

## Commands

**Preview:** `cd C:\Claude\China && python -m http.server 8899`
**Ask Paul before browser-verifying** — his global CLAUDE.md says it's
token-hungry and he may prefer to check manually.

**Data validator** (worth recreating; it caught real bugs) — loads `data.js`
via Node's `vm` module and checks: orphan photos, duplicate ids, missing files
on disk, untagged entries, escaped HTML in facts, family portraits resolving.
Lived in the scratchpad, not the repo. Also `node --check assets/site.js`.

**Verification sweep** used for Xi'an, repeat for the Great Wall: no-`?trip=`
regression on all pages, new trip renders, nav stays sticky, deep links work,
mismatched `?trip=`/`?loc=` degrades, no empty William boxes, family avatars
never 404, no console errors, no horizontal overflow at 390px.

---

## Suggested order

1. Ask about the "creative" Great Wall visual, and chase the Muslim Quarter
   question.
2. Compress the video; triage and curate the 83 photos; get the rename table
   confirmed.
3. Build video support in the modal.
4. Add the Great Wall `TRIPS` entry, locations, photos, and its 10 facts.
5. Create the Great Wall visual.
6. Bump `SITE_VERSION` to `1.3.0` last.
7. Verify, commit, push. Paul has been merging straight to `master` (live).
