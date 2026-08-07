# Xi'an — the family moments still to fill in

The Xi'an trip ships with the **factual/historical copy complete** and the
**family moments deliberately left out**. Nothing on the live site says
`[TODO]` — the locations simply don't carry a family anecdote or a William
quote yet, and the site renders fine without them.

This file is where those bits live until they're written. Fill in whatever you
actually remember; skip anything you don't. Made-up moments are worse than no
moments.

## How to add one once you've written it

- **A William one-liner** → add a `william:` field to that location in the
  `ofTrip("xian", [...])` block of `assets/data.js`:
  ```js
  william:"\"Quote goes here,\" — William, doing whatever he was doing."
  ```
  The map popout only renders the William box when the field exists, so adding
  it is all that's needed.
- **A family moment inside a location's story** → add a `<p>` to that
  location's `story` field.
- **A family moment about a specific photo** → add a `<p>` to that photo's
  `detail` field in the `PHOTOS` array.

Match the voice already there (see `docs/maisie-voice-interview.md`).

---

## 1. Terracotta Army Museum Entrance — `entrance`

Photo: the four of you under the museum sign, grey morning, water bottles out.

- What was the queue/arrival actually like?
- Did Mum do anything at the ticket desk worth recording?
- **William one-liner:** _(none yet)_

## 2. Pit 1 — `pit-1`

The big one — 6 photos, including the "Army Array" plaque and the wide rows.

- First reaction walking in and seeing the scale of it?
- Did anyone actually count anything, or pick a favourite soldier?
- **William one-liner:** _(none yet)_

## 3. Pit 2 — `pit-2`

The chariot horses and the horse-head macro came out of here.

- Did you find the famous kneeling archer, or miss it?
- Anything said about the horses?
- **William one-liner:** _(none yet)_

## 4. Pit 3 — `pit-3`

The small, badly damaged command-HQ pit — the headless figures.

- How did this one land compared to Pit 1? (Maisie's copy calls it grim.)
- **William one-liner:** _(none yet)_

## 5. The Restored Figures Hall — `figures-hall`

The individually cased figures, and the crowd photographing them.

- How bad was the scrum for a clear photo, really?
- Did Dad's photo count get mentioned at any point?
- **William one-liner:** _(none yet)_

## 6. Xi'an City Wall — `city-wall`

The rainy gate-tower shot, plus the night-arrival traffic shot from 31 July.

- Did you walk it, cycle it, or just look at it?
- How wet did everyone actually get, and who complained first?
- Anything about arriving into the city that first night?
- **William one-liner:** _(none yet)_

## 7. Bell Tower — `bell-tower`

⚠️ The only photo here is a **sourced** image (Wang Zhongyin, CC BY-SA 4.0) —
you didn't go up it. Keep any addition factual about the building, or note
what you saw of it from outside.

- Did you pass it? See it lit up at night?
- **William one-liner:** _(none yet)_

## 8. Ever-Bright City & the Muslim Quarter — `xian-by-night`

Your two night photos are Ever-Bright City. The two Muslim Quarter photos are
**sourced** (Qianeal CC BY-SA 4.0; thierrytutin CC BY 2.0) — captions there
must stay factual and must not mention family.

- What did you actually eat? Anything Maisie refused outright?
- Did anyone try on hanfu, or just watch?
- What was the coloured smoke/light show about?
- Did you get to the Muslim Quarter itself, or only Ever-Bright City? **If you
  didn't go, say so** — the sourced photos should then be reframed as "the bit
  we didn't get to" rather than implying you were there.
- **William one-liner:** _(none yet)_

---

## Open question

The location is currently named "Ever-Bright City & the Muslim Quarter" and
merges both. If you never actually visited the Muslim Quarter, tell me and I'll
split it or drop the sourced photos — the site shouldn't imply a visit that
didn't happen.
