# The Great Wall — the family moments still to fill in

Same deal as `docs/xian-moments.md`. The Mutianyu trip ships with the
**factual/historical copy complete** and the **family moments deliberately left
out**. Nothing on the live site says `[TODO]` — the locations simply don't carry
a family anecdote or a William quote, and it renders fine without them.

The one family line supplied so far is *"the toboggan down was awesome"*, which
is used twice: in the `toboggan` location story and on `toboggan-start.jpg`.

## How to add one once you've written it

- **A William one-liner** → add a `william:` field to that location in the
  `ofTrip("great-wall", [...])` block of `assets/data.js`:
  ```js
  william:"\"Quote goes here,\" — William, doing whatever he was doing."
  ```
  The map popout only renders the William box when the field exists.
- **A family moment inside a location's story** → add a `<p>` to that location's
  `story` field.
- **A family moment about a specific photo** → add a `<p>` to that photo's
  `detail` field in `PHOTOS`.

Match the voice already there (see `docs/maisie-voice-interview.md`).

---

## ⚠️ Identifications to confirm

People were named by matching outfits across photos from the same day, not by
anything anyone told me. **If any of these are wrong, the caption is wrong.**

| Photo | Named as | Basis |
|---|---|---|
| `souvenir-street-family.jpg` | Mum, William, Maisie | Blue bag / white tee / grey tee, consistent across the day |
| `family-on-the-wall.jpg` | Mum, William, Maisie | Same three outfits |
| `family-on-the-steps.jpg` | Mum, William, Maisie | Same three outfits |
| `mum-in-the-archway.jpg` | Mum | Floral top, khaki shorts, blue cross-body bag |
| `steep-steps.jpg` | William | White tee, black shorts, curly hair |
| `maisie-on-the-wall.jpg` | Maisie | Grey tee |
| `fan-on-the-steps.jpg` | Maisie | Grey "Explore The Great Outdoors" tee |
| `maisie-portrait.jpg` | Maisie | Same tee |
| `chairlift-pair.jpg` | **not named** — "two of us" | Faces unclear. One floral top + sandals (matches Mum), one long hair + trainers. Confirm and I'll name them. |
| `chairlift-rider.jpg` | **not named** — written as a stranger | Confirm it isn't Dad or William. |

---

## 1. Getting There — `arrival`

Visitor centre, the parasol souvenir street in and out, the site map board.

- Did anything actually get bought on the way back down, and by whom?
- Was there a shuttle bus, or did you walk it? The intro currently just says
  "up through the hills" to avoid claiming either.
- **William one-liner:** _(none yet)_

## 2. The Chairlift Up — `chairlift`

Five photos plus the video.

- **Who sat with who?** Two-per-chair, so there were pairs — worth recording.
- Did anyone take the gondola or walk instead of the chairlift? The story says
  "we went on the chairlift" based on the photos; correct it if that's wrong.
- Was anyone actually nervous on it, or is that just Maisie's framing?
- `maisie-portrait.jpg` is assigned here as the lift-station queue. It could be
  the toboggan queue or the shuttle queue — **confirm which**, it's a blue
  canopy with zigzag barriers.
- **William one-liner:** _(none yet)_ — an 18-year-old on an open chairlift with
  no doors is the obvious slot.

## 3. Up On The Wall — `the-wall`

- How far along did you actually get — which tower numbers? Did you reach the
  unrestored section?
- What's the town visible in `view-over-the-valley.jpg`?
- **William one-liner:** _(none yet)_

## 4. The Watchtowers — `watchtowers`

- Did you go inside more than one? Was the cold-brick-shade thing as good as the
  copy claims?
- Anything said about the stone cannon?
- **William one-liner:** _(none yet)_

## 5. The Steps — `the-steps`

- Who flagged first, and who claimed they were fine?
- Where did the little pink fan come from — bought on the souvenir street?
- Was there an actual ice cream at any point? (The photo originally filed as
  "ice cream" turned out to be the fan.)
- **William one-liner:** _(none yet)_

## 6. The Toboggan Down — `toboggan`

Currently the only location carrying a real family line.

- **Who actually rode it, and did anyone not?**
- Who braked the whole way and who didn't? Did anyone get stuck behind a slow
  rider? This is the best banter opportunity on the trip and it's empty.
- Did Dad film it one-handed on the way down?
- **William one-liner:** _(none yet)_

---

## Other open questions

- **Running order of the day.** The arrival and toboggan photos are sunny; the
  wall and steps photos are grey and overcast. Camera timestamps run 13:46 →
  17:12, with the toboggan around 16:35, so the current ordering follows the
  timestamps. Confirm that matches what actually happened.
- **The yellow-bag-over-the-hair thing** isn't visible in any Mutianyu photo, so
  it's not mentioned. Did it happen here?
- **No Dad photos at all** on this trip — he's behind the camera in every shot.
  The captions make a running joke of it, which works, but if there is a photo
  of him somewhere it'd be worth adding.
