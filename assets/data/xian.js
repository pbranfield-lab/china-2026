/* ============================================================
   XI'AN & THE TERRACOTTA WARRIORS
   One trip, all of its data. Loaded BEFORE assets/data.js, which
   stitches every trip file into the flat TRIPS / FACTS / LOCATIONS /
   PHOTOS globals the rest of the site reads.
   ============================================================ */

const INTRO_XIAN = `
<p>Right, new city, new explaining-what-this-actually-is bit, sorry, but you'll thank me. Xi'an isn't just some random stop, it used to be called Chang'an and it was basically the start of the whole Silk Road, the road that connected China to pretty much everywhere else in the world for trading silk and spices and stuff, thousands of years ago.</p>
<p>The big reason we came though is the Terracotta Army, and honestly the story of how anyone even found it is mad. In <strong>1974</strong> some farmers were just digging a well, an actual well, for water, and hit clay. Not rocks, not mud, an actual soldier's head. That's it. That's how an entire buried army got found, because some blokes needed water.</p>
<p>It all belongs to a guy called <strong>Qin Shi Huang</strong>, the first Emperor of a unified China, he pulled the whole country together in <strong>221 BCE</strong>, and then spent ages building himself an entire underground army to guard his tomb into the afterlife. Thousands of soldiers, horses, chariots, all made of clay, buried in pits near where he's actually buried. He died in <strong>210 BCE</strong>, so he never even got to see if any of it worked.</p>
<p>It's a UNESCO World Heritage Site now, which basically means the whole world agreed it's a big deal. We also went to the actual city wall in the rain, and out at night to a food street that's a thousand years old sat right next to a boulevard that's built to look ancient but is actually properly modern. So this bit of the trip is half ancient clay army, half rainy old wall, half neon lights, which I know is three halves, but that's Xi'an for you.</p>
<p>Mum was well up for this leg, obviously, an entire buried army guarding an emperor's treasure is basically her whole aesthetic. Dad already had memory card space cleared "just for the warriors." Here's what we actually found.</p>
`;

const TRIP_XIAN = {

  trip:
  { id:"xian", name:"Xi'an & the Terracotta Warriors", chinese:"西安 · 兵马俑", city:"Xi'an",
    icon:"🏺", blurb:"An entire clay army nobody knew about until 1974, plus a rainy city wall and a thousand-year-old food street.",
    map:"xian-map.svg", mapAlt:"Schematic plan of the Xi'an trip: the Terracotta Army pits, the city wall, and the old city",
    mapCredit:"Site plan drawn for this page — not to scale.",
    photoDir:"terracotta-warriors",
    hero:"Photographs/terracotta-warriors/city-wall-gate-tower.jpg",
    intro: INTRO_XIAN },

  facts: [
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
  ],

  locations: [
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
  ],

  photos: [
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
    credit:{ author:"Wang Zhongyin", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
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
    credit:{ author:"Qianeal", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"The sign pointing to the Great Mosque, persimmon cakes hanging up right underneath it like nothing.",
    detail:`<p>This is a street corner in the Muslim Quarter, daytime, with a blue road sign pointing towards the Xi'an Great Mosque, written in Chinese and English both. Underneath it there's a whole rack of persimmon cakes hanging up to dry, plus food stalls either side selling snacks and pastries, and shop signs stacked up above everything in Chinese.</p>
    <p>The Muslim Quarter's home to Xi'an's Hui Muslim community, and it's been here for over a thousand years, going right back to Silk Road trading days. The Great Mosque itself is the biggest of ten mosques in this part of the city, tucked away just off this street.</p>
    <p>Even just from this one corner you can tell it's a proper working street, not a set-up-for-tourists version of one, carts, covered stalls, stacked signage, actual daily business going on.</p>` },
  { id:"x21", location:"xian-by-night", file:"muslim-quarter-xiyangshi-arch.jpg",
    credit:{ author:"thierrytutin", license:"CC BY 2.0", licenseUrl:"https://creativecommons.org/licenses/by/2.0/" },
    caption:"The archway into Xiyangshi, one of the old market lanes, packed out even in the daytime.",
    detail:`<p>This is the archway leading into 西羊市, Xiyangshi, which translates to "West Sheep Market," one of the named lanes running through the Muslim Quarter. The street underneath's absolutely packed with people even in broad daylight, stalls either side selling meat and food, proper old carved wooden shopfronts either side of the arch itself.</p>
    <p>Streets like this have been part of Xi'an's food and trading scene for over a thousand years, right back to when this city was the actual starting point of the Silk Road, so the crowds and the stalls aren't a new thing at all, people have been doing exactly this here for centuries.</p>
    <p>Proper contrast to Ever-Bright City's neon version of "old," this one's the real deal, just getting on with it in the daytime instead of putting on a show at night.</p>` }
  ]
};
