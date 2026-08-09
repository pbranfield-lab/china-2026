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

const AUDIO = {};

const CATS = [];
