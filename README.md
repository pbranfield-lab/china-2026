# China 2026

A family travel journal and photo album covering a family's 2026 trips across
China, written in character by Maisie, aged 11.

**Live site:** https://pbranfield-lab.github.io/china-2026/

## Trips

| Trip | Where | URL |
|---|---|---|
| The Forbidden City | Beijing | `?trip=forbidden-city` |
| Xi'an & the Terracotta Warriors | Xi'an | `?trip=xian` |
| The Great Wall at Mutianyu | Beijing | `?trip=great-wall` |
| Xitang Water Town | near Shanghai | `?trip=xitang` |
| Shanghai | Shanghai | `?trip=shanghai` |

Each trip has its own plan or panorama with numbered pins, a narrated story, a
photo gallery, and ten facts. No single trip is the site's theme — the home page
is a chooser.

Beyond the per-trip pages there's The Journey (a scrolling route map of the
whole itinerary plus a dynasty timeline with a "meanwhile in Britain" strip)
and The Games Bit (character tracing, a photo-guessing game, a passport that
collects stamps as you explore, and a big quiz with a two-player
pass-the-phone mode). Then & Now sliders on the story pages pair century-old
public-domain photographs with the family's own. There's also a hunt hidden
across the site; find everything and it says so.

## How it's built

Static HTML, CSS and vanilla JavaScript. No build step, no bundler, no
server-side code. Every page loads one data file per trip from
`assets/data/`, plus `assets/data/extras.js` (cross-trip data for the
interactive features), then the assembler `assets/data.js`, then
`assets/site.js`, all via plain `<script>` tags. The one vendored library is
Hanzi Writer (MIT), which powers the character tracing on the games page.

There is only one set of trip pages, made trip-aware by a `?trip=<id>` query
parameter. Adding a trip is a new `assets/data/<id>.js` file, one line in
`TRIP_MODULES`, a `<script>` tag on each page, a photo folder and a plan
image — no new pages.

To preview it, serve the directory with any static file server:

```bash
python3 -m http.server 8899
```

There is no test suite, but `node tools/check.mjs` asserts the structural
invariants a wide edit can silently break.

See `CLAUDE.md` for the architecture, and the newest `docs/HANDOFF-*.md` for
current state — the timestamp is in the filename, and there is only ever one.

## A note on the content

Two rules govern the writing, and they override the voice:

1. **Nothing about what happened on the trip is invented.** Historical and
   factual copy is written freely; specific family moments, quotes and reactions
   are only included when the family has actually supplied them. Everything
   still missing is logged in `docs/*-moments.md` rather than filled in with
   plausible-sounding filler.
2. **Captions describe what is actually in the photograph**, checked against the
   image rather than written from the filename.

The "10 Mind-Blowing Facts" on each trip are verified before publishing, and
figures that are traditional or reported rather than established are hedged as
such. That accuracy is the entire point of the section.

Photographs are the family's own except for a handful of Creative Commons
images (currently nine, across the Xi'an, Xitang and Shanghai trips) and three
public-domain historic photographs behind the Then & Now sliders. All of them
carry their author and licence on the page itself — because CC BY and CC BY-SA
require the attribution to be visible wherever the work is shown, and the
site credits public domain and CC0 sources anyway (the ambient sound loops
included).

## Previous name

This project was called `forbidden-city-maisie` until August 2026, when it grew
past a single destination. The old GitHub Pages URL still works and forwards to
the new one.
