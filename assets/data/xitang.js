/* ============================================================
   XITANG WATER TOWN (西塘)
   One trip, all of its data. Loaded BEFORE assets/data.js, which
   stitches every trip file into the flat TRIPS / FACTS / LOCATIONS /
   PHOTOS globals the rest of the site reads.
   Note the photo folder is spelled "xitan" on disk — photoDir matches
   the folder, not the town's proper spelling.
   ============================================================ */

const INTRO_XITANG = `
<p>Right, this one's completely different to everywhere else we went, because Xitang isn't a city, it's a water town, which means the roads are basically canals and the traffic is boats. It's one of the ancient Jiangnan water towns, Jiangnan meaning south of the Yangtze river, where for centuries everything moved about by water, people, rice, silk, all of it, so the towns just grew up around the canals instead of around streets, and the houses all face the water because the water was the street.</p>
<p>Xitang itself is reportedly about <strong>2,500 years old</strong>, going back to the Spring and Autumn period, when it sat right on the border between two kingdoms called Wu and Yue, who did not get on. So this quiet little lantern town used to be an actual border zone between two lots who were at war half the time, which you would genuinely never guess from looking at it.</p>
<p>The layout sounds made up when you say it as numbers. There's <strong>nine</strong> rivers slicing the town into eight pieces, then <strong>104</strong> stone bridges stitching the eight pieces back together, plus reportedly <strong>122</strong> lanes squeezed in between the houses, some so narrow it's single file with your shoulders in. And <strong>zero</strong> cars in the old town. None. You walk, or a person rows you about in a boat by hand, and those are the options.</p>
<p>The famous bit is the Misty-Rain Corridor, about <strong>1,000 metres</strong> of covered walkway running along the canal, basically a roof over the whole shopping street. It's there because this region does a soft misty drizzle a lot, and hundreds of years ago the shopkeepers roofed the street over so rain couldn't send their customers home. Which worked, because people are still stood under it spending money right now.</p>
<p>Also, and I need you to know this, Tom Cruise has run through here. The end bit of Mission: Impossible III got filmed in Xitang in <strong>2006</strong>, with the canals and corridors pretending to be "Shanghai", so if you've seen that film you've technically already seen this town. And it's been sat on UNESCO's World Heritage waiting list since <strong>2008</strong> as one of the ancient Jiangnan water towns, so it's basically famous twice over.</p>
<p>It's only about <strong>90 kilometres</strong> from Shanghai, an hour and a half-ish, which is why people from the city come out here to escape all the towers for a bit. Oh, and this is the town where I got the full hanfu photo shoot done, studio hair, makeup, the whole ancient-princess thingymajig. The photos are further down. I'm saying nothing else yet.</p>
`;

const TRIP_XITANG = {

  trip:
  { id:"xitang", name:"Xitang Water Town", chinese:"西塘", city:"Xitang",
    icon:"🏮", blurb:"A reportedly 2,500-year-old town where the roads are canals and the traffic is rowing boats — plus my full ancient-princess photo shoot.",
    map:"xitang-map.svg", mapAlt:"Schematic plan of Xitang water town: the canals, the covered corridor, the bridges and the lanes",
    mapCredit:"Site plan drawn for this page — not to scale.",
    photoDir:"xitan",
    hero:"Photographs/xitan/hanfu-parasol-bridge.jpg",
    heroAlt:"A full traditional hanfu costume with a calligraphy parasol, posed in front of a stone arch bridge over the Xitang canal",
    intro: INTRO_XITANG },

  facts: [
    { stat:"1,000 m", label:"of covered corridor",
      q:"How long is the covered corridor that runs along the canal?",
      text:`The Misty-Rain Corridor is about <strong>1,000 metres</strong> of roofed-over walkway running along the canal, so the whole shopping street basically has a lid on it. It got built so rain couldn't send anyone home, and hundreds of years later it's still doing exactly that job.` },
    { stat:"2,500", label:"years old, reportedly",
      q:"How many years old is Xitang, reportedly?",
      text:`Xitang is reportedly about <strong>2,500 years old</strong>, going back to the Spring and Autumn period, when it sat right on the border between the Wu and Yue kingdoms. So the quiet little lantern town used to be the edge between two kingdoms that properly did not get on. No way, honestly.` },
    { stat:"80 cm", label:"the narrowest lane",
      q:"How wide is Shipi Lane at its narrowest?",
      text:`Shipi Lane is <strong>80 centimetres</strong> across at its narrowest, which is single file whether you like the person behind you or not. Look up and the sky's just one thin stripe squeezed between the roofs, which is why people call it "one line of sky".` },
    { stat:"2006", label:"when Tom Cruise ran through",
      q:"What year did Tom Cruise come sprinting through Xitang?",
      text:`The finale of Mission: Impossible III got filmed here in <strong>2006</strong>, so Tom Cruise has genuinely legged it through these exact canal-side streets. In the film it's all pretending to be "Shanghai", but it's Xitang, so this little town has been in a bigger film than most actual cities.` },
    { stat:"9", label:"rivers slicing the town",
      q:"How many rivers slice the town into pieces?",
      text:`<strong>Nine</strong> rivers run through the town, slicing the whole place into eight separate pieces. The town didn't get built first with water added after, the water was already there, and the town just grew up round it.` },
    { stat:"104", label:"stone bridges",
      q:"How many stone bridges stitch the town back together?",
      text:`<strong>104</strong> stone bridges stitch the eight pieces of town back together, so you're basically never not near one. Some are flat little slabs and some arch right up so the boats can slide underneath.` },
    { stat:"122", label:"lanes, reportedly",
      q:"How many lanes reportedly thread between the houses?",
      text:`There are reportedly <strong>122</strong> lanes threading between the houses, some of them proper deep and dark and about a shoulder wide. They've all got names, and they've all been there for centuries, which is a lot of alleys to keep track of.` },
    { stat:"0", label:"cars in the old town",
      q:"How many cars are allowed in the old town?",
      text:`There are <strong>zero</strong> cars in the old town. None at all, you walk, or a person rows you about by hand in a boat, and honestly after a day of it, roads start to feel like the weird option.` },
    { stat:"90 km", label:"from Shanghai",
      q:"How far is Xitang from Shanghai?",
      text:`It's about <strong>90 kilometres</strong> from Shanghai, an hour and a half-ish, which makes it the place city people escape to when they've had enough of towers. From one of the biggest cities on Earth to a town where the traffic is rowing boats, in one afternoon.` },
    { stat:"2008", label:"on UNESCO's waiting list since",
      q:"What year did Xitang join UNESCO's World Heritage waiting list?",
      text:`Xitang's been sat on UNESCO's World Heritage tentative list since <strong>2008</strong>, as one of the ancient Jiangnan water towns. So it's officially on the waiting list to be officially a big deal, which, look at it, it clearly already is.` }
  ],

  locations: [
  { id:"yanyu-corridor", num:1, x:40.0, y:55.8,
    name:"Misty-Rain Corridor", chinese:"烟雨长廊 (Yānyǔ Chángláng)",
    story:`<p>This is the famous bit of Xitang, about <strong>1,000 metres</strong> of covered walkway running right along the canal, old dark timber posts holding up a proper tiled roof over the whole street, shops and food places down one side, water down the other.</p>
    <p>The name's about the weather. This part of China does a soft misty drizzle a lot, and hundreds of years ago the shopkeepers roofed the street over so the rain couldn't send their customers home, so it's basically an ancient version of a shopping centre, and it still completely works, rain just isn't a thing here.</p>
    <p>Red lanterns hang the entire way down it, and at night they all come on at once and the light spills out over the canal, which is when this town properly shows off.</p>` },
  { id:"huanxiu-bridge", num:2, x:42.0, y:45.0,
    name:"Huanxiu Bridge", chinese:"环秀桥 (Huánxiù Qiáo)",
    story:`<p>Huanxiu Bridge is the classic one, the big high-arched stone bridge over the main canal, the exact shape everyone draws when they draw a Chinese bridge. The arch goes up that high on purpose, not to show off, boats have to fit underneath it, so the bridge climbs right up over the water in steps and comes back down the other side.</p>
    <p>It's one of the old bridges of the town, and the view from the top of it, straight down the main canal with the old grey roofs stacked up along both banks, is basically the postcard shot of all of Xitang in one go.</p>
    <p>At night it gets lit up gold, and its reflection in the black water nearly closes the arch into a full circle, which is exactly the kind of thing this town does constantly without even trying.</p>` },
  { id:"canal-boats", num:3, x:18.0, y:47.0,
    name:"The Canals", chinese:"水巷 (Shuǐ Xiàng)",
    story:`<p>The canals are the actual roads here, that's the thing to get your head round. <strong>Nine</strong> rivers cut through the town, and for centuries everything moved on them, people, rice, silk, the lot, which is why the houses all face the water and there's steps going down to it everywhere.</p>
    <p>The boats are hand-rowed, a wooden awning over the middle and one long oar at the back that the boatman sculls side to side, no engine, so the loudest thing on the whole canal is the oar. And there are <strong>zero</strong> cars in the old town, so it's genuinely boat or feet, pick one.</p>
    <p>At night the lanterns come on along both banks, the water goes black and shiny and doubles everything, and the boats just slide through the middle of the reflections. Cool doesn't really cover it, but, cool.</p>` },
  { id:"shipi-lane", num:4, x:24.8, y:37.0,
    name:"Shipi Lane", chinese:"石皮弄 (Shípí Nòng)",
    story:`<p>Shipi Lane is famous for basically not being there. It's <strong>80 centimetres</strong> wide at its narrowest, which is single file, shoulders in, no arguments. Look straight up and the sky is one thin stripe squeezed between the rooftops, which is why people call it "one line of sky".</p>
    <p>The name means "stone skin", because the ground is paved with thin slabs of stone laid over a drain running underneath, so the stone's like a skin stretched over the water. Which is honestly a properly good name once you know that.</p>
    <p>Xitang's reportedly got <strong>122</strong> lanes like this threading between the houses, deep dark slots you'd walk straight past, but this one's the star, people genuinely queue up to walk down an alley the width of a door.</p>` },
  { id:"songzilaifeng", num:5, x:57.7, y:26.0,
    name:"Songzilaifeng Bridge", chinese:"送子来凤桥 (Sòngzǐláifèng Qiáo)",
    story:`<p>The name 送子来凤 is a whole thing, it's roughly "delivering sons, the phoenix arrives", because this is supposed to be the lucky bridge, the tradition says crossing it brings good fortune and, quite specifically, babies. It's even got two ways over, a stepped side and a smooth flat side, so everyone can cross it whichever way suits them.</p>
    <p>Then in <strong>2006</strong> it got a completely different kind of famous, because the finale of Mission: Impossible III was filmed in Xitang, and Tom Cruise goes properly sprinting through these canal-side streets. In the film it's all supposed to be "Shanghai". It's not. It's this little town, doing its best acting.</p>
    <p>So it's an ancient luck-and-babies bridge that's also a Hollywood action scene, which is a strange CV for one bridge, but it seems to be handling it.</p>` },
  { id:"photo-shoot", num:6, x:81.0, y:35.0,
    name:"The Photo Shoot", chinese:"汉服写真 (Hànfú Xiězhēn)",
    story:`<p>All over Xitang there are these hanfu photo studios, and what they do is the absolute full works. They put you in proper traditional hanfu robes, do full studio hair with pins and pearl strings and hairpieces, full makeup, hand you props like fans and parasols, and then an actual photographer walks you round the town shooting you against the canals and bridges like it's a magazine cover situation.</p>
    <p>It's massive here. Half the people you see drifting over the bridges in floaty robes are mid-shoot themselves, so the whole town is basically a film set that never switches off, everyone starring in their own thing at the same time.</p>
    <p>And yes, this is where I got mine done. Full styling, the lot. The photos are in this section, and whatever you think when you see them is in your imagination.</p>` }
  ],

  photos: [
  { id:"t1", location:"yanyu-corridor", file:"corridor-lanterns.jpg",
    credit:{ author:"Veravermouth", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"Red lanterns the whole way down the covered corridor, and it just keeps going.",
    detail:`<p>This is the Misty-Rain Corridor in the daytime, dark old timber posts and a proper wooden roof overhead, red and gold lanterns hanging the entire way down, and old dark wooden shopfronts along one side with the stone paving running off into the bright light at the end.</p>
    <p>The corridor runs about <strong>1,000 metres</strong> along the canal, and it exists so rain never stops anyone, the whole street's got a lid on it, you just carry on. Smart, honestly.</p>` },
  { id:"t2", location:"canal-boats", file:"canal-night-lanterns.jpg",
    credit:{ author:"そらみみ (Soramimi)", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"The canal at night, with all the shop lights and lanterns melting into the black water.",
    detail:`<p>This is one of the wide canals after dark, trees hanging over the top of the shot, lit-up shopfronts and red lanterns running down both banks, and all of it smearing across the water in gold and red streaks because the water's gone completely black and still.</p>
    <p>The canals are the actual roads of this town, so what you're looking at is basically a main road at night, except it's silent, and made of water.</p>` },
  { id:"t3", location:"huanxiu-bridge", file:"huanxiu-bridge-night.jpg",
    credit:{ author:"そらみみ (Soramimi)", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"Huanxiu Bridge lit up gold at night, with a lantern boat sliding past like it knows it's in the shot.",
    detail:`<p>This is the big arched stone bridge glowing warm gold after dark, its reflection reaching down into the water under the arch, with one of the hand-rowed awning boats in the foreground hung with red lanterns, the boatman stood up at the oar, and the buildings along the bank all lit up behind.</p>
    <p>The arch is that high so boats exactly like this one can get underneath, which they've been doing here for centuries, so this photo is basically the town explaining itself.</p>` },
  { id:"t4", location:"photo-shoot", file:"hanfu-portrait-closeup.jpg",
    caption:"This is me. Genuinely me. Studio hair, about a hundred pins, and actual sparkles stuck next to my eyes.",
    detail:`<p>Closest-up one of the whole shoot, so you can see everything the studio did, the full updo with pearl strings and little pale green leaf thingymajigs pinned all through it, dangly ornaments by my ears, full makeup, and tiny sparkles stuck on next to my eyes. That's the pale green hanfu with the blue embroidered front and the see-through shawl over the top, and my hands are posed under my chin, which is not a thing I have ever done in my life before this photo.</p>
    <p>I have stared at this one loads and I'm still not a hundred percent convinced it's me. Cool though.</p>` },
  { id:"t5", location:"photo-shoot", file:"hanfu-by-the-canal.jpg",
    caption:"Full-length by the canal, holding the dress out like I've done this before, which I have not.",
    detail:`<p>This is me stood right on the stone edge of the canal, one hand on my chest and the other holding the dress out so you can see the colour go from white down into proper teal blue at the bottom, with the sheer shawl draped off both arms. Behind me it's green water, willow trees and the old grey-roofed buildings across the canal, which is just what Xitang looks like in every direction.</p>
    <p>The long thin strands of hair hanging down the front are part of the styling, everything in this photo was arranged on purpose, including me.</p>` },
  { id:"t6", location:"photo-shoot", file:"hanfu-round-fan.jpg",
    caption:"Under a willow tree with an embroidered fan up and a hand on my hip, fully committed.",
    detail:`<p>This is me holding up one of those round silk fans, embroidered with a big pink flower and a pink tassel hanging off the handle, other hand on my hip, willow branches hanging down all round the top of the shot and the water going on behind.</p>
    <p>The fan was one of the studio props, and the pose is doing a lot of work here. This is about as far from my normal camera roll as it is physically possible to get.</p>` },
  { id:"t7", location:"photo-shoot", file:"hanfu-bridge-railing.jpg",
    caption:"Leaning on a bridge railing over the canal, looking about four hundred years old, in a good way.",
    detail:`<p>This is me leaning on the dark wooden railing of one of the bridges, arms resting on the rail, green canal water behind, with the dangly hair ornaments hanging down by my face and the sheer sleeves doing their floaty thing.</p>
    <p>Out of the whole shoot this is the calmest I look in any of them, dead peaceful, like queues and brothers and phones don't exist. The makeup is carrying some of that. But still.</p>` },
  { id:"t8", location:"photo-shoot", file:"hanfu-parasol-bridge.jpg",
    caption:"Me, a calligraphy parasol and an arched stone bridge, which is basically the full Xitang starter pack.",
    detail:`<p>This one's me stood in front of one of the big arched stone bridges holding a paper parasol up over my shoulder, and the parasol's got actual calligraphy brushed all over it, tassel hanging off the handle, hand on hip again, dress fading white into blue, canal doing its thing behind me.</p>
    <p>Bridge, parasol, hanfu, canal, that's every Xitang thing at once in one photo. Whatever's going on on my face, I'm calling it serene.</p>` },
  { id:"t9", location:"photo-shoot", file:"hanfu-woven-ball.jpg",
    caption:"Me holding some round woven thingymajig right at the camera. Could not tell you what it is.",
    detail:`<p>So the studio gives you props, and this was one of them, a round woven ball sort of thing, brown, and I'm holding it straight at the camera like it's dead important, doing a big open-hand wave with the other one. It's so close to the lens it's gone completely blurry, which at least makes it mysterious.</p>
    <p>I genuinely don't remember what it was or what it's for. Maybe it means something ancient, maybe it was just lying about the studio. Whatever it is is in your imagination.</p>` }
  ]
};
