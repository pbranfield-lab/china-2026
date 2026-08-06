/* ============================================================
   SITE VERSION — bump this one line; every page picks it up.
   ============================================================ */
const SITE_VERSION = "1.0.0";

/* ============================================================
   HISTORY INTRO — Maisie's opening narration
   ============================================================ */
const HISTORY_INTRO = `
<p>Okay so before I tell you about our actual trip, Dad says I have to give you "context," which is his favourite word this year. Fine. Here's the boring-important bit, but I promise I'll make it good.</p>
<p>The Forbidden City is basically the world's biggest, poshest house, built for one family: the Emperor of China's family. A guy called the Yongle Emperor started building it in 1406, and it took <strong>fourteen years</strong> and over a <strong>million workers</strong> to finish it. Fourteen years! My extension Lego set took me a whole weekend and I nearly cried.</p>
<p>Once it was done, in 1420, it became home to the Emperor of China for the next <strong>492 years</strong> — that's 24 different emperors, from two different dynasties (the Ming lot, then the Qing lot), all living in the same enormous house until 1912, when China stopped having emperors altogether.</p>
<p>And it's not called "Forbidden" for a laugh. Ordinary people literally weren't allowed in. There's a wall over 10 metres high all the way round, and a moat outside that — 52 metres wide — so basically a massive castle with extra steps. Officially it has <strong>8,707 rooms</strong>, though for ages everyone said it had 9,999.5, because 10,000 whole rooms was only allowed for Heaven, and even the Emperor wasn't cheeky enough to build a full ten thousand. I respect that, actually.</p>
<p>Mum has decided that because she's Chinese, this is basically her family home, and she is its rightful Queen, returning at last. She informed the man at the ticket desk of this. He did not seem especially moved. William informed Mum that "Queen of China" is not, technically, a real historical title, and Mum informed William that he could walk home. He did not walk home. He also did not stop bringing it up for the rest of the day, which, fair play, I'd have done the same.</p>
<p>Anyway. Here's what actually happened when we went in.</p>
`;

/* ============================================================
   FAMILY DATA — portrait files are optional, looked up in Photographs/
   ============================================================ */
const FAMILY = [
  { id:"mum", name:"Xianghong", role:"Self-Appointed Queen of China", file:"mum.jpg", emoji:"👑",
    bio:"Mum. Chinese, extremely proud of it, and has decided this trip is technically a homecoming. Bosses tour guides around like she trained them personally. Translates things with way more confidence than accuracy." },
  { id:"dad", name:"Paul", role:"Chief Photography Officer", file:"dad.jpg", emoji:"📷",
    bio:"Dad. Works in IT, treats the trip like a server migration — very organised, slightly stressed. Took roughly 400 photos \"for the archive.\" We have seen maybe six of them." },
  { id:"william", name:"William", role:"Reluctant Tourist, Age 18", file:"william.jpg", emoji:"🙄",
    bio:"My brother. Quiet, studious, and way too into his designer clothes and his LV man bag. Dry as anything — his jokes land so flat you almost miss them. His entire hobby is winding me up until I want to actually fight him." },
  { id:"maisie", name:"Maisie", role:"Narrator, Age 11, Certified Genius", file:"maisie.jpg", emoji:"✨",
    bio:"Me. I'm writing this whole website, so I get to decide who comes across well. (It's me. I come across well.)" }
];

/* ============================================================
   LOCATION DATA — map pins, positioned as % over assets/forbidden-city-map.png
   (coordinates read off the real labeled plan: A=Meridian Gate, B=Divine Might Gate,
   F=Gate of Supreme Harmony, G=Hall of Supreme Harmony, L=Palace of Heavenly Purity,
   M=Imperial Garden, O=Palace of Tranquil Longevity)
   ============================================================ */
const LOCATIONS = [
  { id:"meridian-gate", num:1, x:50.0, y:91.1,
    name:"Meridian Gate", chinese:"午门 (Wǔmén)",
    story:`<p>This is the front door — if your front door were five gates wide and guarded for six hundred years. There are five openings, and historically only the Emperor was allowed to walk through the middle one. Not even his own mother got to use it. The only other people who ever could were the Empress, once, on her wedding day, and the top three scorers of the imperial exam, once, in their whole lives.</p>
    <p>Mum walked straight through the middle gate. A guide actually stopped her. She was delighted about this, honestly — "see, they know a queen when they see one," she said, while being redirected to the side entrance like everyone else.</p>
    <p>Fun/horrible fact: this gate was also where officials could be publicly flogged if the Emperor was really unhappy with them. Imagine getting told off at the front door of your office. In front of everyone. With a stick.</p>`,
    william:"\"It's a gate. We queued forty minutes for a gate.\" — William, before taking eleven photos of the gate." },
  { id:"golden-water", num:2, x:50.4, y:76.2,
    name:"Gate of Supreme Harmony & the Golden Water", chinese:"太和门 · 内金水桥",
    story:`<p>Just past the first gate there's a curvy little river with five white marble bridges over it, all lined up like a fan. From above they're meant to look like the jade decorations on the Emperor's belt, which is a very extra way to design a bridge, but also I respect the commitment.</p>
    <p>Each bridge represents one of the five Confucian virtues (benevolence, righteousness, that sort of thing) — again, only the Emperor got the middle bridge. Are you sensing a theme? Everything in this place has a "not for you" middle bit.</p>
    <p>This is also roughly where Dad discovered the panorama setting on his phone and did not stop using it for the rest of the holiday.</p>`,
    william:"\"Why is there a moat inside the other moat.\" — William, missing the point entirely." },
  { id:"supreme-harmony", num:3, x:50.4, y:59.8,
    name:"Hall of Supreme Harmony", chinese:"太和殿 (Tàihédiàn)",
    story:`<p>This is the big one — the largest wooden building in the whole complex, and the most important. It's where emperors were officially crowned and where the really massive ceremonies happened. The Dragon Throne sits right in the middle, up on a platform, so everyone had to look up at the Emperor, which is basic but effective bullying, historically speaking.</p>
    <p>On the roof corners there are little rows of mythical animal statues — the more of them a roof has, the more important the building is. This roof has the maximum number allowed anywhere in China: ten. No other building was allowed that many. It's basically the building equivalent of arriving with the most badges on your blazer.</p>
    <p>Mum stood in front of the throne and said, quietly but not that quietly, "finally, some proper furniture." A security guard looked over. We moved on quickly.</p>`,
    william:"\"Ten roof guys. Counted them. Ten.\" — William, who claimed to be bored, then counted the roof statues." },
  { id:"central-harmony", num:4, x:50.4, y:54.0,
    name:"Hall of Central Harmony", chinese:"中和殿 (Zhōnghédiàn)",
    story:`<p>This one's much smaller and square, tucked right behind the big hall, and it had a much less terrifying job: it's basically where the Emperor sat and had a breather and ran through his lines before the big ceremonies next door. He'd also inspect the seeds here before the spring ploughing ceremony, which — the most powerful man in China, personally checking seeds, is a mental image I will treasure forever.</p>
    <p>Basically it's the world's fanciest "green room." Even emperors got nervous before assemblies, apparently. Comforting, honestly.</p>`,
    william:"\"So it's a waiting room.\" \"It's THE Emperor's waiting room.\" \"Still a waiting room.\"" },
  { id:"preserving-harmony", num:5, x:50.4, y:48.0,
    name:"Hall of Preserving Harmony", chinese:"保和殿 (Bǎohédiàn)",
    story:`<p>This hall hosted the final, hardest stage of the imperial exams — the one the Emperor personally supervised. People studied their entire lives for this. Fail, and you try again in a few years. Pass, and you could become one of the most powerful officials in the country. No pressure at all, then.</p>
    <p>Behind the hall there's an enormous single slab of carved marble on the steps, over 200 tonnes, covered in dragons and clouds. It was dragged here from a quarry miles away, in winter, by pouring water on the road to make an ice slide and hauling it on ropes with hundreds of men and mules. There were no forklifts. There was ice and there was rope and there was a LOT of shouting, probably.</p>`,
    william:"\"Worse than GCSEs,\" said William, about an exam system where losing meant your whole family's future changed. Bold comparison, William." },
  { id:"heavenly-purity-gate", num:6, x:50.4, y:42.0,
    name:"Gate of Heavenly Purity", chinese:"乾清门 (Qiánqīngmén)",
    story:`<p>This gate is the line between the "work" half of the palace (the Outer Court, where all the ceremonies and politics happened) and the "home" half (the Inner Court, where the Emperor's actual family lived). Almost nobody got past this point — officials, guards, most staff, all stopped here.</p>
    <p>Mum tried explaining to the guide that as Queen she technically outranked the boundary. The guide, very politely, disagreed. Mum has added this to her list of grievances against the Chinese government, alongside "the gift shop closed too early."</p>`,
    william:"William didn't say anything here because he was reading the info plaque properly for once. I have screenshotted this moment for future use." },
  { id:"heavenly-purity-palace", num:7, x:50.4, y:32.7,
    name:"Palace of Heavenly Purity", chinese:"乾清宫 (Qiánqīnggōng)",
    story:`<p>This was the Emperor's actual home, back in the Ming dynasty. And it's got the best secret of the whole trip: above the throne there's a plaque that says "Justice and Uprightness," and behind it, the Emperor used to hide a sealed box with the name of his chosen heir written inside — kept secret from EVERYONE, including the heir, until the Emperor died and officials opened it in front of the whole court.</p>
    <p>Imagine your parents wrote down who's inheriting the house in a locked box above the telly and nobody's allowed to open it until they're gone. That is objectively the best sibling-drama-prevention system I have ever heard of and I am furious my parents haven't adopted it.</p>`,
    william:"\"So basically an escape-room prize reveal but for an entire empire.\" — William, actually correct for once." },
  { id:"union-earthly", num:8, x:50.4, y:26.0,
    name:"Hall of Union & Palace of Earthly Tranquility", chinese:"交泰殿 · 坤宁宫",
    story:`<p>The Hall of Union stored the Emperor's official seals — 25 of them, each for a different kind of decree — basically the world's most heavily guarded stamp collection. It also symbolised the marriage of Emperor and Empress, which is a nice idea for a room absolutely full of paperwork.</p>
    <p>Next door, the Palace of Earthly Tranquility was the Empress's home in the Ming dynasty. Later, in the Qing dynasty, one room was painted entirely red and turned into the wedding chamber for the Emperor's wedding night — decorated in red for good luck, which, sure, but also it's a lot of red.</p>
    <p>Mum stood in the doorway of the wedding chamber for a suspiciously long time.</p>`,
    william:"\"A whole room just for stamps.\" \"Seals, William, they're called seals.\" \"Stamps.\"" },
  { id:"imperial-garden", num:9, x:50.4, y:19.1,
    name:"Imperial Garden", chinese:"御花园 (Yùhuāyuán)",
    story:`<p>Finally — trees! After a solid morning of enormous stone halls, the Imperial Garden is all twisty ancient cypress trees (some of them 500+ years old), rockeries, little pavilions and actual shade. Some of the trees have grown wrapped around each other and are called "lianli" trees, an old symbol for love and loyalty, which is unbearably sweet for a tree.</p>
    <p>This is the one spot where William put his phone away without being asked, sat on a bench, and admitted — quietly, like it cost him something — that it was "actually pretty nice, I guess." Historic moment. I have witnesses.</p>`,
    william:"\"...yeah okay this bit's actually pretty nice.\" — William, aged 18, growing as a person, briefly." },
  { id:"six-palaces", num:10, x:21.0, y:22.5,
    name:"The Six Palaces (East & West)", chinese:"东六宫 · 西六宫",
    story:`<p>Rows of smaller palaces either side of the main path, where the Emperor's mum, wives, concubines and children actually lived — and where basically all the best gossip happened. This is where a low-ranking concubine called Cixi lived before she eventually became the most powerful person in China for decades, ruling as Empress Dowager long after her husband and son had died. Absolute glow-up. Ultimate underdog story. I need it as a film.</p>
    <p>Mum said this proves "anyone can become Queen with the right attitude," which is doing a lot of work as a life lesson to tell your 11 year old, but okay, Mum.</p>`,
    william:"\"So it's basically a reality TV show but everyone could also have you executed.\" — William, weirdly good take." },
  { id:"treasure-gallery", num:11, x:79.3, y:34.6,
    name:"Palace of Tranquil Longevity: Nine-Dragon Screen & Treasure Gallery", chinese:"宁寿宫 · 九龙壁 · 珍宝馆",
    story:`<p>A wall of nine enormous glazed-tile dragons, built to look powerful and scare off evil spirits — there are only three of these Nine-Dragon Screens left in the whole of China, and this is one of them. Just behind it, the Treasure Gallery is full of the actual imperial bling: gold, jade, insanely elaborate hairpieces, and a jade cabbage that people queue for like it's a rollercoaster (it is, for some reason, extremely famous).</p>
    <p>Dad tried to photograph every single case. We had to physically remove him.</p>`,
    william:"\"There's a famous vegetable in here and people are CRYING over it\" — William, about the jade cabbage, not wrong." },
  { id:"divine-might", num:12, x:50.4, y:6.5,
    name:"Gate of Divine Might", chinese:"神武门 (Shénwǔmén)",
    story:`<p>The north exit — and the end of the visiting route. From here you can look back across the moat at Jingshan Hill, an artificial hill made from all the earth dug out to build the moat in the first place (very efficient, no waste, would recommend to my school's recycling scheme).</p>
    <p>It's also a genuinely sad spot in the history: in 1644, as rebels closed in on the city, the last Ming emperor, Chongzhen, climbed that hill and hanged himself rather than be captured, ending the entire Ming dynasty. Heavy way to finish a tour, I know.</p>
    <p>We got ice cream right after. Mum declared the trip "a triumphant royal return." William said his legs were "literally going to fall off." Dad checked how many photos he'd taken (412). I decided I was going to make a website about it. You're reading it.</p>`,
    william:"\"My legs are literally going to fall off.\" — William, upon completing a walk that Dad's watch measured at 3.1 miles." }
];

/* ============================================================
   PHOTO DATA — add real photo entries here as they're processed.
   location must match a LOCATIONS id above.
   ============================================================ */
const PHOTOS = [
  { id:"p1", location:"meridian-gate", file:"meridian-gate-crowds.jpg",
    caption:"Turns out about forty thousand other people had the same idea about visiting on a Wednesday morning.",
    detail:`<p>This is literally the first five minutes. We hadn't even got through the gate yet and already there was a queue snaking behind those red barriers as far back as I could see. Beijing in August, for the record, is not "warm." It is a full-body event.</p>
    <p>Look at the actual gate towers in the background though — those tall bits at the corners aren't just decoration, they're proper watchtowers (called "que," if you're William and need to know the technical name to feel smug about it). So it's not really a gate, it's a fortress with a doorway, built specifically to make you feel small and a bit intimidated before you're even allowed in. Historically: worked exactly as planned. Six hundred years later: also worked on us, mostly because of the queue.</p>
    <p>Dad was somewhere behind me faffing with camera settings, missing the actual moment, as is tradition. Mum had already started telling a nearby staff member that queueing "wasn't necessary for her," which, again, not historically true, but you have to admire the confidence.</p>` },
  { id:"p1b", location:"meridian-gate", file:"meridian-gate-approach.jpg",
    caption:"Even the pigeons just fly straight in. No one checks their tickets.",
    detail:`<p>Mid-queue, a pigeon just casually flew straight over the wall like the whole "Forbidden City" thing wasn't even a rule that applied to it. Genuinely feels a bit unfair after everything I just told you about who was and wasn't allowed through this gate for six hundred years. Turns out the one loophole in imperial security was: have wings.</p>
    <p>You can see the crowd properly here — everyone bunched up along the path under the one bit of tree shade going, which by about 9:30am was already prime real estate. Some very brave/very lost tourist in a blue bag was cutting straight across everyone's photos, main character energy, no notes.</p>
    <p>This is basically the calm before the calm — we hadn't even reached the middle-gate drama yet (spoiler: Mum tried it). Right now it was just heat, a slowly shuffling queue, and Dad still not in position for the photo. Some things never change.</p>` },
  { id:"p2", location:"meridian-gate", file:"tunnel-view-in.jpg",
    caption:"The actual first photo of the day — through the tunnel, looking in, before we knew what we were signing up for.",
    detail:`<p>This was taken about four seconds after we handed our tickets over, so past-me in this photo has no idea what's coming. Ahead through the arch is the courtyard leading up to the Gate of Supreme Harmony, already rammed with people.</p>
    <p>Keep this one in your head, because right at the very end of the day I got the exact same shot facing the OTHER way, out through the north gate. Proper bookend. Very proud of past-me for accidentally being a photographer.</p>
    <p>Also it was already stupidly hot in this tunnel and we hadn't even started walking yet. I wanna say it was a preview. It was a threat.</p>` },
  { id:"p3", location:"meridian-gate", file:"meridian-sign.jpg",
    caption:"The 'we are actually here' photo, taken while it was already roasting and still technically morning.",
    detail:`<p>The front of the Meridian Gate from outside, battlements either side like it's expecting an attack, and the big sign across the middle reading 故宫博物院 — Palace Museum, basically "yes, you're in the right place, stop asking."</p>
    <p>It was about half nine here and I was already sweating through my going-to-look-nice-in-photos outfit, which, for the record, I do not appreciate. Beijing in August has zero chill.</p>
    <p>Mum stood directly under the sign like she was being formally welcomed home. Nobody else noticed. I noticed. I'm noticing it again right now, writing this.</p>` },
  { id:"p4", location:"golden-water", file:"five-bridges.jpg",
    caption:"Five bridges, one of them royalty-only, all of them baking in the sun.",
    detail:`<p>The courtyard just past the entrance, with the five marble bridges over the Golden Water — from above they're meant to look like the jade bits on the Emperor's belt, which is a lot of design effort for a bridge.</p>
    <p>The white marble was basically reflecting the sun straight back up at us. I'm traumatised by this bridge specifically, it was like walking across a frying pan.</p>
    <p>Would I wear marble. No. Would the Emperor have made me walk the side bridge anyway. Also no doubt.</p>` },
  { id:"p5", location:"golden-water", file:"bronze-lion.jpg",
    caption:"This lion has seen some things and honestly looked as done with the heat as I was.",
    detail:`<p>One of the huge bronze guardian lions outside the Gate of Supreme Harmony — paw resting on an embroidered ball, standing for the Emperor's power over the whole world, which is a lot of pressure to put on one paw.</p>
    <p>All that green is centuries of weather, not paint. It was hot enough that the bronze was probably genuinely hot to touch. No shade, no water bottle, no complaining rights either. Respect.</p>` },
  { id:"p6", location:"golden-water", file:"courtyard-umbrellas.jpg",
    caption:"Every umbrella here is on sun duty, not rain duty.",
    detail:`<p>Look how many umbrellas are up with not a cloud doing anything threatening — that's a "the sun is trying to kill us" thing, not a rain thing. Very sensible. Wish we'd brought one.</p>
    <p>This is roughly the walk from the entrance towards the Three Great Halls, and it does not feel short at a Dad-approved sightseeing pace with William complaining every third step.</p>` },
  { id:"p7", location:"supreme-harmony", file:"fire-cisterns.jpg",
    caption:"Giant bronze vats I would 100% have climbed into if security wasn't standing right there.",
    detail:`<p>These bronze cauldrons dotted around the halls aren't decorative — proper fire-fighting water tanks. Makes sense when your entire palace is wood and flammable paint: you want backup water on every corner.</p>
    <p>In winter they used to wrap these in padded covers and light fires underneath so the water wouldn't freeze. No such problem in August. I wanna say the water in there was basically soup by lunchtime.</p>` },
  { id:"p8", location:"supreme-harmony", file:"roofline-bird.jpg",
    caption:"The famous roof guys, up close, plus a bird who does not care about any of this.",
    detail:`<p>The actual roofline — the row of mythical animal statues marching down from the dragon at the front. Hall of Supreme Harmony has the full ten, the maximum allowed anywhere in China.</p>
    <p>Dad zoomed all the way in for this one, properly committed. Bird flew through mid-shot for free. Genuinely his best photo of the day and he doesn't know it yet.</p>` },
  { id:"p9", location:"supreme-harmony", file:"plaza-balloon.jpg",
    caption:"The scale of this place only really hits you once you're crossing it on foot.",
    detail:`<p>This stretch of stone between the gates is deceptively massive — looks like a five minute walk in a photo, is not a five minute walk at 30-odd degrees with zero shade anywhere on it.</p>
    <p>Somebody's kid had a yellow balloon and I have never related to an inanimate object more. It looked like it also wanted to go home.</p>` },
  { id:"p10", location:"central-harmony", file:"twin-hall-roofs.jpg",
    caption:"Spot the difference: Central Harmony's neat little roof versus Supreme Harmony being extra as usual.",
    detail:`<p>The smaller building with the pointier, more pavilion-shaped roof is the Hall of Central Harmony — basically a green room, where the Emperor sat and had a breather before the big ceremonies next door in the massive hall behind it.</p>
    <p>I like that even the ROOFS have a hierarchy here. Nothing in this place is allowed to just be normal-sized.</p>` },
  { id:"p11", location:"central-harmony", file:"family-central-hall.jpg",
    caption:"Proof of life: me, William, and the Queen of China, still standing, barely.",
    detail:`<p>Actual real family photo, taken between the halls with the twin roofs behind us. Everyone's smiling, nobody mentions how much everyone's sweating — unspoken rule of holiday photos.</p>
    <p>Mum's doing her "returning monarch" pose. William's doing his "I am only here under duress" pose, which is basically his passport photo face now. I'm doing my "I'm traumatised by this heat but I still look cute" pose. It's a skill.</p>
    <p>Nobody told Dad to get in the shot because Dad is never in the shot. Dad IS the shot. Dad is permanently behind the camera "for the archive."</p>` },
  { id:"p12", location:"preserving-harmony", file:"gate-transition.jpg",
    caption:"Yet another gate. There are so many gates. I wanna count them, actually — no. Too hot.",
    detail:`<p>Threading through toward the next stretch of the Three Great Halls — every section of this place has its own gate, like the palace equivalent of badging in and out of every single room at work.</p>
    <p>By this point we'd found our walking rhythm: walk, stop for a photo, complain about the heat, repeat.</p>` },
  { id:"p13", location:"preserving-harmony", file:"family-terrace-1.jpg",
    caption:"Three of us, one very long imperial corridor, several complaints about the heat.",
    detail:`<p>William, Mum, and me on the marble terrace, one of the huge covered galleries running off behind us — these long corridors line pretty much every courtyard here, originally used by guards and staff moving around without cutting across the ceremonial spaces.</p>
    <p>Would I wear marble platforms as shoes. Genuinely considered it by this point. My actual shoes felt like they were melting.</p>` },
  { id:"p14", location:"preserving-harmony", file:"family-terrace-2.jpg",
    caption:"Same spot, slightly more done with life.",
    detail:`<p>Round two of the terrace photo, because apparently one wasn't enough evidence we survived this bit. More of the Three Great Halls complex stretching off behind us — it just keeps going.</p>
    <p>Mum still smiling like she's on a diplomatic visit. I am not. I'm traumatised by how far we'd walked and how far we still had to go.</p>` },
  { id:"p15", location:"preserving-harmony", file:"skyline-view.jpg",
    caption:"Six-hundred-year-old roofs, brand new Beijing skyscrapers, all in one photo.",
    detail:`<p>From the terrace you can actually see modern Beijing poking up over the palace walls in the distance — ancient roof tiles in the foreground, glass skyscrapers doing their own thing behind it, like two different centuries agreed to share a photo.</p>
    <p>William pointed this out himself before I could. Written down as evidence. He will deny this forever.</p>` },
  { id:"p16", location:"preserving-harmony", file:"throne-peek.jpg",
    caption:"Sneaking a look at an actual throne through the crowd.",
    detail:`<p>You're not allowed inside the halls, just allowed to cram up against the doorway with fifty other people and peer in. That's a real throne in there, and the sign above it reads 皇建有极, roughly "the sovereign establishes the ultimate standard" — a lot to put above a chair.</p>
    <p>I wanna go in properly one day, when I'm Empress. Small goal. Working on it.</p>` },
  { id:"p17", location:"heavenly-purity-gate", file:"gate-crowd.jpg",
    caption:"The line between 'palace as workplace' and 'palace as actual home' starts right here.",
    detail:`<p>Everything up to this gate was offices and ceremony halls. Past this point is where the Emperor's actual family lived, and almost nobody outside the household ever got this far in six hundred years of history.</p>
    <p>We got this far in about forty minutes, mostly by being extremely sweaty and persistent.</p>` },
  { id:"p18", location:"heavenly-purity-gate", file:"gilded-lion.png",
    caption:"This lion is gold, not green-bronze, which means we're getting closer to where it really mattered.",
    detail:`<p>The lions get fancier the deeper into the palace you go — full gilt here, not the plain bronze ones by the front entrance. Basically the palace's own way of telling you "you're VIP now."</p>
    <p>Would I wear gold. Yes. Obviously. No notes.</p>` },
  { id:"p19", location:"heavenly-purity-palace", file:"maisie-solo.jpg",
    caption:"Me, several hours in, cap on, freckles multiplying by the minute.",
    detail:`<p>Official website narrator selfie. That's the inner courtyard behind me, still absolutely packed this deep into the visit. The cap was 100% necessary, not a fashion choice — though it did also look good, so, both things.</p>
    <p>I'm traumatised by how sunburnt my nose actually was, this photo undersells it.</p>` },
  { id:"p20", location:"heavenly-purity-palace", file:"family-hanfu-bg.jpg",
    caption:"Us three, plus randoms in the background doing full hanfu cosplay, living their best lives.",
    detail:`<p>See the people in the pink and patterned robes behind us? You can actually rent traditional Ming/Qing-style outfits near some of these courtyards and get proper in-character photos done — a lot of visitors do it, and the outfits are stunning.</p>
    <p>Mum clocked it instantly and asked how much. Dad said no, we were running late. Mum has not forgiven this. If we ever go back, she IS wearing the robes. There is no version of the future where that doesn't happen.</p>` },
  { id:"p21", location:"heavenly-purity-palace", file:"wide-courtyard.jpg",
    caption:"Another courtyard, another few hundred people, another hall in the distance.",
    detail:`<p>Genuinely lost count of how many courtyards like this we walked through — every one grand enough to be the main event somewhere else in the world, and here it's just the walk between two other buildings.</p>` },
  { id:"p22", location:"heavenly-purity-palace", file:"mum-maisie-close.jpg",
    caption:"Me and the Queen of China, mid-reign.",
    detail:`<p>Just me and Mum. She still had that "I have returned to my kingdom" glow going, hours in, full heat, no signs of slowing down. Genuinely impressive stamina for someone who also complained about the gift shop hours.</p>
    <p>I wanna know where she gets the energy. Teenager me is taking notes for later.</p>` },
  { id:"p23", location:"six-palaces", file:"shaded-corridor.jpg",
    caption:"First proper shade of the entire day. Genuinely emotional.",
    detail:`<p>Ducking into one of the narrower corridors between the smaller residential palaces and getting actual shade for the first time in hours — this is where the wider family, wives, and children actually lived, so the buildings are more human-sized than the giant ceremonial halls up front.</p>
    <p>I'm traumatised by how much better I felt the second there was shade. It's the little things.</p>` },
  { id:"p24", location:"six-palaces", file:"quiet-courtyard.jpg",
    caption:"Wandering the quieter bit, where the actual gossip happened.",
    detail:`<p>Deep in the residential side of the complex — smaller courtyards, fewer crowds, way more atmosphere. This is genuinely where all the best real history happened: alliances, rivalries, a low-ranking concubine called Cixi living in a courtyard exactly like this one before she ended up running the entire country.</p>` },
  { id:"p25", location:"six-palaces", file:"narrow-alley-gate.jpg",
    caption:"Absolute maze back here. Pretty sure we walked past this exact gate twice.",
    detail:`<p>Every lane through the residential palaces looks almost identical to the last — same red walls, same style of gate, a different name plaque you can't quite read before you're swept along by the crowd.</p>
    <p>I wanna say we had a system for not getting separated. We did not have a system.</p>` },
  { id:"p26", location:"union-earthly", file:"door-studs.png",
    caption:"Counted the studs. Nine rows, nine each. Not an accident.",
    detail:`<p>Big red double doors like this show up all over the deepest, most important parts of the palace, and the gold studs are always nine by nine — eighty-one total. Nine was THE number for the Emperor, the most senior number there is, so a 9x9 grid of studs is basically shouting "top tier access only."</p>
    <p>The same pattern shows up again right at the end of the day, near the north gate. Once you notice it you can't stop noticing it — it's the palace's version of a security clearance badge.</p>` },
  { id:"p27", location:"union-earthly", file:"dad-resting.jpg",
    caption:"Dad finally sat down. Historic moment, arguably more significant than the palace itself.",
    detail:`<p>Somewhere in the corridor heading toward the garden gate, Dad parked himself on a step while everyone else kept walking. In fairness, his feet had earned it.</p>
    <p>I'm traumatised by how much walking we'd done and we STILL hadn't reached the garden. This place does not end.</p>` },
  { id:"p28", location:"imperial-garden", file:"qinandian-crane.jpg",
    caption:"A bronze crane on permanent guard duty outside a Taoist hall.",
    detail:`<p>This courtyard belongs to the Hall of Imperial Peace, a proper Taoist temple inside the palace, dedicated to a god of the northern heavens. The bronze crane and the huge incense burners are all symbols of long life — cranes are right up there with turtles and pine trees in Chinese art.</p>
    <p>Mum informed us she also expects a bronze crane guarding HER house from now on, as Queen. Noted. Not actioning it.</p>` },
  { id:"p29", location:"imperial-garden", file:"qinandian-censer.jpg",
    caption:"Same hall, different angle, still absolutely dripping in incense burners.",
    detail:`<p>More of the Hall of Imperial Peace courtyard — the actual hall entrance behind the crane statue, plus a second big censer on the right. This space felt properly different to the ceremonial halls up front — quieter, more like an actual place of worship than a stage set.</p>` },
  { id:"p30", location:"imperial-garden", file:"cypress-courtyard.jpg",
    caption:"Finally. Trees. Real, actual, shade-providing trees.",
    detail:`<p>After a solid morning of stone and marble and zero mercy from the sun, hitting the Imperial Garden and its ancient cypress trees felt like walking into a different holiday. Some of these are genuinely centuries old.</p>
    <p>I wanna live under one of these trees. Permanently. Sign me up.</p>` },
  { id:"p31", location:"imperial-garden", file:"maisie-rockery.jpg",
    caption:"Me, unbothered, in front of a six-hundred-year-old rock pile that's fancier than it sounds.",
    detail:`<p>That jagged rock formation behind me is a proper feature, not leftover building material — Chinese imperial gardens use these craggy "scholar's rocks" on purpose, to look like miniature mountains. There's an old pavilion half-buried in ivy just visible behind it too.</p>
    <p>Would I decorate my room with a giant rock like this. Unclear. Ask me again after I've seen the rest of it.</p>` },
  { id:"p32", location:"imperial-garden", file:"family-garden-flowers.jpg",
    caption:"All three of us, finally smiling for real, not just for-the-camera smiling.",
    detail:`<p>First photo all day where nobody looks held hostage by the heat — the shade and the flowers (proper purple crepe myrtle, in case you wondered) put everyone in a noticeably better mood, mine included.</p>
    <p>Mum's arm is basically permanently around me in every photo from here on. I'm allowing it.</p>` },
  { id:"p33", location:"imperial-garden", file:"hill-stele.jpg",
    caption:"The actual Hill of Accumulated Elegance, several history facts deep by this point.",
    detail:`<p>This rockery isn't random — it's the base of 堆秀山, the Hill of Accumulated Elegance, built in 1583. There's a small stone marker here, and at the base of the mound are two carved stone pieces that used to be part of a fountain — water was pumped up and jetted out of carved dragon mouths, a genuinely wild bit of Ming-dynasty plumbing showing off.</p>
    <p>Those pale, smooth, almost ghostly-looking trees nearby are lacebark pine, a proper Beijing speciality, slow-growing enough that some might be as old as the hill itself.</p>` },
  { id:"p34", location:"imperial-garden", file:"pavilion-trees.jpg",
    caption:"A little red pavilion basically swallowed by ancient trees. Very aesthetic. Ten out of ten.",
    detail:`<p>Tucked away in the garden, half-shaded by trees clearly older than any of us combined — the kind of spot photos never quite do justice to, you actually have to stand in it.</p>
    <p>William didn't even complain here. Choosing to remember that as a personality change and not just shade-related relief.</p>` },
  { id:"p35", location:"imperial-garden", file:"rockery-guard.jpg",
    caption:"A security guard now permanently stationed to stop people climbing six-hundred-year-old rocks. Fair enough, really.",
    detail:`<p>These craggy limestone rockeries look extremely climbable, which is presumably why there's a guard right here making sure nobody tries it. Can't blame anyone for wanting to — best climbing frame in the world.</p>` },
  { id:"p36", location:"imperial-garden", file:"bronze-censer.jpg",
    caption:"This tiny bronze gazebo is actually an incense burner and I am obsessed with it.",
    detail:`<p>A proper little bronze pavilion, roof and all, sat in its own fenced-off spot in the garden — an incense burner used during temple ceremonies at the Hall of Imperial Peace nearby. Might be the single most detailed object we saw all day.</p>
    <p>Would I wear this as a necklace if it were smaller. Yes. Immediately.</p>` },
  { id:"p37", location:"imperial-garden", file:"dougong-eave.jpg",
    caption:"Dad's actual best photo of the whole day and he has no idea.",
    detail:`<p>Straight up underneath a corner eave, and it shows you the whole roof system at once. That dense honeycomb of interlocking wooden blocks in the shadow is called dougong — a bracket cluster that holds the roof up without a single nail or bit of glue. Imperial-grade Lego, basically, stacked and cantilevered out to carry the roof's weight back onto the columns — and it can actually flex a bit, which is exactly why these buildings have survived six centuries of Beijing earthquakes while plenty of solid stone buildings around them didn't.</p>
    <p>Look at the rafter ends too — the top row carries a gold symbol on green meaning "ten thousand," and the row under it says "longevity" in little roundels. Together they wish ten thousand years of life on whoever's inside. There's even a little bell on the corner that rings in the wind, one on every corner, all day, every day, for six hundred years.</p>
    <p>I'm traumatised that Dad nearly didn't take this photo because he thought it was "just a roof." It was never just a roof.</p>` },
  { id:"p38", location:"imperial-garden", file:"chishou-dragon.jpg",
    caption:"A dragon carved specifically to spit rainwater out of its mouth. Genuinely incredible use of a dragon.",
    detail:`<p>This carved dragon head — a chishou — sits under the balustrade and its whole job is drainage: its mouth is drilled straight through, so in heavy rain, water shoots out clear of the stonework. With enough of these lined up along a terrace it's called the "thousand dragons spitting" effect, the single greatest name for a plumbing system I have ever heard.</p>
    <p>It's carved from the same block as the balustrade base, not stuck on afterwards, and that black staining around its face isn't damage — it's centuries of Beijing rain and air. This dragon is older than basically everything I own, including my own family's presence in this country.</p>` },
  { id:"p39", location:"imperial-garden", file:"hill-distant.jpg",
    caption:"The whole Hill of Accumulated Elegance, pavilion on top and everything.",
    detail:`<p>Proper view of the rockery hill from earlier — 堆秀山 — with the little pavilion right on top, called 御景亭, the Pavilion of Imperial View. Traditionally it was only climbed once a year, for the Double Ninth Festival, when climbing to high ground was meant to bring good luck.</p>
    <p>We did not climb it. It was hot, there was a queue, and I had already reached my daily limit of "impressive but exhausting." I wanna go back one day just for that climb though.</p>` },
  { id:"p40", location:"divine-might", file:"red-gate-studs.jpg",
    caption:"One more gate. There is always one more gate.",
    detail:`<p>By this point we were deep into "are we nearly out" territory — legs done, water bottles empty, everyone's enthusiasm running on fumes except apparently Mum's. This one's on the final stretch before the actual exit.</p>` },
  { id:"p41", location:"divine-might", file:"shenwumen-outside.jpg",
    caption:"The actual north gate, seen from outside — the one and only exit.",
    detail:`<p>This is 神武门, the Gate of Divine Prowess — the north gate, the one you finally walk out through. Under the Ming and Qing dynasties it housed the drum and bell that timed the ENTIRE palace: the bell struck at dawn, the drum at dusk, then the drum again through the night watches. Everyone inside, from the Emperor down to the kitchen staff, lived by that sound.</p>
    <p>It's also where the last Emperor's story properly ends — Puyi walked out through this exact gate on 5 November 1924, expelled by a warlord's troops after years of technically being Emperor of a palace he wasn't even allowed to leave. The Palace Museum opened here almost exactly a year later. Heavy way to end a tour. But also: we made it.</p>` },
  { id:"p42", location:"divine-might", file:"tunnel-view-out.jpg",
    caption:"The bookend shot — same tunnel view as photo one, but now we're looking OUT.",
    detail:`<p>Remember the very first photo, looking in through the Meridian Gate tunnel at the start of the day? Same kind of shot, opposite end of the palace, looking out — and framed dead centre in the arch is Jingshan hill, with a pavilion on top.</p>
    <p>That hill is artificial — made from all the earth dug out to build the palace moat, piled up on purpose to shield the palace from bad luck coming from the north. A whole hill, built to complete a diagram. I'm traumatised by how much more sense this place makes only now that we're leaving it.</p>` },
  { id:"p43", location:"divine-might", file:"wanchun-pavilion.jpg",
    caption:"The pavilion on top of Jingshan, zoomed all the way in, because we did not have the legs left to actually climb it.",
    detail:`<p>That's 万春亭, the Pavilion of Ten Thousand Springs, sitting 45 metres up at the very top of Jingshan — meant to be an incredible view back down over the whole palace from up there.</p>
    <p>I wanna say we'll climb it next time. William said his legs would need "several years" to recover first.</p>` },
  { id:"p44", location:"divine-might", file:"shenwumen-inside.jpg",
    caption:"Last look back before actually stepping outside for good.",
    detail:`<p>One final glance at the inside of the north gate, 故宫博物院 sign and all, before we walked out into the real world again. Ninety minutes in there — the whole central axis, both inner courtyards, the quieter residential palaces, and the garden. Not bad going, honestly, even with all the complaining.</p>
    <p>Ice cream happened almost immediately after this photo. As it should.</p>` }
];

const EMPTY_STATE_LINES = [
  "No photos here yet. Dad's still \"sorting through the archive.\"",
  "Nothing uploaded here yet. Ask and ye shall (eventually) receive.",
  "Photo gap. William was probably on his phone instead of taking one.",
  "Still empty here — check back once Dad remembers where he put the SD card."
];
