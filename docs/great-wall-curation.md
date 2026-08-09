# Great Wall (Mutianyu) — photo curation proposal

Source: `Photographs/the-great-wall/`, 82 JPGs + 1 MP4, 392 MB, shot 8 Aug 2026.
Proposal below keeps **26 photos + 1 video**; the other 56 are burst duplicates,
near-identical vistas, or unusable. **Nothing has been renamed or deleted yet.**

## ⚠️ Excluded on privacy grounds

| File | Why |
|---|---|
| `20260808_122454.jpg` | Phone screenshot of the entry ticket. Shows a passenger name and partially-masked passport digits. Must not go on the site. |

## ⚠️ Identities need confirming

Several shots contain family members. I've named them from context only — **please
correct any that are wrong before I rename anything.** Where I wasn't confident I
used a neutral name.

---

## Proposed locations (6) and photo assignments

### 1. `arrival` — Getting there
| # | Source | New name |
|---|---|---|
| 002 | `20260808_134623.jpg` | `visitor-centre-arrival.jpg` |
| 003 | `20260808_135543.jpg` | `parasol-walkway.jpg` |
| 006 | `20260808_140645.jpg` | `site-map-board.jpg` |
| 071 | `20260808_171231.jpg` | `souvenir-street-family.jpg` |

`071` is the same parasol street as `003` but on the way *out* (17:12 vs 13:55),
with the shops open and three of you standing in it.

### 2. `chairlift` — The chairlift up
| # | Source | New name |
|---|---|---|
| 007 | `20260808_144517.jpg` | `chairlift-cabins.jpg` |
| 009 | `20260808_144825.jpg` | `chairlift-rider.jpg` |
| 021 | `20260808_144917.jpg` | `chairlift-pair.jpg` |
| 016 | `20260808_144849.jpg` | `first-sight-of-wall.jpg` |
| VID | `20260808_144628.mp4` | `chairlift-ride-up.mp4` |

**The video is the ride *up*, not the toboggan.** The handoff assumed toboggan;
it's the chairlift. At ~1:40 the toboggan chute is visible below with a rider on
it, which is a nice hook, but the caption has to describe the lift.

### 3. `the-wall` — Up on the wall
| # | Source | New name |
|---|---|---|
| 026 | `20260808_145323.jpg` | `wall-snaking-ridge.jpg` |
| 051 | `20260808_151109.jpg` | `wall-to-the-mountains.jpg` |
| 078 | `IMG-20260808-WA0006.jpg` | `wall-along-ridge.jpg` |
| 082 | `IMG-20260808-WA0010.jpg` | `maisie-on-the-wall.jpg` |
| 036 | `20260808_145852.jpg` | `view-over-the-valley.jpg` |

`026` and `051` are the two strongest frames in the whole set — `051` is my pick
for the trip's hero image.

### 4. `watchtowers` — The watchtowers
| # | Source | New name |
|---|---|---|
| 028 | `20260808_145417.jpg` | `tower-window-view.jpg` |
| 042 | `20260808_150041.jpg` | `tower-gable-plaque.jpg` |
| 064 | `20260808_152507.jpg` | `mum-in-the-archway.jpg` |
| 058 | `20260808_151742.jpg` | `stone-cannon.jpg` |

`058` is a stone cannon (石炮) with its interpretive sign — good factual material.
`064` is the last of a four-frame burst (061–064) and the best of them.

### 5. `the-steps` — The steps
| # | Source | New name |
|---|---|---|
| 049 | `20260808_150945.jpg` | `steps-through-the-arch.jpg` |
| 053 | `20260808_151334.jpg` | `steep-steps.jpg` |
| 046 | `20260808_150723.jpg` | `ice-cream-on-the-steps.jpg` |
| 073 | `IMG-20260808-WA0001.jpg` | `worn-steps.jpg` |

### 6. `toboggan` — The toboggan down
| # | Source | New name |
|---|---|---|
| 070 | `20260808_163543.jpg` | `toboggan-start.jpg` |
| 075 | `IMG-20260808-WA0003.jpg` | `toboggan-chute.jpg` |
| 076 | `IMG-20260808-WA0004.jpg` | `toboggan-riders.jpg` |

Your line — *"the toboggan down was awesome"* — belongs here.

### Group photos — location to be decided
| # | Source | New name |
|---|---|---|
| 030 | `20260808_145517.jpg` | `family-on-the-wall.jpg` |
| 047 | `20260808_150752.jpg` | `family-on-the-steps.jpg` |
| 067 | `20260808_154901.jpg` | `maisie-portrait.jpg` |

---

## Dropped (56 files)

Burst near-duplicates and repeated vistas, in groups:
`004` (dupe of 003) · `008` · `010–015` (six near-identical hillside frames,
incl. the `144842(0)` pair) · `017–020` (chairlift burst, kept 021) ·
`022–025` · `027` · `029` · `031–035` (group burst, kept 030) · `037–041` ·
`043–045` · `048` · `050` · `052` (dupe of 051) · `054–057` (steps burst, kept
053) · `059–063` (archway burst, kept 064) · `065`, `066` · `068`, `069` ·
`072` (dupe of 071) · `074` · `077` · `079`, `080` · `081`

Plus `001` (excluded, see above).

## Video encoding

| | Size | Settings |
|---|---|---|
| Original | 204 MB | HEVC 1080p30, 13.5 Mbps, 118 s |
| Option A | 40.8 MB | H.264 1280 wide, CRF 27 |
| **Option B** | **17.1 MB** | **H.264 960 wide, CRF 30, AAC 80k** |

Recommend **B**. It plays in a modal a few hundred px wide, the footage is mostly
foliage passing, and 17 MB is a sane thing to put in a git repo with no LFS.
