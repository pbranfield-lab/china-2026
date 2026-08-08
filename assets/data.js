/* ============================================================
   SITE VERSION — bump this one line; every page picks it up.
   ============================================================ */
const SITE_VERSION = "1.3.0";

/* ============================================================
   HISTORY INTRO — Maisie's opening narration
   ============================================================ */
const HISTORY_INTRO = `
<p>Right, before I get into what actually happened, I've got to explain what the Forbidden City even is, because apparently nobody will get the rest of it otherwise. Fine. It's basically the biggest, poshest house ever built, and it was built for one family only — the Emperor of China and everyone in his family.</p>
<p>A guy called the Yongle Emperor started building it in <strong>1406</strong>. It took about <strong>fourteen years</strong> and reportedly over a million workers, and it was finished in <strong>1420</strong>, which is when the Emperor actually moved in. Fourteen years to build one house. My Lego set takes me a whole weekend and I still moan about that.</p>
<p>After that, emperors lived there for the next <strong>492 years</strong>. That's <strong>24</strong> different emperors, from two different dynasties — first the Ming lot, then the Qing lot — all living in the same place, generation after generation, right up until <strong>1912</strong>, when China stopped having emperors altogether.</p>
<p>It's called "Forbidden" because ordinary people genuinely weren't allowed anywhere near it. The wall round the whole thing is over 10 metres high, and there's a moat outside that too, 52 metres wide, so nobody was wandering in by accident. Officially it's got <strong>8,707 rooms</strong>, though for ages people said it had 9,999.5, because a full 10,000 rooms was only allowed for Heaven and even the Emperor wasn't brave enough to build that many. Dam.</p>
<p>Mum was already arguing with a guide about something before we'd even got through the first gate, which, fair, that's basically her whole personality. Dad had his phone out taking photos of the wall and the moat before we'd even bought tickets, "for the archive." I already knew this was going to be a long day.</p>
<p>Anyway. That's the boring bit out the way. Here's what actually happened when we went in.</p>
`;

/* ============================================================
   TERRACOTTA INTRO — Maisie's opening narration for the Xi'an leg
   ============================================================ */
const TERRACOTTA_INTRO = `
<p>Right, new city, new explaining-what-this-actually-is bit, sorry, but you'll thank me. Xi'an isn't just some random stop, it used to be called Chang'an and it was basically the start of the whole Silk Road, the road that connected China to pretty much everywhere else in the world for trading silk and spices and stuff, thousands of years ago.</p>
<p>The big reason we came though is the Terracotta Army, and honestly the story of how anyone even found it is mad. In <strong>1974</strong> some farmers were just digging a well, an actual well, for water, and hit clay. Not rocks, not mud, an actual soldier's head. That's it. That's how an entire buried army got found, because some blokes needed water.</p>
<p>It all belongs to a guy called <strong>Qin Shi Huang</strong>, the first Emperor of a unified China, he pulled the whole country together in <strong>221 BCE</strong>, and then spent ages building himself an entire underground army to guard his tomb into the afterlife. Thousands of soldiers, horses, chariots, all made of clay, buried in pits near where he's actually buried. He died in <strong>210 BCE</strong>, so he never even got to see if any of it worked.</p>
<p>It's a UNESCO World Heritage Site now, which basically means the whole world agreed it's a big deal. We also went to the actual city wall in the rain, and out at night to a food street that's a thousand years old sat right next to a boulevard that's built to look ancient but is actually properly modern. So this bit of the trip is half ancient clay army, half rainy old wall, half neon lights, which I know is three halves, but that's Xi'an for you.</p>
<p>Mum was well up for this leg, obviously, an entire buried army guarding an emperor's treasure is basically her whole aesthetic. Dad already had memory card space cleared "just for the warriors." Here's what we actually found.</p>
`;

/* ============================================================
   TRIPS — the top-level concept. Pages are trip-aware via ?trip=<id>;
   with no ?trip= param everything falls back to TRIPS[0].
   `photoDir` is the folder under Photographs/ (kept separate from `id`
   so URLs stay short while folders stay descriptive).
   ============================================================ */
const TRIPS = [
  { id:"forbidden-city", name:"The Forbidden City", chinese:"紫禁城", city:"Beijing",
    icon:"🏛️", blurb:"The world's biggest, poshest house, built for one family and off limits to everyone else for 492 years.",
    map:"forbidden-city-map.png", mapAlt:"Schematic plan of the Forbidden City",
    mapCredit:"Base plan: labeled Forbidden City floor plan by Tommy Chen, Wikimedia Commons (CC BY-SA 3.0 / GFDL) — my pins and commentary are extra.",
    photoDir:"forbidden-city",
    intro: HISTORY_INTRO },
  { id:"xian", name:"Xi'an & the Terracotta Warriors", chinese:"西安 · 兵马俑", city:"Xi'an",
    icon:"🏺", blurb:"An entire clay army nobody knew about until 1974, plus a rainy city wall and a thousand-year-old food street.",
    map:"xian-map.svg", mapAlt:"Schematic plan of the Xi'an trip: the Terracotta Army pits, the city wall, and the old city",
    mapCredit:"Site plan drawn for this page — not to scale.",
    photoDir:"terracotta-warriors",
    intro: TERRACOTTA_INTRO }
];

/* Tag a group of entries with their trip, so the tag is declared once per
   group instead of repeated on every object. */
const ofTrip = (trip, items) => items.map(o => ({ ...o, trip }));

/* ============================================================
   TEN MIND-BLOWING FACTS — ten per trip, rendered into story.html.
   `stat` is the headline number; `text` is Maisie explaining why it's mad.
   Keep these factual: the whole point is that they're genuinely real.
   ============================================================ */
const FACTS = {
  "forbidden-city": [
    { stat:"980", label:"buildings",
      text:`Not rooms, whole <strong>buildings</strong>, nearly a thousand of them still standing behind one wall. At that point it isn't a house, it's a town, and basically one family were allowed to use it.` },
    { stat:"8,707", label:"rooms",
      text:`If you slept in a different room every night it would take you nearly <strong>24 years</strong> to get round them all. Everyone used to say it had 9,999 and a half, because a full ten thousand was only allowed for Heaven, which is a mad reason to stop building, but ok.` },
    { stat:"1,000,000", label:"workers",
      text:`Reportedly about a million people, building one place, for <strong>14 years</strong>. That's like filling Wembley eleven times over and telling every single person in there to go and do bricks.` },
    { stat:"0", label:"nails",
      text:`The big timber halls have got <strong>no nails in them at all</strong> — it's wooden brackets slotted into each other, called dougong. It's sat through earthquakes and it's still standing, which is more than flat-pack furniture can say.` },
    { stat:"492", label:"years of emperors",
      text:`Twenty-four emperors, two different dynasties, one address, 1420 all the way to 1912. America hasn't even existed that long.` },
    { stat:"10", label:"roof animals",
      text:`The little animals on the roof ridge tell you how important a building is, and the Hall of Supreme Harmony has got the maximum <strong>ten</strong>. No other building in the whole of China is allowed that many. Dam.` },
    { stat:"308", label:"fire vats",
      text:`Giant bronze and iron water vats parked all over the place in case the wooden palace went up. In winter they lit <strong>fires underneath them</strong> so the water didn't freeze. Fires, to protect from fires.` },
    { stat:"0", label:"trees in the big courtyards",
      text:`Done on purpose so nobody could hide behind one and jump out at the Emperor. All the green bits are shoved right at the back, which also means there is <strong>no shade whatsoever</strong> in the main courtyards, and I can personally confirm that.` },
    { stat:"52 m", label:"of moat",
      text:`The moat is wider than an Olympic swimming pool is long, and then there's a wall over ten metres high behind that. "Forbidden" wasn't like a suggestion, they properly meant it.` },
    { stat:"19 million", label:"visitors a year",
      text:`It's the most visited museum on earth, which works out at roughly <strong>fifty thousand people a day</strong>. Quite funny for somewhere that was built entirely to keep everybody out.` }
  ],

  "xian": [
    { stat:"8,000", label:"clay soldiers",
      text:`Plus about <strong>670 horses</strong> and 130 chariots, all buried on purpose so one man wouldn't have to be dead on his own. Pit 1 by itself is around 230 metres long, so longer than two football pitches end to end.` },
    { stat:"1974", label:"the year anyone found it",
      text:`Some farmers were digging a well for water and hit a clay head. Two thousand years of the maddest thing in China just sat down there, and it got found by people who were <strong>thirsty</strong>.` },
    { stat:"~2,000", label:"actually dug up so far",
      text:`Out of eight thousand. Most of that army is <strong>still under the ground right now</strong>, while you're reading this, and they're going slow on purpose so they don't wreck it.` },
    { stat:"0", label:"identical faces",
      text:`Not one repeat, out of thousands. Somebody sat and did thousands of separate human faces by hand, for something that was going straight into a hole in the ground forever.` },
    { stat:"38", label:"years to build the tomb",
      text:`Reportedly around <strong>700,000 workers</strong>, and Qin Shi Huang started the whole thing when he was about <strong>13</strong>. Thirteen. I'm eleven and I haven't got plans past Friday.` },
    { stat:"minutes", label:"before the paint vanished",
      text:`Every warrior was painted proper bright colours and the paint survived two thousand years sealed underground, then air got to it and it curled off in <strong>minutes</strong>. So what everyone's looking at now is basically the leftovers.` },
    { stat:"east", label:"the way they all face",
      text:`The entire army is pointed <strong>east</strong>, which is where the six states he conquered were. So even dead, he's got thousands of soldiers stood staring at everyone he beat.` },
    { stat:"mercury", label:"in the soil above his tomb",
      text:`Ancient writings said his tomb has <strong>rivers of liquid mercury</strong> running through a little model of his empire, and everyone assumed that was made up until soil tests came back with really high mercury. Nobody has opened it. Fair enough, honestly.` },
    { stat:"13.7 km", label:"of city wall",
      text:`It goes the whole way round the old city and the top is <strong>wide enough to cycle on</strong>. A six-hundred-year-old wall that's now basically a bike lane, which I do think is cool.` },
    { stat:"13", label:"dynasties ruled from here",
      text:`Xi'an used to be called Chang'an and it was the eastern end of the entire Silk Road. In the Tang dynasty it might've been the <strong>biggest city on the planet</strong>, about a million people, which is a lot of people for that long ago.` }
  ]
};

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

/* ============================================================
   LOCATION DATA — map pins, positioned as % over assets/forbidden-city-map.png
   (coordinates read off the real labeled plan: A=Meridian Gate, B=Divine Might Gate,
   F=Gate of Supreme Harmony, G=Hall of Supreme Harmony, L=Palace of Heavenly Purity,
   M=Imperial Garden, O=Palace of Tranquil Longevity)
   ============================================================ */
const LOCATIONS = [
  ...ofTrip("forbidden-city", [
  { id:"meridian-gate", num:1, x:50.0, y:91.1,
    name:"Meridian Gate", chinese:"午门 (Wǔmén)",
    story:`<p>So this is literally just the front door, except it's got five separate gates and for about six hundred years you weren't allowed to use the middle one unless you were the Emperor. Not his mum, not his top advisors, nobody. The only exceptions ever were the Empress on her actual wedding day, and the top three scorers in the imperial exams — and even they only got the one go at it, their whole life.</p>
    <p>Mum walked straight up the middle one like she owned the place and got stopped by an actual guide within about four seconds. I was cackling so hard I had to walk off. It's not my fault it was funny.</p>
    <p>Also — grim bit I loved — officials could get publicly whipped right here if the Emperor was in a mood. Imagine getting told off at your own front door. With a stick. In front of everyone.</p>`,
    william:"\"Forty minutes in a queue for a door,\" — William, before taking about fifty photos of the door." },
  { id:"golden-water", num:2, x:50.4, y:76.2,
    name:"Gate of Supreme Harmony & the Golden Water", chinese:"太和门 · 内金水桥",
    story:`<p>Right past the gate there's a bendy little stream with five white marble bridges curving over it, all lined up like a fan. From above they're shaped like the jade decorations on the Emperor's belt, which is genuinely extra for a bridge, but also, respect.</p>
    <p>Each bridge stands for one of five Confucian virtues, and guess who got the middle one again. Him. Obviously. There's a real pattern going on with this place and I'm onto it.</p>
    <p>This is also roughly the spot where Dad found the panorama button on his phone and did not stop using it for the rest of the actual holiday.</p>`,
    william:"\"Why's there a moat inside the other moat,\" — William, missing the entire point." },
  { id:"supreme-harmony", num:3, x:50.4, y:59.8,
    name:"Hall of Supreme Harmony", chinese:"太和殿 (Tàihédiàn)",
    story:`<p>This is the big one — the largest wooden building in the whole complex, where emperors actually got crowned. The throne sits up on a massive platform right in the middle so everyone had to look up at him. Classic power move, honestly.</p>
    <p>Up on the roof corners there's a row of little mythical animal statues, and the more a building has, the more important it is. This roof has ten, the actual maximum allowed anywhere in China — nothing else got that many.</p>
    <p>William claimed he was bored the entire time we were in here and then I caught him quietly counting the statues under his breath. Caught red handed. He's so annoying.</p>`,
    william:"\"Ten roof guys. I counted,\" — William, definitely not bored." },
  { id:"central-harmony", num:4, x:50.4, y:54.0,
    name:"Hall of Central Harmony", chinese:"中和殿 (Zhōnghédiàn)",
    story:`<p>This one's tiny compared to the last hall — small, square, tucked round the back — and it had a much less scary job. It's basically where the Emperor sat and had a breather before the big ceremonies, running through what he was about to say next door.</p>
    <p>He also inspected seeds here before the spring ploughing ceremony, which is a mad image — the most powerful man in the country, crouched over some seeds like he's on a gardening show.</p>
    <p>Basically it's a green room. Even the Emperor got nervous before the big performance apparently, which I found weirdly comforting.</p>`,
    william:"\"So it's a waiting room.\" \"It's the Emperor's waiting room.\" \"Still a waiting room.\" — William, unmoved." },
  { id:"preserving-harmony", num:5, x:50.4, y:48.0,
    name:"Hall of Preserving Harmony", chinese:"保和殿 (Bǎohédiàn)",
    story:`<p>This hall hosted the final, hardest stage of the imperial exams, the one the Emperor watched in person. People studied their entire lives for this one test. Fail, and you wait years to try again. Pass, and you're suddenly one of the most powerful people in the country. No pressure at all.</p>
    <p>Round the back there's one absolutely massive slab of carved marble on the steps — over 200 tonnes, covered in dragons and clouds. They dragged it here from a quarry miles away, in winter, by pouring water on the road to make an ice slide, then hauling it with ropes and hundreds of men and mules. No forklifts. Just ice, rope, and a lot of shouting, probably.</p>
    <p>By this point my legs were dying. I wanna sit down. Nobody listened, obviously.</p>`,
    william:"\"Worse than GCSEs,\" — William, on an exam where failing wrecked your whole family's future, so, debatable." },
  { id:"heavenly-purity-gate", num:6, x:50.4, y:42.0,
    name:"Gate of Heavenly Purity", chinese:"乾清门 (Qiánqīngmén)",
    story:`<p>This gate is the actual line between the "work" half of the palace, where all the ceremonies and politics happened, and the "home" half, where the Emperor's actual family lived. Basically nobody got past here — guards, officials, most staff, all stopped dead at this exact spot.</p>
    <p>Mum tried to have a full debate with the guide about whether she personally should be let through anyway. She lost. She was not thrilled about it.</p>
    <p>William actually read the whole info plaque here properly, no messing about, which is basically a solar eclipse for him.</p>`,
    william:"William didn't say anything here — he was too busy actually reading the plaque for once. Screenshotted, for evidence." },
  { id:"heavenly-purity-palace", num:7, x:50.4, y:32.7,
    name:"Palace of Heavenly Purity", chinese:"乾清宫 (Qiánqīnggōng)",
    story:`<p>This was the Emperor's actual home, back in the Ming dynasty, and it's got the best secret in the whole palace. Above the throne there's a plaque saying "Justice and Uprightness," and behind it the Emperor used to hide a sealed box with the name of his chosen heir written inside. Nobody knew, not even the heir, until the Emperor died and officials opened it in front of the entire court.</p>
    <p>Imagine your parents wrote down who's getting the house in a locked box above the telly and you're not allowed to open it till they're gone. Genuinely the best sibling-drama-prevention plan I've ever heard of and I am furious mine haven't copied it.</p>`,
    william:"\"It's basically an escape room reveal but for an entire empire,\" — William, annoyingly correct." },
  { id:"union-earthly", num:8, x:50.4, y:26.0,
    name:"Hall of Union & Palace of Earthly Tranquility", chinese:"交泰殿 · 坤宁宫",
    story:`<p>The Hall of Union stored the Emperor's official seals — 25 of them, one for each type of decree, so basically the most heavily guarded stamp collection in history. It also stood for the marriage of Emperor and Empress, which is a nice idea for a room absolutely full of paperwork.</p>
    <p>Next door, the Palace of Earthly Tranquility was the Empress's home in the Ming dynasty. Later on, in the Qing dynasty, one whole room got painted red and turned into the wedding chamber for the Emperor's wedding night — red for good luck, apparently. It's a lot of red though.</p>
    <p>Mum stood in that doorway for way longer than a normal amount of time. William just gave her a look and said nothing, for once.</p>`,
    william:"\"A whole room just for stamps.\" \"They're seals, William.\" \"Stamps.\" — William, refusing to budge." },
  { id:"imperial-garden", num:9, x:50.4, y:19.1,
    name:"Imperial Garden", chinese:"御花园 (Yùhuāyuán)",
    story:`<p>Finally, trees. After a solid morning of enormous stone halls, the Imperial Garden is all twisty ancient cypress trees, some over 500 years old, plus rockeries, little pavilions and actual shade. I have never been so happy to see a bush in my life.</p>
    <p>Some of the trees have grown wrapped round each other and get called "lianli" trees, an old symbol for love and loyalty, which is unbearably sweet for a tree, but I'll allow it.</p>
    <p>This is the one place William put his phone away without being told, sat down, and admitted it was "actually pretty nice." Historic moment. I have witnesses and I will be bringing this up forever.</p>`,
    william:"\"...yeah okay this bit's actually nice,\" — William, aged 18, briefly a functioning human." },
  { id:"six-palaces", num:10, x:21.0, y:22.5,
    name:"The Six Palaces (East & West)", chinese:"东六宫 · 西六宫",
    story:`<p>This is where the Emperor's mum, wives, concubines and kids actually lived — rows of smaller palaces either side of the path, and basically where all the proper gossip happened.</p>
    <p>One of the women who lived here was a low-ranking concubine called Cixi, who ended up ruling China for decades as Empress Dowager, long after her husband and son had both died. That's not a glow up. That's an entire glow up trilogy.</p>
    <p>Dad said it's "basically a corporate ladder except everyone's also trying to poison each other," which is the most switched-on thing he's said all trip.</p>`,
    william:"\"So it's a reality show but people can also have you executed,\" — William, weirdly on the money." },
  { id:"treasure-gallery", num:11, x:79.3, y:34.6,
    name:"Palace of Tranquil Longevity: Nine-Dragon Screen & Treasure Gallery", chinese:"宁寿宫 · 九龙壁 · 珍宝馆",
    story:`<p>There's a wall of nine massive glazed-tile dragons here, built to look powerful and scare off evil spirits, and there's only three of these Nine-Dragon Screens left in the whole of China. Right behind it, the Treasure Gallery is full of actual imperial bling — gold, jade, mad elaborate hairpieces, and one jade cabbage that everyone queues for like it's a theme park ride.</p>
    <p>Dad tried to photograph literally every single case in there. We had to physically drag him out. We missed lunch over a jade cabbage. Worth it, I guess.</p>`,
    william:"\"There's a famous vegetable in here and people are actually crying over it,\" — William, about the jade cabbage, correct." },
  { id:"divine-might", num:12, x:50.4, y:6.5,
    name:"Gate of Divine Might", chinese:"神武门 (Shénwǔmén)",
    story:`<p>This is the north exit, the very end of the walking route. Look back and you get a proper view across the moat to Jingshan Hill, which is actually an artificial hill made entirely from the earth they dug out to build the moat in the first place. Zero waste. My school could learn something.</p>
    <p>It's also a genuinely heavy bit of history to finish on: back in 1644, as rebels closed in on the city, the last Ming emperor, Chongzhen, climbed that hill and hanged himself rather than be captured, ending the entire Ming dynasty right there. Heavy way to end a walk, not gonna lie. Dont really know what to say about that one, so, moving on.</p>
    <p>We got ice cream straight after, obviously. Dad checked his photo count (412). William announced his legs were basically gone. I decided someone needed to make a website about all this. You're reading it.</p>`,
    william:"\"My legs are literally going to fall off,\" — William, after a walk Dad's watch clocked at 3.1 miles." }
  ]),
  ...ofTrip("xian", [
  { id:"entrance", num:1, x:38.3, y:82.3,
    name:"Terracotta Army Museum Entrance", chinese:"秦始皇兵马俑博物馆",
    story:`<p>This is the actual front door to the whole complex, and the full name is a proper mouthful — the Museum of Qin Shi Huang's Terracotta Warriors and Horses, 秦始皇兵马俑博物馆, which is the sign you walk under before you've seen a single soldier. It opened in 1979, only a few years after the farmers found the first bits, and now it's one of the most visited museums on the entire planet.</p>
    <p>The whole museum sits right on top of the actual pits, so you're not looking at replicas moved somewhere convenient, you're stood exactly where an entire army's been buried for over two thousand years. Three separate pits plus a proper exhibition hall, all under one site, and apparently loads more is still unexcavated underground that nobody's even touched yet.</p>
    <p>Dad had his camera out before we'd even got through the gate, obviously, and Mum was already walking like she owned the place, which, fair, given the size of that sign.</p>` },
  { id:"pit-1", num:2, x:21.0, y:54.5,
    name:"Pit 1", chinese:"一号坑 (Yī hào kēng)",
    story:`<p>Pit 1's the big one, the one basically every photo of the Terracotta Army you've ever seen is actually of. It's the largest of the three pits and also the first one anyone found, back in 1974, when it was still just a farmer's well-digging accident nobody saw coming.</p>
    <p>There's an estimated <strong>6,000 figures</strong> in here, packed into tight battle formation, rows and rows of soldiers standing exactly where they were placed over two thousand years ago, mostly infantry with chariots and horses mixed through. Standing at the rail looking down the length of it, the rows just keep going, they don't stop being rows.</p>
    <p>A load of the figures further back are still half buried or in bits, because excavating this stuff properly takes actual decades, they're not just going to dig it all up in a weekend. So you get this mad mix in one pit, some soldiers standing there dead straight looking finished, and some still basically a jigsaw puzzle in the dirt.</p>` },
  { id:"pit-2", num:3, x:73.7, y:50.9,
    name:"Pit 2", chinese:"二号坑 (Èr hào kēng)",
    story:`<p>Pit 2's smaller than Pit 1 but honestly more interesting once you know what you're looking at, because this is where all the variety is — cavalry, chariots, and both kneeling and standing archers, instead of just endless rows of the same infantry pose.</p>
    <p>The single most famous figure out of the whole army, the kneeling archer, came out of this pit. He's one of the best preserved of the lot, they can still see the actual tread pattern on the bottom of his boots, which is a mad level of detail for something made over two thousand years ago and then buried.</p>
    <p>Pit 2's also still being excavated properly now, bit by bit, which is why you get sections roped off or behind glass instead of one full open trench like Pit 1. Less finished-looking, but you're basically watching history still happening, which is cool actually.</p>` },
  { id:"pit-3", num:4, x:43.8, y:47.0,
    name:"Pit 3", chinese:"三号坑 (Sān hào kēng)",
    story:`<p>Pit 3's tiny compared to the other two, only around <strong>68 figures</strong> total, but archaeologists reckon it was the actual command headquarters for the whole underground army, based on the layout and the way the figures are arranged facing each other instead of all facing forward like a battle line.</p>
    <p>A lot of the figures in here are properly wrecked though, way more than the other pits, snapped and headless and scattered about, and the best guess is a fire or the roof caving in at some point over the last two thousand-odd years did the damage, not people. Still grim to actually stand and look at, a whole trench of broken soldiers who were meant to be the top brass.</p>
    <p>Because it's so small it doesn't take long to walk round, but it hits different to the big open pits, way more like a crime scene than a museum display.</p>` },
  { id:"figures-hall", num:5, x:65.5, y:63.7,
    name:"The Restored Figures Hall", chinese:"文物陈列厅 (Wénwù Chénliètīng)",
    story:`<p>This bit's different to the pits — instead of rows of soldiers still stood in the dirt, this hall's got individual figures lifted out, properly restored, and put in their own glass cases so you can actually walk right up and see one on its own instead of squinting at a crowd from a rail.</p>
    <p>The mad fact about literally every single figure in the whole army, this one included, is that no two faces are the same. Out of thousands of soldiers, every single face is different, which means someone, or a lot of someones, sat there carving individual faces one at a time for years. Dam.</p>
    <p>They were originally painted too, proper bright colours, but the paint had been sealed underground so long that as soon as air got at it after being dug up, it started flaking off within minutes. So what you're looking at now, this plain clay colour, isn't actually how it was ever meant to look, it's just what's left after the colour didn't survive the reveal.</p>` },
  { id:"city-wall", num:6, x:13.2, y:20.2,
    name:"Xi'an City Wall", chinese:"西安城墙 (Xī'ān Chéngqiáng)",
    story:`<p>This is the Xi'an City Wall, one of the oldest and most complete city walls left standing anywhere in China. What's actually there now mostly dates from the Ming dynasty, built up from the 1370s onwards, but it's sitting on top of even older foundations from the Tang dynasty, so the wall's really a few different centuries stacked on top of each other.</p>
    <p>It goes the whole way round the old city, about <strong>13.7 kilometres</strong>, and it's wide enough on top that people actually cycle round it, a proper bike-width path the whole way, not just a walkway. Massive gate towers sit at intervals along it, tiered wooden roofs on top of thick brick and rammed-earth walls built to actually survive a siege, not just look nice.</p>
    <p>We went in the rain, proper grey, wet-stone kind of weather, which honestly suited it, a six hundred-plus-year-old defensive wall doesn't really need sunshine to look serious.</p>` },
  { id:"bell-tower", num:7, x:49.6, y:18.1,
    name:"Bell Tower", chinese:"钟楼 (Zhōnglóu)",
    story:`<p>The Bell Tower sits dead in the middle of Xi'an's old street grid, right where the main roads cross, and it's basically the compass point the whole old city gets planned around. First built in the 14th century and later moved to stand exactly here, it's one of the biggest and best kept bell towers left in China.</p>
    <p>It used to actually do a job, not just look impressive. A massive bell inside got rung every morning to mark the start of the day for the whole city, paired with the Drum Tower nearby doing the same thing at dusk, so basically the entire population of old Xi'an ran on the sound of these two towers instead of a clock.</p>
    <p>It's properly lit up gold at night, sat there in the middle of the traffic like the roundabout got built around a six hundred year old landmark. Because it did.</p>` },
  { id:"xian-by-night", num:8, x:59.5, y:14.3,
    name:"Ever-Bright City & the Muslim Quarter", chinese:"大唐不夜城 · 回民街",
    story:`<p>This bit of Xi'an is properly two different nights happening right next to each other. First there's the Muslim Quarter, 回民街, home to Xi'an's Hui Muslim community going back over a thousand years to actual Silk Road trading days. It's the city's most famous food street, spiced lamb skewers everywhere, and biang biang noodles, named after the actual sound the dough makes when it gets slapped on the counter to stretch it out. There's also the Great Mosque of Xi'an tucked in there, the biggest of the city's ten mosques, been there since the Tang dynasty.</p>
    <p>Then there's Ever-Bright City, 大唐不夜城, which translates to something like "the Great Tang city that never sleeps," and it's the complete opposite kind of old, meaning it's not old at all. It's a modern boulevard built to look like the Tang dynasty, all lit up with light shows, people renting hanfu robes for photos, costumed performers, food stalls, a whole themed street built from scratch to feel ancient.</p>
    <p>So you've genuinely got a thousand-year-old food street a short walk from a several-years-old pretend-Tang-dynasty street, both absolutely rammed at night, both lit up like Christmas, and honestly good luck telling which one's the real deal just from the lights.</p>` }
  ])
];

/* ============================================================
   PHOTO DATA — add real photo entries here as they're processed.
   location must match a LOCATIONS id above.
   ============================================================ */
const PHOTOS = [
  ...ofTrip("forbidden-city", [
  { id:"p1", location:"meridian-gate", file:"meridian-gate-crowds.jpg",
    caption:"Turns out, like, forty thousand other people had the same idea about visiting on a Wednesday morning, so that was the queue before we'd even got through the gate...",
    detail:`<p>This was literally the first five minutes. We hadn't even got through the gate and there's already this massive queue snaking back behind the red barriers, as far as I could actually see. Beijing in August is not "warm," it's like a full-body event, my whole outfit was stuck to me before we'd even started properly.</p>
    <p>The actual gate towers in the background, the tall thingymajigs at the corners, aren't just decoration, they're proper watchtowers, called "que". So it's not really just a gate, it's basically a fortress with a door in it, built on purpose to make you feel small before they even let you in. Cool, I guess, if you're into that.</p>
    <p>Dad was somewhere behind me messing about with his camera settings the whole time, missing the actual moment, obviously. And Mum had already started telling a member of staff that queueing "wasn't necessary for her," eye roll, here we go already...</p>` },
  { id:"p1b", location:"meridian-gate", file:"meridian-gate-approach.jpg",
    caption:"A pigeon just flew straight in over the wall like the whole Forbidden City thing wasn't even a rule for it, no one checked its ticket or anything.",
    detail:`<p>So mid-queue this pigeon just casually flies right over the wall like none of it applies to it, must be nice. You can properly see the crowd in this one, everyone bunched up under the one bit of tree shade there was, which by about half nine was already the most valuable real estate in Beijing.</p>
    <p>There was some tourist in a blue bag just walking straight across everyone's photos, not even sorry about it. This is basically the calm before the actual calm, we hadn't even got to the middle-gate drama yet, that's a whole other thingymajig, Mum tried it, more on that later probably...</p>` },
  { id:"p2", location:"meridian-gate", file:"tunnel-view-in.jpg",
    caption:"This is literally the first photo of the whole day, through the tunnel bit, looking in before we had any idea what we'd actually signed up for.",
    detail:`<p>This was taken like four seconds after we handed our tickets over. You can see the courtyard through the arch leading up to the Gate of Supreme Harmony, already rammed with people, which, cool, great start.</p>
    <p>Right at the very end of the day I got the exact same shot except facing the other way, out through the north gate, which is a nice full circle thingymajig I guess. Also it was already stupidly hot in that tunnel and we hadn't even started walking properly yet, so...</p>` },
  { id:"p3", location:"meridian-gate", file:"meridian-sign.jpg",
    caption:"The proper 'we are actually here' photo, taken while it was already roasting hot and technically still morning, so that tells you everything.",
    detail:`<p>This is the front of the Meridian Gate from outside, battlements either side, and this massive sign across the middle that says 故宫博物院, which is Palace Museum. It was about half nine here and I was already sweating through the outfit I'd picked specifically to look nice in photos, typical.</p>
    <p>Mum stood directly under the sign like she was being formally welcomed home or something, arms out and everything. Honestly the fully-returned-home vibes were switched on before we'd even properly gone in...</p>` },
  { id:"p4", location:"golden-water", file:"five-bridges.jpg",
    caption:"Five marble bridges in a row, one of them apparently royalty only, and all five just baking in the sun.",
    detail:`<p>This is the courtyard just past the entrance, with the five marble bridges over the Golden Water thingymajig. Apparently from above they're meant to look like the jade bits on the Emperor's belt, which, cool, if you say so.</p>
    <p>The white marble was basically just bouncing the sun straight back up at us, like standing on a mirror. My legs were properly cooking, not even joking.</p>` },
  { id:"p5", location:"golden-water", file:"bronze-lion.jpg",
    caption:"This lion looked like it had seen some things, honestly it looked about as done with the heat as I was, which is saying something.",
    detail:`<p>One of the massive bronze guardian lions outside the Gate of Supreme Harmony, paw resting on this embroidered ball thingymajig, which stands for the Emperor's power over basically the whole world. No big deal, apparently.</p>
    <p>All that green stuff is just centuries of weather doing its thing, not paint. It was hot enough that day that the lion was probably actually hot to touch, I did not test it, but I thought about it, then moved on because it was too hot to stand there deciding.</p>` },
  { id:"p6", location:"golden-water", file:"courtyard-umbrellas.jpg",
    caption:"Every single umbrella out here was on sun duty, not rain duty, there wasn't a cloud doing anything threatening anywhere.",
    detail:`<p>So many umbrellas up and not one cloud in sight, that's a proper "the sun is trying to actually kill us" situation, not a rain thing at all. This is roughly the walk from the entrance towards the Three Great Halls, the big three thingymajigs, and it does not feel short.</p>
    <p>William complained every third step the entire way, eye roll, I've counted, it's basically his hobby at this point.</p>` },
  { id:"p7", location:"supreme-harmony", file:"fire-cisterns.jpg",
    caption:"Giant bronze vats that I would honestly have climbed straight into if security wasn't stood right there watching.",
    detail:`<p>These bronze cauldron thingymajigs dotted around the halls aren't just for decoration, they're actual proper fire-fighting water tanks, because the whole palace is wood and like, flammable paint, so, good plan I guess.</p>
    <p>In winter apparently they used to wrap these in padded covers and light fires underneath so the water wouldn't freeze solid. Imagine that being someone's actual job, anyway, moving on.</p>` },
  { id:"p8", location:"supreme-harmony", file:"roofline-bird.jpg",
    caption:"The famous roof statue guys, properly up close for once, plus a bird who could not care less about any of it.",
    detail:`<p>This is the actual roofline, the row of mythical animal statues marching down from the dragon at the front. The Hall of Supreme Harmony has the full ten, which is the maximum allowed anywhere in China apparently, so that's cool, very extra.</p>
    <p>Dad zoomed all the way in for this one, obviously, and then a bird just flew straight through the shot for free, didn't even ask.</p>` },
  { id:"p9", location:"supreme-harmony", file:"plaza-balloon.jpg",
    caption:"You don't really get how massive this place is until you're actually walking across it, it looks like nothing in a photo.",
    detail:`<p>This stretch of stone between the gates is properly deceptively massive, looks like a five minute walk in a photo and is absolutely not a five minute walk when it's like 30-odd degrees and there's zero shade anywhere.</p>
    <p>Some kid had this yellow balloon and honestly I have never related to an inanimate object more, just floating there, no complaints, no legs to complain with.</p>` },
  { id:"p10", location:"central-harmony", file:"twin-hall-roofs.jpg",
    caption:"The little pointier roof is Central Harmony, the massive one behind it is Supreme Harmony being extra as usual, and yeah, apparently even the roofs have a pecking order round here...",
    detail:`<p>So the smaller building with the pointier, sort of pavilion-shaped roof is the Hall of Central Harmony. It's basically like a green room, where the Emperor sat and had a breather before he had to go do the big ceremony thing in the massive hall right behind it.</p>
    <p>I rolled my eyes so hard when I found out even the roofs have a hierarchy here, like the shape of your roof literally tells everyone how important you are. Cool I guess, if you're into roofs, which apparently I am now.</p>` },
  { id:"p11", location:"central-harmony", file:"family-central-hall.jpg",
    caption:"Me, William and Mum, all still alive, all sweating buckets between the two halls with the roofs behind us.",
    detail:`<p>This is an actual real family photo, taken between the halls with the twin roofs behind us. Everyone's smiling like it's totally normal to be dripping in this heat, and nobody says a word about it, which is like, the biggest lie in the whole photo.</p>
    <p>Mum's doing this pose where she's stood dead straight like she owns the place, which, fair enough, she basically acts like she does anyway. William's doing his standard "I am only here because I have no choice" face.</p>
    <p>And Dad's not in it at all, obviously, because Dad's never in the photo, Dad IS the photo, permanently stuck behind the camera going on about "the archive" again.</p>` },
  { id:"p12", location:"preserving-harmony", file:"gate-transition.jpg",
    caption:"Another gate. There are so many gates here, I properly lost count ages ago.",
    detail:`<p>This is us threading through toward the next bit of the Three Great Halls thingymajig, because every single section of this place has got its own gate. Like, why do you need this many gates, just let me through.</p>
    <p>By this point we'd found our rhythm though, walk a bit, stop for a photo, complain about the heat, repeat, over and over, forever.</p>` },
  { id:"p13", location:"preserving-harmony", file:"family-terrace-1.jpg",
    caption:"Me, William and Mum on this massive marble terrace thing, all of us properly done with the heat by now...",
    detail:`<p>That's William, Mum and me on the marble terrace, with one of the huge covered corridor thingymajigs running off behind us. Apparently these long galleries line pretty much every courtyard in the whole place, and back in the day guards and staff used them to get around without walking across the actual ceremonial bits.</p>
    <p>My shoes felt like they were properly melting into the ground at this point, like actually melting, I'm not even exaggerating.</p>` },
  { id:"p14", location:"preserving-harmony", file:"family-terrace-2.jpg",
    caption:"Same spot, same terrace, just slightly more fed up looking.",
    detail:`<p>Round two of the terrace photo, because apparently one wasn't enough proof we survived it. More of the Three Great Halls complex just stretching off behind us, it genuinely does not stop.</p>
    <p>Mum's still smiling away like she's on some official visit or something, meanwhile my legs had basically given up on me.</p>` },
  { id:"p15", location:"preserving-harmony", file:"skyline-view.jpg",
    caption:"You can actually see proper modern Beijing skyscrapers poking up behind the six hundred year old roofs, which is, cool actually...",
    detail:`<p>From the terrace you can see modern Beijing sort of poking up over the palace walls in the distance, all these ancient roof tiles in the front and then glass skyscrapers just doing their own thing right behind it.</p>
    <p>William pointed it out before I even noticed it myself, which, cool observation I guess, except he will one hundred percent deny ever saying anything nice about this place ever again.</p>` },
  { id:"p16", location:"preserving-harmony", file:"throne-peek.jpg",
    caption:"You're not allowed in the halls, you just get to squash up against the door with about fifty other people and squint at an actual throne.",
    detail:`<p>You can't actually go inside any of the halls, you just get to cram up against the doorway with like fifty other people and peer in over everyone's heads. But there's a real actual throne sitting in there, which is cool, proper ancient royal furniture and everything.</p>
    <p>The sign above it says 皇建有极, which basically means something like "the sovereign establishes the ultimate standard," so, no pressure then.</p>` },
  { id:"p17", location:"heavenly-purity-gate", file:"gate-crowd.jpg",
    caption:"This gate is basically where the palace stops being an office and starts being an actual house...",
    detail:`<p>Everything up to this gate was offices and ceremony halls and stuff like that, but past this point is where the Emperor's actual family lived, and almost nobody outside the household ever got this far in like six hundred years of history.</p>
    <p>We got this far in about forty minutes, mostly by being really sweaty and just not giving up, so, we've technically achieved more than most people ever did I guess. Anyway, moving on.</p>` },
  { id:"p18", location:"heavenly-purity-gate", file:"gilded-lion.png",
    caption:"This lion's proper gold, not just bronze, so we must be getting closer to where it actually mattered.",
    detail:`<p>The lions get fancier the deeper you go into the palace, so this one's full on gilt gold, not just the plain bronze ones by the front entrance.</p>
    <p>Basically it's the palace's own way of telling you that you've levelled up to VIP status, which, cool, though it would've been nice if someone told me that before I nearly died of heatstroke getting here.</p>` },
  { id:"p19", location:"heavenly-purity-palace", file:"maisie-solo.jpg",
    caption:"This is me, like, hours into the day, cap jammed on, freckles basically multiplying every five minutes or something.",
    detail:`<p>So this is meant to be the proper website narrator selfie, and the inner courtyard is behind me, still completely rammed with people even this far into the visit.</p>
    <p>The cap wasn't a fashion thing, it was actually necessary because the sun was doing something horrible to my face, but it did also look pretty decent if I'm honest.</p>` },
  { id:"p20", location:"heavenly-purity-palace", file:"family-hanfu-bg.jpg",
    caption:"Us three, and then just, like, randoms in the background in full hanfu, doing their whole photoshoot thing.",
    detail:`<p>See the people behind us in the pink and patterned robes, proper traditional Ming and Qing style outfits — you can actually rent them near some of the courtyards and get photos done all in character and everything.</p>
    <p>Mum clocked it about two seconds after we walked past and was already asking how much it cost, her whole face went a bit thingymajig, you know, that look she gets.</p>
    <p>Dad said no because we were running late, which, fair, but Mum has genuinely not let this go.</p>` },
  { id:"p21", location:"heavenly-purity-palace", file:"wide-courtyard.jpg",
    caption:"Another courtyard, another few hundred people, another hall just sat there in the distance, honestly lost count at this point.",
    detail:`<p>I properly lost count of how many courtyards like this we walked through, like every single one was massive enough to be the main tourist attraction back home, and here it's literally just the bit you walk through to get to the next building.</p>
    <p>Dad obviously stopped for ages to get a photo of it "for the archive," cool I guess, but my legs were not into it.</p>` },
  { id:"p22", location:"heavenly-purity-palace", file:"mum-maisie-close.jpg",
    caption:"Just me and Mum, mid-glare at some poor tour guide probably, yellow bag still glued to her shoulder.",
    detail:`<p>This is just a photo of me and Mum, she still had that determined look going, like, hours into the day, full heat, not even a bit tired, which is actually kind of impressive for someone who moans about gift shop opening times.</p>
    <p>Her yellow bag thingy is still hanging off her shoulder in this one, she basically refuses to put it down the entire trip, it's like part of her now.</p>
    <p>Honestly my stubbornness comes directly from her, not that she'd ever admit that.</p>` },
  { id:"p23", location:"six-palaces", file:"shaded-corridor.jpg",
    caption:"First proper shade of the whole day, like, genuinely a massive deal at this point.",
    detail:`<p>We ducked into one of the narrower corridors between the smaller residential palaces and got actual shade for the first time in hours, and it felt like the best thing that had happened all day.</p>
    <p>This bit is where the wider family, the wives and the kids and everyone, actually lived, so the buildings are way more normal-sized than the giant ceremonial halls at the front, more like proper houses instead of thingymajigs for showing off.</p>` },
  { id:"p24", location:"six-palaces", file:"quiet-courtyard.jpg",
    caption:"Wandering round the quieter bit, where all the actual gossip happened, apparently.",
    detail:`<p>This is deep in the residential side of the palace, smaller courtyards, way fewer people around, and honestly loads more atmosphere than the big ceremonial bit up front.</p>
    <p>This is where all the proper history actually went down, like alliances and rivalries and people plotting against each other, and a low-ranking concubine called Cixi literally lived in a courtyard exactly like this one before she ended up running the entire country, which is mad if you actually think about it.</p>
    <p>Anyway, moving on before I get too into the concubine drama.</p>` },
  { id:"p25", location:"six-palaces", file:"narrow-alley-gate.jpg",
    caption:"Absolute maze back here, pretty sure we walked past this exact gate twice, not that anyone believed me.",
    detail:`<p>Every single lane through the residential palaces looks basically identical, like, same red walls, same style of gate, and there's a different name plaque on each one but you can never actually read it before you get swept along by the crowd.</p>
    <p>I said we'd already walked past this exact gate and nobody believed me, typical.</p>` },
  { id:"p26", location:"union-earthly", file:"door-studs.png",
    caption:"Counted the studs on this door, nine rows of nine, which is apparently not an accident at all.",
    detail:`<p>These big red double doors turn up all over the deepest, most important bits of the palace, and the gold studs on them are always nine rows of nine, eighty one total, I actually counted them, which took a while.</p>
    <p>Nine was basically THE number for the Emperor, like his lucky number times a thousand, so a 9x9 grid of studs is basically the building going "top tier access only, don't even think about it."</p>
    <p>Same exact pattern shows up again right near the end of the day by the north gate, so keep an eye out.</p>` },
  { id:"p27", location:"union-earthly", file:"dad-resting.jpg",
    caption:"Dad finally sat down, genuinely a historic moment, arguably bigger news than the actual palace.",
    detail:`<p>Somewhere in the corridor heading toward the garden gate, Dad just parked himself on a step while the rest of us kept walking, like he'd given up mid-sentence.</p>
    <p>To be fair his feet had properly earned a rest at that point, he'd been carrying the camera thingy round his neck all day taking photos "for the archive," cool dedication I guess.</p>` },
  { id:"p28", location:"imperial-garden", file:"qinandian-crane.jpg",
    caption:"There was this bronze crane just stood outside the hall like it was on guard duty, which is basically what it's there for.",
    detail:`<p>So this bit is the courtyard of the Hall of Imperial Peace, which is like an actual Taoist temple inside the palace, dedicated to some god of the northern heavens. There's a bronze crane and these massive incense burners everywhere, and apparently cranes are a whole big deal in Chinese art for meaning long life, like up there with turtles and pine trees.</p>
    <p>Mum took one look at it and decided she wants a bronze crane guarding her house now as well. Typical Mum behaviour if you ask me.</p>` },
  { id:"p29", location:"imperial-garden", file:"qinandian-censer.jpg",
    caption:"Same hall again but from the other side, and yeah, there's still an incense burner in it, there's like a hundred of them here.",
    detail:`<p>This is more of the Hall of Imperial Peace courtyard, so like the actual entrance to the hall behind the crane statue from before, plus another big censer thingymajig on the right.</p>
    <p>This bit felt properly different to all the big ceremonial halls at the front, like way quieter, more like an actual place people prayed rather than just a stage set for the emperor to show off on. Nice change to be fair.</p>` },
  { id:"p30", location:"imperial-garden", file:"cypress-courtyard.jpg",
    caption:"Finally some actual trees. I have genuinely never been so happy to see shade in my life.",
    detail:`<p>After like a whole morning of just stone and marble and zero shade anywhere, getting into the Imperial Garden with all these ancient cypress trees felt like a completely different holiday.</p>
    <p>Some of them are literally hundreds of years old apparently, which is mad when you think a tree's just been stood there the whole time all this history was going on around it.</p>` },
  { id:"p31", location:"imperial-garden", file:"maisie-rockery.jpg",
    caption:"Me stood in front of a six hundred year old pile of rocks, dead unbothered about the whole thing.",
    detail:`<p>That jagged rock formation behind me is actually meant to be there, it's not just leftover building rubble or whatever. Apparently Chinese imperial gardens use these craggy rocks on purpose, they're called scholar's rocks, and they're meant to look like tiny mountains.</p>
    <p>There's also this little pavilion half buried in ivy just behind it that you can only just see. Kind of cool actually, not gonna lie.</p>` },
  { id:"p32", location:"imperial-garden", file:"family-garden-flowers.jpg",
    caption:"First photo all day where none of us look like we're being held hostage by the heat.",
    detail:`<p>The shade and the flowers, which are actually purple crepe myrtle, put everyone in a way better mood, like you can properly tell in the photo compared to the earlier ones.</p>
    <p>Mum's arm was basically glued round me for the rest of the day after this one. Not complaining, just saying.</p>` },
  { id:"p33", location:"imperial-garden", file:"hill-stele.jpg",
    caption:"This rockery is actually called the Hill of Accumulated Elegance, which is a proper name for a pile of rocks if you ask me.",
    detail:`<p>Turns out this rockery isn't just random, it's called 堆秀山, the Hill of Accumulated Elegance, built in 1583, there's a little stone marker there and everything.</p>
    <p>At the bottom there's two carved stone pieces that used to be part of a fountain, water used to get pumped up and jetted out of carved dragon mouths, which is honestly the coolest use of a fountain thingymajig I've heard of. Those pale, ghostly looking trees nearby are lacebark pine, apparently a proper Beijing speciality.</p>` },
  { id:"p34", location:"imperial-garden", file:"pavilion-trees.jpg",
    caption:"A little red pavilion basically hiding under some massive old trees.",
    detail:`<p>This bit was tucked away in the garden, half in shade from trees clearly older than literally everyone in our family put together, and honestly photos don't really do it justice.</p>
    <p>Even William didn't moan here, which says a lot, he's so annoying normally he'll find something to complain about anywhere.</p>` },
  { id:"p35", location:"imperial-garden", file:"rockery-guard.jpg",
    caption:"There was a guard just stood there making sure nobody climbed the six hundred year old rocks. Fair enough really.",
    detail:`<p>These craggy limestone rockeries look proper climbable, like exactly the kind of thing you'd want to scramble up, which is probably why there's a guard right there watching.</p>
    <p>I gave him a bit of an eye roll not gonna lie, like as if anyone's climbing that in this heat, but Dad reckons he's just stood there all day for that one job. Imagine.</p>` },
  { id:"p36", location:"imperial-garden", file:"bronze-censer.jpg",
    caption:"This tiny bronze gazebo thing is actually an incense burner and I was kind of obsessed with it.",
    detail:`<p>It's a proper little bronze pavilion, roof and everything, sat in its own fenced off bit of the garden, and it's actually an incense burner they used during ceremonies at the Hall of Imperial Peace nearby.</p>
    <p>Out of literally everything we saw that day this might be the most detailed object, like the amount of work that went into it is mad when you actually stop and look.</p>` },
  { id:"p37", location:"imperial-garden", file:"dougong-eave.jpg",
    caption:"Dad's actual best photo of the whole day and he has no idea he even took it.",
    detail:`<p>This is looking straight up under one of the corner eaves and you can see the whole roof thingymajig at once. That dense honeycomb bit in the shadow is called dougong, these interlocking wooden brackets that hold the roof up without a single nail or bit of glue, and apparently it can actually flex a bit, which is why these buildings have survived like six centuries of Beijing earthquakes.</p>
    <p>If you look at the rafter ends there's a gold symbol on green that means ten thousand, and little roundels underneath that mean longevity. There's even a tiny bell on the corner that rings when it's windy, which is a nice touch to be fair.</p>` },
  { id:"p38", location:"imperial-garden", file:"chishou-dragon.jpg",
    caption:"A dragon carved just to spit rainwater out of its mouth, which is honestly a genius use of a dragon.",
    detail:`<p>This carved dragon head is called a chishou and its whole job is drainage, its mouth is drilled straight through so when it rains hard the water just shoots out clear of the stonework instead of wrecking it.</p>
    <p>If you get loads of them lined up along a terrace it's called the "thousand dragons spitting" effect, which, cool. It's carved from the same block as the balustrade base, and that black staining isn't damage or anything, it's just centuries of Beijing rain and air basically.</p>` },
  { id:"p39", location:"imperial-garden", file:"hill-distant.jpg",
    caption:"The whole Hill of Accumulated Elegance from further back, pavilion and everything on top.",
    detail:`<p>This is the proper view of the rockery hill from before, 堆秀山, with the little pavilion right on top called 御景亭, the Pavilion of Imperial View.</p>
    <p>Apparently it was only meant to be climbed once a year, for the Double Ninth Festival, cause climbing to high ground was meant to bring good luck. We didn't climb it though, it was like properly hot and there was a queue, so...</p>` },
  { id:"p40", location:"divine-might", file:"red-gate-studs.jpg",
    caption:"Another gate. Course there is.",
    detail:`<p>By this point we were like properly in the "is this actually ever going to end" stage. Legs dead, water bottles empty, everyone dragging their feet except Mum obviously, who still had loads of energy going even after about a billion steps.</p>
    <p>This one's from right near the very end, just before the actual exit. There's these gold stud thingymajigs all over the door and I dunno why I took a whole photo of just those but I did.</p>` },
  { id:"p41", location:"divine-might", file:"shenwumen-outside.jpg",
    caption:"The actual gate you walk out of at the end. 神武门, the Gate of Divine Prowess.",
    detail:`<p>This is the north gate, the one you finally walk out through when you're done. Under the Ming and Qing dynasties it had the drum and bell that basically ran the whole palace's day, like the bell went at dawn and the drum at dusk and then the drum again through the night watches, so everyone from the Emperor down to random kitchen staff just lived by that sound, which is kind of cool when you think about it.</p>
    <p>It's also where the last Emperor's story properly ends. Puyi walked out through this exact gate on 5 November 1924, kicked out by a warlord's troops, after basically his whole life being technically Emperor of a palace he wasn't even allowed to leave. Which is a bit sad if you think about it too long, so I'm not going to.</p>
    <p>The Palace Museum opened here almost exactly a year after that. Anyway, ice cream soon, so.</p>` },
  { id:"p42", location:"divine-might", file:"tunnel-view-out.jpg",
    caption:"Same shot as the very first photo of the day, just the other way round now.",
    detail:`<p>Remember right at the start, looking in through the Meridian Gate tunnel. This is like the same kind of photo but the opposite end of the palace, and this time we're looking out instead of in.</p>
    <p>Dead in the middle of the arch there's this hill with a pavilion on top, that's Jingshan. Apparently the whole hill is fake, like they made it on purpose out of all the earth they dug up building the palace moat, and stuck it there to block bad luck coming from the north. Cool, honestly, didn't expect a hill to have a backstory.</p>` },
  { id:"p43", location:"divine-might", file:"wanchun-pavilion.jpg",
    caption:"The pavilion on top of that hill, zoomed in loads because nobody's legs were climbing it.",
    detail:`<p>That's 万春亭, the Pavilion of Ten Thousand Springs, right up at the top of Jingshan, 45 metres up apparently. Meant to have this massive view back down over the whole palace from up there.</p>
    <p>William said his legs would need, and I quote, several years to recover before he was climbing anything else that day. Which for once I actually agreed with him on, not that I'd tell him that.</p>` },
  { id:"p44", location:"divine-might", file:"shenwumen-inside.jpg",
    caption:"Last look back before we actually stepped outside for good.",
    detail:`<p>One more glance back at the inside of the north gate, 故宫博物院 sign and everything, before we properly walked out into the real world. Ninety minutes in there in the end, the whole central axis, both inner courtyards, the quieter residential bits, the garden, all of it.</p>
    <p>Not bad going honestly even with all the complaining, most of which was probably me if I'm being fair. Dad was already checking through his camera roll before we'd even got out the gate, obviously.</p>
    <p>Ice cream happened basically straight after this photo and then I stopped caring about gates for a bit...</p>` }
  ]),
  ...ofTrip("xian", [
  { id:"x1", location:"entrance", file:"family-museum-entrance.jpg",
    caption:"The whole squad under the sign, water bottles already out, sky already grey, big Terracotta Army day officially starting.",
    detail:`<p>This is us properly arriving, the whole museum sign behind us, 秦始皇兵马俑博物馆 across the top in gold letters, which if you remember from the intro is the actual full name of the place. It was proper grey and cloudy that morning, not the roasting Beijing heat from before, which nobody was complaining about.</p>
    <p>Dad's got his cap and his water bottle, William's stood there with the hair doing its usual poodle thing, and Mum's got a little pale blue bag on her, looking dead ready to tell someone off if the queue's too long. Someone else must've grabbed the camera off Dad for once, because he's actually in this one, which barely ever happens.</p>
    <p>Straight past that sign is where the whole clay army thing starts properly, umbrellas up around the plaza just in case, even though it wasn't really raining yet.</p>` },
  { id:"x2", location:"pit-1", file:"pit-1-army-array-sign.jpg",
    caption:"Official 'Army Array of Pit 1' sign, in case you needed telling this bit's kind of a big deal, with the actual army stretching out behind it.",
    detail:`<p>This is the official sign right at the start of Pit 1, in Chinese and English both, roped off with gold stanchions and red rope like it's a red carpet for a plaque. It explains the formation, that Pit 1's a combined battle formation of chariots and infantry, with a row of soldiers round the outside facing outward as guards for the whole thing.</p>
    <p>Behind the sign you can properly see it though, trench after trench of soldiers just standing there in rows under this massive arched roof, which is basically an aircraft hangar built specifically to cover an ancient army. The whole thing goes back further than the photo can even show.</p>
    <p>Reading actual history off a sign isn't normally my thing but standing right in front of the rows it's describing kind of makes you actually read it properly for once.</p>` },
  { id:"x3", location:"pit-1", file:"pit-1-armor-detail.jpg",
    caption:"Close up on the actual armour and it's proper detailed, little studs and everything, not just a blob with a face.",
    detail:`<p>This is a proper close-up on a couple of the soldiers, side profile, and you can see the armour plating properly, all these individual little studs pressed into the clay one at a time to look like the metal plates would've been riveted on for real.</p>
    <p>Their faces are different too, obviously, moustaches, different hairstyles under the caps, that whole thing about no two faces being the same is way more believable once you're actually stood this close instead of looking at a wide shot of thousands of them.</p>
    <p>The clay's gone this proper grey stone colour now, but two thousand-odd years ago all this armour detail would've been painted in actual colour, which I can't really picture even looking right at it.</p>` },
  { id:"x4", location:"pit-1", file:"pit-1-rows-wide.jpg",
    caption:"You genuinely can't see the end of it, it just keeps going, and going, and going.",
    detail:`<p>This is looking properly down the length of Pit 1, and it's just trench after trench of soldiers and horses stretching back so far you can see actual tourists lined up like ants on the far rail. The rows aren't neat little lines either, the earth's all cracked and uneven between them, real dug-up dirt, not a smooth museum floor.</p>
    <p>You can spot a pair of horses poking up over one of the walls near the front, part of a chariot team, and behind them more rows of soldiers just keep appearing the further back you look.</p>
    <p>Photos genuinely do not do the size of this thing justice, it's the kind of big where you have to actually stand there for a minute before your brain believes it.</p>` },
  { id:"x5", location:"pit-1", file:"pit-1-half-excavated.jpg",
    caption:"This one's still mid rescue, properly wrapped up like it's just had surgery, buckets and all.",
    detail:`<p>Not every figure in Pit 1 is finished and standing proud, some are still being pulled out of the ground bit by bit, and this one's actually wrapped in plastic sheeting mid-restoration, sat there surrounded by white tubs and buckets like an actual dig site, because that's exactly what it still is.</p>
    <p>It's kind of a good reminder that this isn't some finished exhibit that's always looked like the postcard photos, people are out here right now, carefully working on getting the rest of this army out of the dirt in one piece.</p>
    <p>Next to it there's another figure that's basically still just a torso, no head sorted yet, so you get this proper mix of totally restored soldiers standing a few metres away from ones that look like they've barely started.</p>` },
  { id:"x6", location:"pit-1", file:"pit-1-torso-close.jpg",
    caption:"Just one soldier, properly close up, standing right on the edge of the trench like he's checking the drop.",
    detail:`<p>This is one figure on his own, side on, right at the edge of one of the dug-out trenches, and you can see loads of detail close up, the wrapped collar, the individual armour squares, even his hand curled like he used to be holding an actual weapon that rotted away centuries ago.</p>
    <p>Behind him at the top you can just see the metal stands some of the other restored figures get propped up on now, because two thousand years buried isn't exactly great for structural integrity, even clay needs a bit of help standing up straight these days.</p>
    <p>His face has this properly calm, slightly serious look, which is apparently just how they're all carved, dead straight-faced, not exactly smiling about guarding an emperor's tomb for eternity.</p>` },
  { id:"x7", location:"pit-1", file:"pit-1-display-stands-row.jpg",
    caption:"A whole row propped up on actual metal stands, because standing unsupported for two thousand years apparently takes its toll.",
    detail:`<p>This is a row of fully restored soldiers, standing there looking dead proud, except if you look at their feet, every single one's actually propped up on a thin metal stand. After being buried and cracked and pieced back together, most of them can't actually take their own weight standing free anymore.</p>
    <p>You can see the individual armour plating and the wrapped leg bindings properly here, different figures with slightly different gear, which apparently reflects different ranks and roles in the actual army, not just randomly varied for the sake of it.</p>
    <p>Lined up like this, facing the same way, it's the closest you get to imagining what the whole pit must've looked like finished and undamaged, before two thousand years of dirt and time did their thing.</p>` },
  { id:"x8", location:"pit-2", file:"pit-2-glass-case-display.jpg",
    caption:"This lot get the properly VIP treatment, glassed off in their own little room instead of just stood in the dirt.",
    detail:`<p>Pit 2's still being excavated, so instead of one giant open trench like Pit 1, bits of it are glassed off like this, a proper little room with a handful of figures stood inside, roped off out front so nobody gets too close.</p>
    <p>It looks almost like a shop display if I'm honest, figures lined up behind glass under proper lighting, which is a bit different to the raw dug-up-from-the-ground vibe of the rest of the pits.</p>
    <p>This is probably the closest you get here to imagining what it'll all look like eventually, once the rest of Pit 2 gets fully dug out and cleaned up like this bit already has.</p>` },
  { id:"x9", location:"pit-2", file:"pit-2-overview-from-rail.jpg",
    caption:"The proper view from up on the rail, whole crowd of us leaning over trying to spot the famous archer.",
    detail:`<p>This is looking straight down into Pit 2 from the walkway up top, and you can see the whole layout properly, different sections roped and boxed off, some figures still headless, some fully restored, a team of horses over on the right in their own little bay.</p>
    <p>Along the top rail you can see the actual crowd, loads of people crammed along the barrier all trying to get a look and a photo at the same time, which is basically the whole museum experience in one shot.</p>
    <p>Pit 2's meant to have more variety than Pit 1, cavalry and archers and chariots mixed in instead of just row after row of the same infantry pose, and you can properly see that mix from up here, different groups doing different things in different bits of the trench.</p>` },
  { id:"x10", location:"pit-2", file:"pit-2-chariot-horses.jpg",
    caption:"A chariot team, horses and all, still harnessed up after two thousand years underground.",
    detail:`<p>This is a chariot team from Pit 2, harnessed horses standing in a row, with soldiers nearby who would've actually been driving and guarding the chariot. The horses are lined up dead straight, heads all facing the same way, ears up, looking genuinely alert for something carved out of clay this long ago.</p>
    <p>You can see bits of rubble and broken pottery scattered around them too, proper reminders that this whole area's still an active dig, not a finished polished display like some of the other bits.</p>
    <p>Imagine being buried facing forward forever, harnessed to a chariot that never actually goes anywhere. Grim way to spend the afterlife if you ask me, but no one asked me.</p>` },
  { id:"x11", location:"pit-2", file:"pit-2-horse-heads-macro.jpg",
    caption:"Three horse heads, properly up close, and every single one's got a completely different expression.",
    detail:`<p>This is a proper close-up on the horses, three heads lined up in profile, ears pricked, nostrils flared like they're mid-neigh. You can see actual carved detail in the manes and the harness straps, this isn't just a rough clay lump shaped vaguely like a horse.</p>
    <p>Apparently the horses get the same individual treatment as the soldiers, no two exactly alike, which considering there's hundreds of them across the whole army is honestly a lot of effort for animals that were never even going anywhere.</p>
    <p>Up this close you can really see how much has survived under all that dirt for two thousand years, the detail's mad.</p>` },
  { id:"x12", location:"pit-3", file:"pit-3-headless-figures.jpg",
    caption:"Pit 3's the small, broken one, and this bit's properly grim, row after row with no heads at all.",
    detail:`<p>This is Pit 3, and it's a completely different vibe to the other two, way smaller, way more damaged. These figures are meant to have been the actual command staff for the whole underground army, standing facing each other instead of all facing forward like a battle line, but a lot of them are in bits now, snapped off at the neck, headless, crowded into this narrow stone-walled trench.</p>
    <p>Best guess is it wasn't people that wrecked this pit, it was probably a fire, or the roof caving in at some point over the last two thousand years, but either way it's a proper unsettling thing to actually stand and look at, a whole room of officers with no heads left.</p>
    <p>Manky, if I'm honest. Moving on.</p>` },
  { id:"x13", location:"figures-hall", file:"figures-hall-crowd.jpg",
    caption:"Everyone in this room's basically just here to photograph one bloke in a box, us included.",
    detail:`<p>This is the restored figures hall, and this is basically the scene in every single room, a solo, fully restored soldier stood behind glass, and an entire crowd of people with their phones up trying to get a clean shot past everyone else's phones.</p>
    <p>You can properly see it in this one, loads of hands and screens all pointed the same direction, and the actual figure just standing there completely unbothered by all the attention, which, fair, he's had two thousand years to get used to being looked at.</p>
    <p>Genuinely took ages to get a photo without someone's arm in it, everyone's got the exact same idea at the exact same time.</p>` },
  { id:"x14", location:"figures-hall", file:"figures-hall-individual-figure.jpg",
    caption:"Same kind of soldier, this time with nobody's arm or phone in the way for once.",
    detail:`<p>This is one of the individually restored figures, properly clear shot for once, no crowd blocking it. You can see all the cracks where he's been pieced back together, proper visible seams running across the robe and the armour, which honestly makes it feel more real, not less, like you can actually see the two thousand years of history written across him.</p>
    <p>His hands are crossed low at the front, which apparently is a specific pose that means something about his role, not just a random stance. Every single figure in this whole army was posed on purpose, nothing here's just standing about by accident.</p>
    <p>Properly cool close up, not gonna lie, even without loads of paint left on him you can tell how much work went into just this one soldier out of thousands.</p>` },
  { id:"x15", location:"city-wall", file:"city-wall-gate-tower.jpg",
    caption:"The actual city wall, in the actual rain, tunnel and everything, properly moody weather for a six hundred year old wall.",
    detail:`<p>This is a wide shot of the Xi'an City Wall in the rain, tiered wooden gate tower up top, thick stone wall underneath with an actual tunnel cut straight through it for people to walk through. The whole plaza in front's just soaking wet, dark reflective stone everywhere, one tree standing there getting properly rained on with us.</p>
    <p>You can see how thick the wall actually is just from the depth of that tunnel, this thing was built to survive an actual siege, not just look nice on a postcard, brick and rammed earth built up from the Ming dynasty on even older foundations underneath.</p>
    <p>Grey sky, wet stone, hardly anyone about really, honestly suited the wall better than sunshine would've.</p>` },
  { id:"x16", location:"city-wall", file:"city-wall-night-arrival.jpg",
    caption:"First proper night shot of Xi'an, traffic everywhere, and a gate tower just glowing gold at the end of the road.",
    detail:`<p>This is basically the "we've actually arrived" shot, taken the evening we landed, looking down a massive road absolutely rammed with traffic, red brake lights and white headlights stacked up as far as you can see. Right at the end of it, properly lit up gold against the black sky, one of the city's old gate towers just sitting there like it's been waiting for us.</p>
    <p>It's a proper mad contrast, all these modern cars and streetlights in the foreground, and then this centuries-old tiered roof glowing away in the distance like it's from a completely different photo.</p>
    <p>Long day of travelling and this was the first actual look at Xi'an properly, so, decent way to land.</p>` },
  { id:"x17", location:"bell-tower", file:"bell-tower-day.jpg",
    caption:"The Bell Tower, sat dead in the middle of the old city, taxis and everything driving straight round it.",
    detail:`<p>This is the Bell Tower, right in the centre of Xi'an where the old main roads all meet. It was first built in the 1300s and later moved to stand exactly here, and it's one of the best preserved bell towers left standing in the whole country.</p>
    <p>It used to have an actual job, not just look impressive, a huge bell inside got rung every morning to mark the start of the day for the whole city, with the nearby Drum Tower doing the same at dusk. Basically the entire population used to run on the sound of these two towers instead of a clock.</p>
    <p>Now it just sits there on its own little roundabout with traffic looping round it constantly, tiered green roofs, red pillars, gold tip right on top, six hundred-odd years old and still slap in the middle of rush hour.</p>` },
  { id:"x18", location:"xian-by-night", file:"everbright-city-night-crowd.jpg",
    caption:"Proper packed out, coloured smoke going off overhead, and everyone just wading through it like it's completely normal.",
    detail:`<p>This is Ever-Bright City at night, and it is absolutely rammed, wall to wall people just walking through this cloud of coloured smoke and lights going off overhead like it's a normal Tuesday. Pink, yellow, white smoke all lit up against the black sky, with old-style rooftops glowing gold in the background behind it all.</p>
    <p>There's some kind of light or smoke show clearly going on nearby, given the effects hanging in the air, and nobody around seems remotely fazed by it, everyone's just carrying on with their evening wandering straight through it.</p>
    <p>The whole boulevard's built to look properly ancient, Tang dynasty and everything, but stood in the middle of it at night with the lights and the crowd it feels about as modern as anything.</p>` },
  { id:"x19", location:"xian-by-night", file:"everbright-city-hanfu-night.jpg",
    caption:"People properly dressed up in hanfu drifting through, plus one very unbothered bloke in hi-vis keeping an eye on it all.",
    detail:`<p>This is further along Ever-Bright City, big red and gold Tang-style buildings all lit up, red lanterns strung everywhere. A few people are dressed in proper flowing hanfu robes, different colours, drifting through the crowd like they've walked straight out of a different century, because renting the outfits for photos here is basically half the point of the place.</p>
    <p>Right in the foreground there's a staff member in a hi-vis vest with 执勤 on the back, which means "on duty," just stood there watching the whole thing, looking about as unbothered by any of it as you'd expect from someone who does this every single night.</p>
    <p>It's a proper mad mix, ancient-looking costumes, neon signs, food stalls, ushers in hi-vis, all happening in the same twenty metres.</p>` },
  { id:"x20", location:"xian-by-night", file:"muslim-quarter-great-mosque-sign.jpg",
    caption:"The sign pointing to the Great Mosque, persimmon cakes hanging up right underneath it like nothing.",
    detail:`<p>This is a street corner in the Muslim Quarter, daytime, with a blue road sign pointing towards the Xi'an Great Mosque, written in Chinese and English both. Underneath it there's a whole rack of persimmon cakes hanging up to dry, plus food stalls either side selling snacks and pastries, and shop signs stacked up above everything in Chinese.</p>
    <p>The Muslim Quarter's home to Xi'an's Hui Muslim community, and it's been here for over a thousand years, going right back to Silk Road trading days. The Great Mosque itself is the biggest of ten mosques in this part of the city, tucked away just off this street.</p>
    <p>Even just from this one corner you can tell it's a proper working street, not a set-up-for-tourists version of one, carts, covered stalls, stacked signage, actual daily business going on.</p>` },
  { id:"x21", location:"xian-by-night", file:"muslim-quarter-xiyangshi-arch.jpg",
    caption:"The archway into Xiyangshi, one of the old market lanes, packed out even in the daytime.",
    detail:`<p>This is the archway leading into 西羊市, Xiyangshi, which translates to "West Sheep Market," one of the named lanes running through the Muslim Quarter. The street underneath's absolutely packed with people even in broad daylight, stalls either side selling meat and food, proper old carved wooden shopfronts either side of the arch itself.</p>
    <p>Streets like this have been part of Xi'an's food and trading scene for over a thousand years, right back to when this city was the actual starting point of the Silk Road, so the crowds and the stalls aren't a new thing at all, people have been doing exactly this here for centuries.</p>
    <p>Proper contrast to Ever-Bright City's neon version of "old," this one's the real deal, just getting on with it in the daytime instead of putting on a show at night.</p>` }
  ])
];

const EMPTY_STATE_LINES = [
  "No photos here yet. Dad's still \"sorting through the archive.\"",
  "Nothing uploaded here yet. Ask and ye shall (eventually) receive.",
  "Photo gap. William was probably on his phone instead of taking one.",
  "Still empty here — check back once Dad remembers where he put the SD card."
];
