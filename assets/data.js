/* ============================================================
   SITE DATA — the assembler.

   Each trip lives in its own file under assets/data/ and is loaded BEFORE
   this one; this file stitches them into the flat globals the rest of the
   site reads. Adding a trip is a new file, one line in TRIP_MODULES, and
   one <script> tag on every page. (assets/data/extras.js also loads here —
   it carries the cross-trip data for the interactive features.)

   Splitting it up is not cosmetic: this file was 127 KB in one piece, which
   meant editing a single Xi'an caption had to load all three trips.
   ============================================================ */

/* ============================================================
   SITE VERSION — bump this one line; every page picks it up.
   ============================================================ */
const SITE_VERSION = "3.12.0";

/* Tag a group of entries with their trip, so the tag is declared once per
   group instead of repeated on every object. */
const ofTrip = (trip, items) => items.map(o => ({ ...o, trip }));

/* Declaration order matters twice over:
     * TRIPS[0] is the fallback when a page is opened with no ?trip=, which is
       what keeps every pre-existing link working. The Forbidden City is first
       for that reason alone — it is a compatibility default, not top billing.
     * PHOTOS is indexed positionally by the map popout (PHOTOS.indexOf(p)), so
       the flattened order has to stay stable. Reordering this array reorders
       the gallery and the popout thumbnails with it. */
const TRIP_MODULES = [
  TRIP_FORBIDDEN_CITY,
  TRIP_XIAN,
  TRIP_GREAT_WALL,
  TRIP_XITANG,
  TRIP_SHANGHAI
];

const TRIPS     = TRIP_MODULES.map(m => m.trip);
const LOCATIONS = TRIP_MODULES.flatMap(m => ofTrip(m.trip.id, m.locations));
const PHOTOS    = TRIP_MODULES.flatMap(m => ofTrip(m.trip.id, m.photos));
const FACTS     = Object.fromEntries(TRIP_MODULES.map(m => [m.trip.id, m.facts]));

/* ============================================================
   FAMILY DATA — portrait files are optional, looked up in Photographs/forbidden-city/
   `file` is a path relative to Photographs/, INCLUDING the trip folder, because
   a portrait lives in the folder of the trip it was actually taken on.
   ============================================================ */
const FAMILY = [
  { id:"mum", name:"Xianghong", role:"Argues With Everyone, Usually Wins", file:"forbidden-city/mum.jpg", emoji:"👑",
    bio:"Mum's Chinese, dead proud of it, and honestly a bit fiery — she'll argue with anyone about anything and normally win. She's got this yellow bag she puts over her hair whenever the sun's out to protect it, which I get major secondhand embarrassment from but also kind of love. If a guide tells her no, she just walks off and asks a different guide the exact same question two minutes later." },
  { id:"dad", name:"Paul", role:"Chief Photography Officer", file:"forbidden-city/dad.jpg", emoji:"📷",
    bio:"Dad works in IT, cooks a proper good dinner, and is at the gym more than anyone I know. He watches me play football every week and never misses a Chelsea match either. On this trip his phone was basically glued to his hand taking photos \"for the archive\" — we've seen about six of them." },
  { id:"william", name:"William", role:"18, Never Without His AirPods", file:"forbidden-city/william.jpg", emoji:"🙄",
    bio:"My brother, 18, hair like a poodle, AirPods in permanently laughing at something on his phone. He's obsessed with his clothes and his LV bag and reckons that makes him too cool for old buildings. His entire personality is winding me up until I actually want to fight him, and it still works every single time." },
  { id:"maisie", name:"Maisie", role:"Narrator, Striker, Age 11", file:"forbidden-city/maisie.jpg", emoji:"✨",
    bio:"Me. I'm sassy, a bit sensitive, and my brother annoys me about nine times a day. I play football, striker, so yes I will size up basically anything like it's a defence I need to get past. Also into Olivia Rodrigo, my phone, and judging stuff on whether I'd actually wear it." }
];

const EMPTY_STATE_LINES = [
  "No photos here yet. Dad's still \"sorting through the archive.\"",
  "Nothing uploaded here yet. Ask and ye shall (eventually) receive.",
  "Photo gap. William was probably on his phone instead of taking one.",
  "Still empty here — check back once Dad remembers where he put the SD card."
];
