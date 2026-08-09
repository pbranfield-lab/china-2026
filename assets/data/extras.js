/* ============================================================
   CROSS-TRIP EXTRAS — data for the v4 interactive features.
   Loaded on every page after the trip files and before
   assets/data.js, same as a trip file. Everything here is
   trip-agnostic or spans trips, which is why it doesn't live
   in any single trip's file.

   Structures (filled in feature by feature):
   - JOURNEY:     the route page — stops (x/y % over the route
                  SVG viewBox) and legs (verified km, keyed by
                  trip id, never index).
   - TIMELINE:    dynasty ribbon eras + pinned events with the
                  "meanwhile in Britain" line. Years are signed
                  integers, negative = BC. All dates verified.
   - HANZI:       characters for the tracing playground.
   - COMPARATORS: per-trip scale toys. Declarative only — no
                  functions, check.mjs evaluates this file.
   - THEN_NOW:    historic-vs-now photo pairs. `now` is a PHOTOS
                  id; `then.file` lives under Photographs/ and
                  carries a full credit object (visible
                  attribution is required even for public
                  domain).
   - AUDIO:       per-trip ambient loops with their credits.
   - CATS:        the hidden-cat hunt, one entry per page.
   ============================================================ */

const JOURNEY = { stops: [], legs: [] };

const TIMELINE = { eras: [], events: [] };

const HANZI = [];

const COMPARATORS = {};

const THEN_NOW = [];

/* Per-trip ambient loops, all CC0 from Freesound, trimmed to 60 s mono at
   48 kbps. CC0 needs no attribution but gets it anyway — the credits render
   on play.html and the TASL details live in docs/authoring.md. */
const AUDIO = {
  "forbidden-city": { file:"assets/audio/forbidden-city.mp3",
    title:"Courtyard ambience with pigeons", author:"Garuda1982", license:"CC0",
    sourceUrl:"https://freesound.org/people/Garuda1982/sounds/851386/" },
  "xian": { file:"assets/audio/xian.mp3",
    title:"Crowd in a reverberant space", author:"craigsmith", license:"CC0",
    sourceUrl:"https://freesound.org/people/craigsmith/sounds/480728/" },
  "great-wall": { file:"assets/audio/great-wall.mp3",
    title:"Rocky mountain outdoors: wind and birds", author:"petebuchwald", license:"CC0",
    sourceUrl:"https://freesound.org/people/petebuchwald/sounds/288899/" },
  "xitang": { file:"assets/audio/xitang.mp3",
    title:"Water gently lapping at boats", author:"kyles", license:"CC0",
    sourceUrl:"https://freesound.org/people/kyles/sounds/637945/" },
  "shanghai": { file:"assets/audio/shanghai.mp3",
    title:"Street traffic noise", author:"Davor", license:"CC0",
    sourceUrl:"https://freesound.org/people/Davor/sounds/382267/" }
};

const CATS = [];
