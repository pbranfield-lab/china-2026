/* ============================================================
   SITE VERSION — bump this one line; every page picks it up.
   ============================================================ */
const SITE_VERSION = "1.1.0";

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
   FAMILY DATA — portrait files are optional, looked up in Photographs/forbidden-city/
   ============================================================ */
const FAMILY = [
  { id:"mum", name:"Xianghong", role:"Argues With Everyone, Usually Wins", file:"mum.jpg", emoji:"👑",
    bio:"Mum's Chinese, dead proud of it, and honestly a bit fiery — she'll argue with anyone about anything and normally win. She's got this yellow bag she puts over her hair whenever the sun's out to protect it, which I get major secondhand embarrassment from but also kind of love. If a guide tells her no, she just walks off and asks a different guide the exact same question two minutes later." },
  { id:"dad", name:"Paul", role:"Chief Photography Officer", file:"dad.jpg", emoji:"📷",
    bio:"Dad works in IT, cooks a proper good dinner, and is at the gym more than anyone I know. He watches me play football every week and never misses a Chelsea match either. On this trip his phone was basically glued to his hand taking photos \"for the archive\" — we've seen about six of them." },
  { id:"william", name:"William", role:"18, Never Without His AirPods", file:"william.jpg", emoji:"🙄",
    bio:"My brother, 18, hair like a poodle, AirPods in permanently laughing at something on his phone. He's obsessed with his clothes and his LV bag and reckons that makes him too cool for old buildings. His entire personality is winding me up until I actually want to fight him, and it still works every single time." },
  { id:"maisie", name:"Maisie", role:"Narrator, Striker, Age 11", file:"maisie.jpg", emoji:"✨",
    bio:"Me. I'm sassy, a bit sensitive, and my brother annoys me about nine times a day. I play football, striker, so yes I will size up basically anything like it's a defence I need to get past. Also into Olivia Rodrigo, my phone, and judging stuff on whether I'd actually wear it." }
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
];

/* ============================================================
   PHOTO DATA — add real photo entries here as they're processed.
   location must match a LOCATIONS id above.
   ============================================================ */
const PHOTOS = [
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
];

const EMPTY_STATE_LINES = [
  "No photos here yet. Dad's still \"sorting through the archive.\"",
  "Nothing uploaded here yet. Ask and ye shall (eventually) receive.",
  "Photo gap. William was probably on his phone instead of taking one.",
  "Still empty here — check back once Dad remembers where he put the SD card."
];
