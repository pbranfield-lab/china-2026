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

Each trip has its own plan or panorama with numbered pins, a narrated story, a
photo gallery, and ten facts. No single trip is the site's theme — the home page
is a chooser.

## How it's built

Static HTML, CSS and vanilla JavaScript. No build step, no bundler, no
dependencies, no server-side code. Every page loads `assets/data.js` then
`assets/site.js` via plain `<script>` tags.

There is only one set of pages. They're made trip-aware by a `?trip=<id>` query
parameter, so **adding a trip is pure data** — a `TRIPS` entry, a photo folder,
a plan image, and tagged `LOCATIONS`/`PHOTOS` groups. No HTML changes.

To preview it, serve the directory with any static file server:

```bash
python3 -m http.server 8899
```

See `CLAUDE.md` for the architecture and `docs/HANDOFF.md` for current state.

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

Photographs are the family's own except for three Creative Commons images on the
Xi'an trip, credited in `CLAUDE.md`.

## Previous name

This project was called `forbidden-city-maisie` until August 2026, when it grew
past a single destination. The old GitHub Pages URL still works and forwards to
the new one.
