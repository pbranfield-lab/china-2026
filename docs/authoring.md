# Authoring guide — adding content and writing in Maisie's voice

Read this **before writing or editing any copy, or adding any photo**. It is split
out of `CLAUDE.md` so it doesn't load into every session, but the two truthfulness
rules below are not optional and are repeated in `CLAUDE.md` for that reason.

## Adding content

- **New photo** — drop it into `Photographs/<photoDir>/`, add an entry to that
  trip's `photos` array in `assets/data/<trip>.js`, with a `location` matching a
  `LOCATIONS.id` on the same trip. Web-size it first: existing photos are ~1400px
  on the long edge and 60–250 KB, not raw camera dumps.
- **New video** — same, but re-encode to **H.264** first (phone video is usually
  HEVC, which most browsers won't play) and add `type:"video"`. No LFS in this
  repo, so keep it small: `chairlift-ride-up.mp4` went 204 MB → 17 MB with
  `-vf scale=960:-2 -c:v libx264 -preset slow -crf 30 -c:a aac -b:a 80k -movflags +faststart`.
  ffmpeg lives at
  `C:\Users\Paul.branfield\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe`.
- **New map location** — add to that trip's `locations` array with `x`/`y` read
  off its plan image as percentages, plus `story` copy. `william` is optional —
  omit it rather than stubbing it.
- **New trip** — create `assets/data/<id>.js` on the pattern of the existing
  three, add it to `TRIP_MODULES` in `assets/data.js`, add a `<script>` tag to all
  five pages, create `Photographs/<photoDir>/`, and add a plan image to `assets/`.
  `node tools/check.mjs` catches a missed script tag.
- **Family portraits** — place in `Photographs/forbidden-city/` and reference via
  `file` in `FAMILY`; picked up automatically on every trip. ⚠️ `file` already
  includes the trip folder — never prepend another one.

## Source material, not wired into the site

- `Guide/guide.txt` — raw exported chat notes with photo-by-photo historical
  detail, used when writing `story` / `detail` copy.
- `docs/xian-moments.md`, `docs/great-wall-moments.md` — the family anecdotes and
  William quotes still missing from those trips. The Great Wall one flags which
  people were identified by outfit-matching rather than confirmed, so check it
  before trusting a name in a caption.
- `docs/great-wall-curation.md` — which 27 of the 82 raw Great Wall files were
  kept, and why.
- `docs/maisie-voice-interview.md` — the grounding source for the voice.

## Content voice

All copy — trip intros, `story` / `william`, photo `caption` / `detail` — is
Maisie's first-person, wry-11-year-old voice, with recurring bits (Mum as "Queen
of China," William's deadpan one-liners, Dad's obsessive photo-taking). Match it
rather than reverting to neutral museum-guide text. The `maisie` subagent writes
in it.

**Two rules on truthfulness, which override tone:**

1. **Don't invent what happened on the trip.** Factual/historical copy about a
   place is fine to write. Specific family moments, quotes and reactions are the
   family's to supply — leave them out and log them in a `docs/*-moments.md`
   checklist instead. Nothing half-written ships: omit the field rather than
   stubbing it.
2. **Describe only what's actually in the photo.** Open the image before writing
   its caption. Several Xi'an files were misnamed, and captions written from the
   filename rather than the picture were wrong.

## Sourced (non-family) photos

Must not mention any family member, and must stay factual. Currently three, all
Xi'an:

| File | Author | Licence |
|---|---|---|
| `bell-tower-day.jpg` | Wang Zhongyin | CC BY-SA 4.0 |
| `muslim-quarter-great-mosque-sign.jpg` | Qianeal | CC BY-SA 4.0 |
| `muslim-quarter-xiyangshi-arch.jpg` | thierrytutin | CC BY 2.0 |

The Great Wall trip is entirely family photos. Each sourced photo carries a
`credit` object so the attribution renders on the page — **a new sourced photo
needs one; listing it in a doc is not sufficient**, because CC BY / BY-SA require
the attribution to be visible wherever the work is shown.

The `credit` objects still have no `source` URL: the originals' URLs were never
recorded, so full TASL attribution remains incomplete.

## Privacy

Curation must drop anything that isn't a photograph of a place. The raw Great Wall
set included a phone screenshot of the entry ticket showing a name and partial
passport digits — excluded rather than resized. Check for screenshots, tickets and
boarding passes before publishing a batch.
