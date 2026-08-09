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

/* The route page. Stops appear in itinerary order and each has a marker
   (data-stop) in journey.html's inline SVG. Legs chain between stops;
   day:true means an out-and-back from the current base city, so the next
   leg starts from that base, not from the day-trip stop. km values are
   the counted travel (day trips count both ways), rounded, and always
   presented with "about". Distance comparisons are ballpark straight-line
   figures, deliberately hedged with "roughly". */
const JOURNEY = {
  stops: [
    { trip:"shanghai",       label:"Shanghai" },
    { trip:"xitang",         label:"Xitang" },
    { trip:"xian",           label:"Xi'an" },
    { trip:"forbidden-city", label:"Beijing" },
    { trip:"great-wall",     label:"Mutianyu" }
  ],
  start:"It all starts in Shanghai, which is not exactly easing yourself in — skyscrapers, the Bund, lights everywhere, the works.",
  end:"Add it all up and that's about 2,800 km, which is genuinely further than London to Istanbul. Err, I had a good one. Whatever happens next is in your imagination.",
  totalLabel:"about 2,800 km",
  legs: [
    { from:"shanghai", to:"xitang", day:true, km:180,
      distanceLabel:"about 90 km each way", compare:"roughly London to Oxford",
      blurb:"First detour — about 90 km out to Xitang and back, London to Oxford basically. Skyscrapers swapped for a little town where the streets are canals." },
    { from:"shanghai", to:"xian", km:1400,
      distanceLabel:"about 1,400 km", compare:"roughly London to Rome",
      blurb:"Then the big one, about 1,400 km to Xi'an — roughly London to Rome. Three nights there, with a whole clay army waiting about 40 km east of the city." },
    { from:"xian", to:"forbidden-city", km:1100,
      distanceLabel:"about 1,100 km", compare:"roughly London to Barcelona",
      blurb:"Another about 1,100 km up to Beijing, roughly London to Barcelona. That was base for the rest of the holiday, with the Forbidden City sitting right in the middle of the city." },
    { from:"forbidden-city", to:"great-wall", day:true, km:140,
      distanceLabel:"about 70 km each way", compare:"roughly London to Brighton",
      blurb:"Last detour — about 70 km each way out to the Great Wall at Mutianyu. London to Brighton, except instead of a beach there's a massive wall going over the mountains." }
  ]
};

/* Dynasty ribbon. Years are signed integers (negative = BC) and eras are
   contiguous — check.mjs enforces the chain. Two deliberate
   simplifications, both standard in kid-facing timelines: the messy
   220–581 stretch (Three Kingdoms through the Northern and Southern
   dynasties) is one "Divided China" block, and the Yuan is dated from
   1279 (rule over all of China) so the Song can end where it actually
   fell. Every event date is verified; approx:true renders "roughly". */
const TIMELINE = {
  eras: [
    { name:"Qin",               hanzi:"秦",   from:-221, to:-206 },
    { name:"Han",               hanzi:"汉",   from:-206, to:220 },
    { name:"Divided China",                   from:220,  to:581 },
    { name:"Sui",               hanzi:"隋",   from:581,  to:618 },
    { name:"Tang",              hanzi:"唐",   from:618,  to:907 },
    { name:"Five Dynasties",                  from:907,  to:960 },
    { name:"Song",              hanzi:"宋",   from:960,  to:1279 },
    { name:"Yuan",              hanzi:"元",   from:1279, to:1368 },
    { name:"Ming",              hanzi:"明",   from:1368, to:1644 },
    { name:"Qing",              hanzi:"清",   from:1644, to:1912 },
    { name:"Republic",          hanzi:"民国", from:1912, to:1949 },
    { name:"People's Republic", hanzi:"中国", from:1949, to:2026 }
  ],
  today:"And then we turned up. This whole website is what happened next.",
  events: [
    { year:-210, trip:"xian",
      china:"The First Emperor dies and gets an entire clay army sealed underground with him. Imagine ordering that.",
      britain:"Britain is doing Iron Age roundhouses. Hadrian's Wall is still about 330 years off." },
    { year:1368, trip:"great-wall",
      china:"The Ming dynasty kicks off — they're the ones who end up building the brick Great Wall we walked on at Mutianyu.",
      britain:"Chaucer is busy writing. The Peasants' Revolt is 13 years away." },
    { year:1406, trip:"forbidden-city",
      china:"Work starts on the Forbidden City, and fourteen years later it's done. Which is like quite fast for the biggest palace ever.",
      britain:"Still nine years to go before Agincourt." },
    { year:1600, approx:true, trip:"xitang",
      china:"Xitang is already a proper thriving water town by roughly now — the lanes and houses you walk round today are mostly Ming and Qing work.",
      britain:"Shakespeare is writing Hamlet around then." },
    { year:1929, trip:"shanghai",
      china:"Sassoon House, the Peace Hotel, finishes on the Bund — most of those big grand buildings along there are 1920s and 30s.",
      britain:"The classic red telephone box design turned up in 1926, a few years earlier." },
    { year:1974, trip:"xian",
      china:"Some farmers digging a well find the Terracotta Army by total accident. Two thousand years down there, and it took a well to find it.",
      britain:"That April, ABBA won Eurovision in Brighton." }
  ]
};

/* Characters for the tracing playground — all drawn from the trips' own
   names. Each char has a stroke-data file at
   assets/vendor/hanzi-data/<codepoint-hex>.js (check.mjs verifies). */
const HANZI = [
  { char:"中", pinyin:"zhōng", meaning:"middle",        trip:null,             word:"中国",   wordMeaning:"China — literally the Middle Country" },
  { char:"国", pinyin:"guó",   meaning:"country",       trip:null,             word:"中国",   wordMeaning:"China" },
  { char:"北", pinyin:"běi",   meaning:"north",         trip:"forbidden-city", word:"北京",   wordMeaning:"Beijing — the northern capital" },
  { char:"京", pinyin:"jīng",  meaning:"capital",       trip:"forbidden-city", word:"北京",   wordMeaning:"Beijing" },
  { char:"长", pinyin:"cháng", meaning:"long",          trip:"great-wall",     word:"长城",   wordMeaning:"the Great Wall — literally the long wall" },
  { char:"城", pinyin:"chéng", meaning:"wall, city",    trip:"great-wall",     word:"长城",   wordMeaning:"the Great Wall" },
  { char:"兵", pinyin:"bīng",  meaning:"soldier",       trip:"xian",           word:"兵马俑", wordMeaning:"the Terracotta Army" },
  { char:"马", pinyin:"mǎ",    meaning:"horse",         trip:"xian",           word:"兵马俑", wordMeaning:"the Terracotta Army" },
  { char:"俑", pinyin:"yǒng",  meaning:"burial figure", trip:"xian",           word:"兵马俑", wordMeaning:"the Terracotta Army" },
  { char:"西", pinyin:"xī",    meaning:"west",          trip:"xitang",         word:"西塘",   wordMeaning:"Xitang — and 西安 Xi'an has it too" },
  { char:"上", pinyin:"shàng", meaning:"up, above",     trip:"shanghai",       word:"上海",   wordMeaning:"Shanghai — literally upon the sea" },
  { char:"海", pinyin:"hǎi",   meaning:"sea",           trip:"shanghai",       word:"上海",   wordMeaning:"Shanghai" }
];

const COMPARATORS = {};

/* Then & Now slider pairs. `then.file` is under Photographs/ and carries a
   full credit object — public domain still gets visible attribution, and
   the TASL details live in docs/authoring.md. `now` is a PHOTOS id (never
   an index). The Ponting pair is deliberately captioned as a different
   section of wall — the honest comparison is bare-vs-forested mountains,
   not "same spot". */
const THEN_NOW = {
  sub:"Drag the handle thingymajig. Same view, different century.",
  pairs: [
    { trip:"forbidden-city", id:"meridian-then", title:"The Meridian Gate", aspect:"2 / 1",
      then:{ file:"historic/meridian-gate-1899.jpg", year:"1899",
        credit:{ author:"Unknown photographer", license:"Public domain",
          licenseUrl:"https://commons.wikimedia.org/wiki/Template:PD-old",
          sourceUrl:"https://commons.wikimedia.org/wiki/File:Meridian_Gate_Beijing_Pre_1900.jpg" } },
      now:"p1",
      blurb:"In 1899 the Meridian Gate had rough grass, a dirt road and like three rickshaws in front of it. Now the queue alone has more people in it than that entire photo." },
    { trip:"great-wall", id:"wall-then", title:"The Great Wall", aspect:"4 / 5",
      then:{ file:"historic/great-wall-1907.jpg", year:"1907",
        credit:{ author:"Herbert Ponting", license:"Public domain",
          licenseUrl:"https://commons.wikimedia.org/wiki/Template:PD-old",
          sourceUrl:"https://commons.wikimedia.org/wiki/File:Greatwall_large.jpg" } },
      now:"g11",
      blurb:"Different bit of the wall, this one — 1907, mountains completely bare, the tower in ruins, a few people in long robes standing about. Slide across to Mutianyu now and the wall's rebuilt and the same kind of mountains have been totally swallowed by forest." },
    { trip:"shanghai", id:"bund-then", title:"The Bund", aspect:"16 / 9",
      then:{ file:"historic/bund-1930.jpg", year:"1930",
        credit:{ author:"US Army Signal Corps", license:"Public domain",
          licenseUrl:"https://commons.wikimedia.org/wiki/Template:PD-USGov",
          sourceUrl:"https://commons.wikimedia.org/wiki/File:1930_Shanghai.jpg" } },
      now:"s3",
      blurb:"Same grand Bund buildings, but in 1930 the street was full of trams, old cars and rickshaws, the river was packed with wooden boats, and there was a big winged statue that isn't there any more. Now the whole lot gets floodlit gold at night." }
  ]
};

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
