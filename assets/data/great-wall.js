/* ============================================================
   THE GREAT WALL AT MUTIANYU
   One trip, all of its data. Loaded BEFORE assets/data.js, which
   stitches every trip file into the flat TRIPS / FACTS / LOCATIONS /
   PHOTOS globals the rest of the site reads.
   ============================================================ */

const INTRO_GREAT_WALL = `
<p>Right, third one, and this time I've actually got to correct something before I start, because basically everyone gets this wrong including me until about a week ago. It's called the Great Wall, like it's one wall, one long thingymajig going across China in a neat line. It isn't. It's loads of walls, built by loads of different dynasties, over roughly <strong>2,000 years</strong>, and half of them run parallel to each other or overlap or just stop in the middle of nowhere and don't join onto anything.</p>
<p>Nobody even properly knew how long all of it was until <strong>2012</strong>, when the Chinese government finished the first survey done with GPS. It took them <strong>five years</strong> across <strong>15 provinces</strong> and the answer came back as <strong>21,196.18 km</strong>. The .18 is my favourite part of that, like they measured 21 thousand kilometres of wall and then went no wait, there's another 180 metres round the back. The Ming dynasty bit on its own is <strong>8,851.8 km</strong>, so the Ming lot did less than half of it and they're the ones everyone takes photos of.</p>
<p>To make that make sense: London to New York is about 5,570 km, so all the walls added up is about <strong>3.8 times</strong> that. It's also more than half the whole distance round the Earth, which is about 40,075 km. And no, you can't see it from space with your eyes, that's just a thing people say. A Chinese astronaut called <strong>Yang Liwei</strong> actually went up and said straight out that he couldn't see it, so that's settled, from the one person who'd know.</p>
<p>The bit I properly liked though is what the Ming builders stuck it together with, which is <strong>sticky rice</strong>. Actual glutinous rice, the starchy stuff in it called amylopectin, mixed into slaked lime to make the mortar. Researchers at Zhejiang University worked out the rice controls how the crystals grow in the lime, so it doesn't shrink and cracks less and water doesn't get in, and the mad bit is it keeps getting <strong>stronger over time</strong>. Buildings made with it have sat through earthquakes. Rice pudding, basically, holding up a wall, for six hundred years.</p>
<p>The bit we went to is called <strong>Mutianyu</strong>, northeast of Beijing out in the Huairou hills, and it's got about <strong>5,400 m</strong> of restored wall with <strong>23 watchtowers</strong> along it. It's <strong>7–8 m</strong> high and <strong>4–5 m</strong> wide, built out of this bluish-grey granite, and it was put up under a Ming general called <strong>Xu Da</strong> in <strong>1368</strong>, except not from scratch, he built it on the ruins of a Northern Qi wall that was already sat there from the <strong>6th century</strong>, so like 550 to 577. A wall built on an older wall. Very on-brand for this place. The whole lot's been a UNESCO World Heritage Site since <strong>1987</strong>.</p>
<p>So the day goes: visitor centre at the bottom, up through the hills, chairlift over the trees, walk about on a 650-year-old wall in August, and then, and this is the important bit, you don't walk back down. There's a toboggan. Here's what's actually up there.</p>
`;

const TRIP_GREAT_WALL = {

  trip:
  { id:"great-wall", name:"The Great Wall at Mutianyu", chinese:"慕田峪长城", city:"Beijing",
    icon:"🧱", blurb:"Not one wall but thousands of kilometres of them, held together with sticky rice — and a 1,580 m toboggan back down.",
    map:"great-wall-map.svg", mapAlt:"Side-on panorama of the Great Wall at Mutianyu: the wall running along the ridge, with the village, chairlift and toboggan run below",
    mapCredit:"Panorama drawn for this page — not to scale, and no north on it either, because it's a view rather than a plan.",
    photoDir:"the-great-wall",
    hero:"Photographs/the-great-wall/wall-to-the-mountains.jpg",
    intro: INTRO_GREAT_WALL },

  facts: [
    { stat:"21,196", label:"km of wall in total",
      text:`Nobody actually knew the number until <strong>2012</strong>, when China finished the first survey done with GPS — five years of work across 15 provinces. Final answer: <strong>21,196.18 km</strong>. They measured twenty-one thousand kilometres of wall and still bothered with the .18.` },
    { stat:"3.8x", label:"London to New York",
      text:`London to New York is about 5,570 km, so all the walls added together is nearly <strong>four times</strong> that. It's also more than <strong>half the distance round the entire Earth</strong>, which is about 40,075 km. For a wall.` },
    { stat:"0", label:"who've seen it from space, naked eye",
      text:`The "you can see it from space" thing is just not true, it's the most repeated wrong fact on the planet. Chinese astronaut <strong>Yang Liwei</strong> actually went up there and said plainly that he couldn't see it, and he's the one person who'd know.` },
    { stat:"not 1", label:"wall — loads of them",
      text:`It isn't one wall going across China in a line, it's <strong>loads of separate walls</strong>, built by different dynasties over roughly <strong>2,000 years</strong>. Some run parallel to each other, some overlap, and some just stop and don't connect to anything at all.` },
    { stat:"8,851.8", label:"km of Ming wall alone",
      text:`Out of the 21,196 km total, the Ming dynasty bit on its own is <strong>8,851.8 km</strong>. So the Ming lot did less than half of it, and they're the ones every single photo you've ever seen is of. Bit unfair on everyone else.` },
    { stat:"rice", label:"in the mortar",
      text:`Ming builders mixed <strong>sticky rice</strong> into the lime mortar — the starchy bit, amylopectin, which researchers at Zhejiang University showed controls how the crystals grow so it doesn't shrink or let water in. The mad part is it keeps getting <strong>stronger over time</strong>, and buildings made with it have survived earthquakes.` },
    { stat:"23", label:"watchtowers at Mutianyu",
      text:`Along one <strong>5,400 m</strong> stretch. They weren't just lookout posts — soldiers actually lived in them, stored weapons in them, and used them for signalling: light a fire on top, the next tower sees it and copies, and a warning travels the whole line faster than any horse.` },
    { stat:"1368", label:"when the Ming rebuilt it",
      text:`A Ming general called <strong>Xu Da</strong> built the Mutianyu wall in <strong>1368</strong>, except not from nothing — he built it on top of the ruins of a <strong>Northern Qi</strong> wall that had already been sat there since the 6th century, so 550 to 577. A wall, on an older wall.` },
    { stat:"7–8 m", label:"high, 4–5 m wide",
      text:`The restored stretch here is <strong>7 to 8 metres high</strong> and <strong>4 to 5 metres wide</strong> along the top, built out of bluish-grey granite. Wide enough that a whole row of people can walk side by side on it and it still doesn't feel narrow. The whole Great Wall has been UNESCO listed since <strong>1987</strong>.` },
    { stat:"1,580 m", label:"of toboggan",
      text:`Instead of walking back down you get a <strong>1,580 m</strong> stainless steel slideway, about a <strong>five-minute</strong> ride, topping out around <strong>30 km/h</strong>. 30 km/h reads like nothing and feels like a completely different number when you're six inches off the metal with a bend coming.` }
  ],

  locations: [
  /* Coordinates are read off assets/great-wall-map.svg (a 900x620 panorama), so
     they follow the drawing rather than a compass: the village sits low-left,
     the wall runs along the top ridge, and the toboggan drops away to the right. */
  { id:"arrival", num:1, x:22.7, y:87.9,
    name:"Getting There", chinese:"慕田峪长城 · 游客中心",
    story:`<p>Mutianyu's out northeast of Beijing in Huairou District, up in the hills, so you don't just rock up at the wall. You get dropped at a visitor centre at the bottom, sort your tickets there, and then carry on up through the valley, because the actual wall is way further up than it looks from the car park.</p>
    <p>Then between the bottom and the wall there's this whole street of souvenir shops you have to walk through, with parasols hanging up over the top of it the entire way for shade, so you're basically walking down a tunnel of umbrellas and stalls. And here's the trick, you don't just do it once. You come back down the exact same street at the end, when you're knackered and hot and much more likely to buy a fridge magnet. That is not an accident, that is somebody's actual plan.</p>
    <p>It's properly green up here as well, hills and trees the whole way up, which I wasn't expecting at all. In my head the Great Wall was going to be in a desert, like sand and rocks and nothing. It's a forest.</p>` },
  { id:"chairlift", num:2, x:41.7, y:67.7,
    name:"The Chairlift Up", chinese:"慕田峪长城索道",
    story:`<p>You can walk up to the wall if you actually want to, or there's the gondola cable car, which is <strong>723 m</strong> and can shift about <strong>1,800 people an hour</strong>, so that gives you an idea of how many people come here. We went on the chairlift, which is the open one with no doors, about <strong>550 m</strong> long and roughly <strong>six minutes</strong> from bottom to top.</p>
    <p>Six minutes doesn't sound like anything until you're sat on a bench with your legs dangling over a forest and nothing under you. It's dead quiet as well, no engine noise where you're sat, just the cable clicking every time you go past a pole, and trees the whole way underneath, proper dense, you can't see the ground through them in most bits.</p>
    <p>And then about two thirds of the way up you look ahead and the wall's just there, running along the top of the ridge above the trees, going off in both directions. That's the bit that gets you. Not a photo of it, not a bit of it behind a fence, the actual thing sat on top of a hill like it's been waiting. Cool. Genuinely.</p>` },
  { id:"the-wall", num:3, x:62.2, y:34.0,
    name:"Up On The Wall", chinese:"慕田峪长城",
    story:`<p>So this is it, the actual wall. The restored stretch at Mutianyu runs for about <strong>5,400 m</strong>, and it's <strong>7–8 metres high</strong> and <strong>4–5 metres wide</strong> along the top, which is wide enough that loads of people can walk next to each other and it still doesn't feel narrow. It's built out of this bluish-grey granite, not brick, so it's this cold grey colour against all the green, and it's been sat there since the <strong>Ming dynasty</strong>.</p>
    <p>What nobody tells you is that it doesn't go in a straight line, at all. It follows the top of the ridge exactly, so it goes up and down and bends round with the hill, and when you're stood on one high bit and look back you can see it snaking off behind you over the tops of all the other hills and disappearing into the trees. It looks fake. Like somebody's drawn it on.</p>
    <p>The views out over the Huairou hills are unreal as well, just green going on forever in every direction with this grey line running through it. I did keep thinking about the people who had to actually live up here doing this as a job, no shuttle bus, no chairlift, just up.</p>` },
  { id:"watchtowers", num:4, x:72.2, y:31.0,
    name:"The Watchtowers", chinese:"敌楼 (Dílóu)",
    story:`<p>There are <strong>23 watchtowers</strong> along this stretch, which is loads for 5,400 m, they're basically constantly there. They're not decoration either, they had about three jobs at once: soldiers were actually garrisoned in them and lived there, they stored weapons and supplies inside, and they were the signalling points.</p>
    <p>The signalling is the good bit. Before phones, obviously, the way you got a message along a wall this long was you lit something on top of the tower, smoke in the day, fire at night, and the next tower down saw it and did the same, and it just went down the line tower to tower. So a warning could travel further in an hour than a person on a horse could in a day, using nothing except stuff being on fire.</p>
    <p>Inside they've got these arched windows and arched doorways and it goes properly cold and dark and echoey the second you step in out of the sun, which after being roasted on the open wall is heaven on earth for about thirty seconds until you have to go back out. Also every single one is a slightly different shape, they're not copy-pasted.</p>` },
  { id:"the-steps", num:5, x:23.3, y:40.3,
    name:"The Steps", chinese:"长城台阶",
    story:`<p>Right, so the steps. Every single one is a different height and a different depth, none of them match, some are like a normal step and then the next one's up to your knee. And I assumed for ages that was just it being old and falling apart. It isn't. They built it like that <strong>on purpose</strong>.</p>
    <p>It's a defence thing. If the steps are all the same you can run up them without looking, you get a rhythm going. If they're all different you physically can't, you have to look down at your feet the whole time, and if you're an invading soldier carrying a load of heavy stuff and trying to get up a wall while people are chucking things at you, having to check every step slows you right down. So it's deliberately annoying, and it's still working, six hundred years later, on tourists in trainers.</p>
    <p>The granite's gone dead smooth and shiny in the middle of each step from that many people walking on it, which is a bit slippy. Some of the steep bits are basically stairs going up at a mad angle with a handrail and everybody stopping halfway. My legs were gone. I play football, striker, I run about for fun, and this wall still had me stood there breathing like an old man.</p>` },
  { id:"toboggan", num:6, x:77.8, y:62.1,
    name:"The Toboggan Down", chinese:"慕田峪滑道",
    story:`<p>So you've done the wall, your legs have packed in, and normally that's when you'd have to walk all the way back down. Except at Mutianyu you don't, because somebody had the best idea anyone's ever had and built a <strong>1,580 m</strong> stainless steel toboggan slideway from the wall down to the bottom.</p>
    <p>You get in a little cart thingymajig with a stick between your knees, push it forward to go and pull it back to brake, and then you just go, down through the trees, round bends the whole way, for about <strong>five minutes</strong>. Top speed's around <strong>30 km/h</strong>, which does not sound fast written down and is a completely different situation when you're about six inches off the metal with no roof and a bend coming.</p>
    <p>The toboggan down was awesome. That's it, that's the review, I'm not going to sit here and explain it better than that.</p>` }
  ],

  photos: [
  { id:"g1", location:"arrival", file:"visitor-centre-arrival.jpg",
    caption:"Coach park, big signs, everyone walking the same direction, this is the bit before the actual Great Wall bit.",
    detail:`<p>This is the arrival plaza at Mutianyu, dark red exhibition centre building on the right, 慕田峪长城 in massive gold letters over the entrance, and the word "Great Wall" stuck on the wall in metal letters in case you'd somehow turned up by accident. Tour coaches lined up along the side, and everybody just streaming toward the same gate.</p>
    <p>The yellow signs over the walkway point you at ticket service, tourist centre, commercial street and the shuttle bus station, so you don't actually start at the wall, you start at a sort of shopping-and-buses situation and work your way up from there. Sky was properly grey and lumpy, which honestly after Beijing in August I was not complaining about.</p>
    <p>Dad's not in this one, obviously, because he was busy taking it, the archive doesn't build itself apparently.</p>` },
  { id:"g2", location:"arrival", file:"parasol-walkway.jpg",
    caption:"Hundreds of paper parasols strung up over the walkway, pink and purple ones, and no, none of them are doing anything useful about the sun.",
    detail:`<p>The walk up to the wall goes through this street with paper parasols hung on wires the whole way overhead, pink, purple, flowery ones, layered up so thick you can barely see sky through them. Souvenir stalls down both sides with clothes and bags and hats, and one of those blue plastic awnings over the top of them.</p>
    <p>They look cool, they do basically nothing shade-wise, because they're spaced out with gaps and the sun just comes straight through anyway. So it's a decorative thingymajig, not a functional one.</p>
    <p>You can see us all walking up it in a line here, which is pretty much the whole first ten minutes of the day, just walking and looking up.</p>` },
  { id:"g3", location:"arrival", file:"site-map-board.jpg",
    caption:"The big map board, which is where you find out the wall you're about to walk up is only a tiny bit of the actual wall.",
    detail:`<p>This is the Mutianyu Great Wall Scenic Area panoramic guide map, 慕田峪长城景区全景图, painted in that orange-brown colour with the whole ridge drawn out and every tower, car park, cable car station and toilet labelled on it. English on one side, Chinese in the middle, Japanese down the other end.</p>
    <p>The restored bit of wall here is about <strong>5,400 metres</strong> with <strong>23 watchtowers</strong> on it, which sounds like loads until you find out all the walls from all the dynasties added together come to <strong>21,196.18 kilometres</strong>. And it's not even one wall, it's loads of different walls from different times, some running parallel to each other and some overlapping, which is not what the name suggests at all.</p>
    <p>The English panel says this section was built in 1368 by General Xu Da, so the map board is doing more history than most actual museums. Oh really, is basically all I had to say about that.</p>` },
  { id:"g4", location:"arrival", file:"souvenir-street-family.jpg",
    caption:"Three of us on the parasol street, plus a Luckin Coffee, because obviously there's a Luckin Coffee at the Great Wall.",
    detail:`<p>Me, Mum and William stood in the middle of the souvenir street with the parasols going off in every direction above us. Mum's got her little blue bag on and a carrier bag in her other hand already, William's in the white t-shirt doing standing-still, and I'm in my grey tee and cargos.</p>
    <p>There's a proper Luckin Coffee shop built into the row on the right, plus stalls selling those big straw conical hats, and you can actually see a couple of people carrying them past us on the right hand side.</p>
    <p>Dad's missing from it again, which by now is basically his role in this family, permanently on the wrong side of the camera.</p>` },

  { id:"g5", location:"chairlift", file:"chairlift-cabins.jpg",
    caption:"Empty chairs floating over the trees with nothing under them, which is the exact moment you start doing the maths on the safety bar.",
    detail:`<p>This is looking up into the trees at the chairs coming through, one empty pair right above the branches and another one further off with somebody's legs dangling out of it. The yellow pylon behind is one of the towers holding the whole cable up.</p>
    <p>The trees underneath have got spiky green things all over them, chestnuts, this whole area is covered in chestnut trees so basically you go up over a forest of them.</p>
    <p>The chairlift run is only about <strong>550 metres</strong> and takes roughly six minutes, which does not sound long until you're sat in one with your feet hanging over a load of trees and nothing else.</p>` },
  { id:"g6", location:"chairlift", file:"chairlift-ride-up.mp4", type:"video",
    caption:"Nearly two whole minutes of just going up, filmed from the chair, trees, chairs, a pylon, and then the toboggan track appearing underneath us.",
    detail:`<p>This is the ride up filmed from our chair, so you get the actual thing instead of a photo of it, cable and chairs going off up the hill in front, treetops sliding past underneath, sky doing nothing much, then a big yellow pylon rolling by with the no-smoking characters on it.</p>
    <p>A very familiar bit of curly hair swings into shot about a minute in and blocks basically the whole view, which I'd say is on brand for the person it's attached to.</p>
    <p>Best bit's near the end, the camera looks down and there's the toboggan track running along the hillside below us on its stilts, with one lone rider sat on it going down while we're still going up. So you get to watch the way home before you've even arrived, which is a weird way round to do it.</p>` },
  { id:"g7", location:"chairlift", file:"chairlift-rider.jpg",
    caption:"Bloke on the chair across from us, feet dangling over an entire mountain, fully on his phone about it.",
    detail:`<p>Shot from our chair across at another one, with a bloke sat in it in a grey t-shirt and boots, hands on the bar, head down on his phone. Behind him it's just hills going back and back and getting bluer the further away they get, and one big grey pylon straight down the middle of the photo ruining the shot slightly.</p>
    <p>You can see the actual seat properly here, it's a bench, a footrest and one bar across your lap, that's it, no doors, no sides, nothing. So being on your phone up there takes a certain level of confidence I did not personally have.</p>
    <p>There's a bit of pink blur along the bottom which is somebody in our chair getting in the way, no idea who, could be any of us.</p>` },
  { id:"g8", location:"chairlift", file:"chairlift-pair.jpg",
    caption:"Two of us on chair number 1 over the pine trees, with a massive \"no smoking\" sign right next to us in case anyone fancied it.",
    detail:`<p>A chair with two people on it coming up through the pines, with the number 1 stamped on the hanger above their heads. One's got long hair and trainers, the other's in a floral top with sandals on, and the pylon on the right has 请勿吸烟 running down it in huge white characters, which means no smoking.</p>
    <p>The trees are close enough underneath that you feel like you could reach down into them, but not actually close enough, obviously, which is worse.</p>
    <p>Whole thing runs at walking-pace-ish speed for about six minutes and you just sit there, over a forest, going up. Cool, but a properly long six minutes.</p>` },
  { id:"g9", location:"chairlift", file:"first-sight-of-wall.jpg",
    caption:"There it is, up on the ridge, just sat on top of a mountain like that's a normal place to put a wall.",
    detail:`<p>This is the first proper look at it from the chairlift, the wall running along the very top of the ridge with the crenellations sticking up like teeth, and a tower dropped in on the left. Everything below it is solid green forest with no path or road or anything through it, and the chairlift cable and empty chairs are cutting into the right hand side of the shot.</p>
    <p>The mad bit is that they built it along the actual ridgeline, not through the valley where it would've been easy, because up on the ridge you can see everything coming and nobody can sneak up. Meaning every single brick got carried up a slope like the one in this photo.</p>
    <p>Sky was completely grey and flat by this point which honestly made it look better, like properly old and serious instead of holiday-postcard.</p>` },
  { id:"g10", location:"chairlift", file:"maisie-portrait.jpg",
    caption:"Me, in the queue, under a blue plastic roof, doing the face you do when you've been in a queue a while.",
    detail:`<p>Selfie in the queue, blue corrugated roof over the top of us with a fan bolted to it, white metal barriers doing the zigzag thing, and about a hundred people behind me all waiting for the same thing. Trees and hills out the open side.</p>
    <p>I'm in the grey Explore The Great Outdoors t-shirt I basically lived in on this trip, freckles fully out, hair doing whatever it wanted.</p>
    <p>Queueing is queueing wherever you do it, the mountain in the background does not make it more interesting, and this is my queue face, unedited.</p>` },

  { id:"g11", location:"the-wall", file:"wall-snaking-ridge.jpg",
    caption:"It just goes up, and up, and then round a corner, and then up again. There are people on it for scale and they're basically dots.",
    detail:`<p>Looking up at the wall winding along the ridge with two towers in shot, one down low with its grey tiled roof and one right up at the top, and this long line of steps stitching them together through the trees. Every one of those little coloured specks on the steps is an actual person.</p>
    <p>The wall runs along the highest bit of ground the whole way, which is why it looks like it's balancing. Mutianyu has <strong>23 watchtowers</strong> along its stretch, spaced so the soldiers in one could always see the next one, and this photo has two of them plus a load of the wall between.</p>
    <p>The green either side is properly thick, like nobody's touched it, so from here the wall looks like a seam running through the middle of a forest.</p>` },
  { id:"g12", location:"the-wall", file:"wall-to-the-mountains.jpg",
    caption:"Wall on the right, mountains going forever on the left, and the mountains do not stop, they just get bluer.",
    detail:`<p>Wide shot from up high, the wall coming toward the camera along the ridgeline on the right with a watchtower roof right down in the corner, and then range after range of mountains stacking off to the left getting paler and bluer the further away they are.</p>
    <p>The Ming wall on its own, not counting all the other dynasties, is <strong>8,851.8 kilometres</strong>. All the dynasties' walls added together come to about 3.8 times the distance from London to New York, except along the top of stuff that looks like this.</p>
    <p>Also, and I know everyone says it, you cannot see it from space with your actual eyes. It's massively long but it's only a few metres wide and it's the same colour as the ground it's sat on, so, no. Sorry.</p>` },
  { id:"g13", location:"the-wall", file:"wall-along-ridge.jpg",
    caption:"Standing at a tower looking back down the whole thing, tower, steps, tower, steps, forever.",
    detail:`<p>Taken from up in one of the towers looking along the wall, with a lump of the crenellation in the corner of the shot with white plaster patches on it. Below there's a tower with those stacked grey tiled roofs, then the wall drops away, then it climbs again to another tower, then keeps going up to a third one right on the skyline.</p>
    <p>The walkway on top is properly wide, like four or five metres, wide enough that people are walking up it four or five abreast without touching. It was built that wide on purpose so soldiers and supplies could actually move along it, it's a road as much as a wall.</p>
    <p>You can see people in the near bit sitting down on the edge having a rest, which, fair, that's exactly what those steps do to you.</p>` },
  { id:"g14", location:"the-wall", file:"maisie-on-the-wall.jpg",
    caption:"Me at the front, the entire Great Wall behind me, and one bit of whitewashed brick that ended up being the star of the photo.",
    detail:`<p>This is me stood on the steps in my grey tee, hair everywhere, with the wall going right up the ridge behind me, over a tower, and off into the trees. The brick parapet on the right is really close to the camera and it's got these white mortar lines painted between the bricks, so it's the sharpest thing in the whole photo.</p>
    <p>The steps behind me are absolutely covered in people, all sizes, some going up, some very much coming back down, and a couple of kids in the middle of it looking exactly how I felt.</p>
    <p>Good hair-behaviour, decent smile, giant historical monument, would post.</p>` },
  { id:"g15", location:"the-wall", file:"view-over-the-valley.jpg",
    caption:"Turn away from the wall and you get this instead, the whole valley, with a town sat down at the bottom of it.",
    detail:`<p>This is looking off the other side, away from the wall, and it's just green hills folding into each other and then flattening out at the back where you can see white buildings and a road, an actual town down there in the distance.</p>
    <p>Grey rippled clouds all the way across, hills going properly blue toward the back. There's a bit of stone in the bottom corner which is the wall you're stood on, and that's the only man-made thing anywhere near you.</p>
    <p>This is basically the exact view the soldiers up here would have been watching, all day, for years. Imagine that being the job.</p>` },
  { id:"g16", location:"the-wall", file:"family-on-the-wall.jpg",
    caption:"The three of us on the steps with the wall snaking off behind, plus a carrier bag, obviously.",
    detail:`<p>Me, Mum and William stood on the wall with the whole ridge behind us, wall dipping down to a tower, then climbing back up and away into the trees. William in the white tee and black shorts, Mum with her blue bag and a carrier bag she's still holding, me in the grey tee with my phone in my hand.</p>
    <p>The walkway either side of us is full of other people going both directions and the bricks on the right are all patched up with white plaster, which is the restored bit showing.</p>
    <p>Dad, again, nowhere in it. There's an entire wall in this photo and the one thing missing is Dad.</p>` },

  { id:"g17", location:"watchtowers", file:"tower-window-view.jpg",
    caption:"Standing inside a tower looking out a slit window at a hillside, which is basically the exact view someone had as an actual job.",
    detail:`<p>Inside one of the watchtowers, dead dark, black-grey brick walls close in on both sides, and one narrow arched window in the middle letting in this square of bright green forest. There's a stone block thing sat outside on the ledge blocking the bottom of it.</p>
    <p>The windows are narrow on purpose. Big enough to see out of and shoot out of, way too small for anything to get in through, which is a bit smart when you think about it.</p>
    <p>It was properly cold in there compared to outside as well, all that thick brick, so tower shade is genuinely the best shade on the wall. Heaven on earth for about a minute and a half.</p>` },
  { id:"g18", location:"watchtowers", file:"tower-gable-plaque.jpg",
    caption:"There's a proper official stone plaque set into the end of a watchtower, plus a dragon head sticking out of the roof for no reason anyone explained.",
    detail:`<p>This is the pointed gable end of a watchtower with a carved stone plaque set right into the brickwork. It reads 北京市文物保护单位 / 万里长城北京段 / 慕田峪 — Beijing municipal protected cultural site, Beijing section of the Great Wall, Mutianyu — with the date it was listed in smaller characters underneath.</p>
    <p>Sticking out at the top of the roof ridge there's a carved stone dragon head with its mouth open, and round tile ends along the eaves each with a pattern stamped in them. Behind the roof the wall carries straight on uphill to the next tower with a line of people crawling up it.</p>
    <p>What's here now is Ming dynasty, built from 1368 under General Xu Da, but it's sat on top of foundations from the Northern Qi, which were put down in the <strong>500s</strong>. So it's an old wall standing on an even older wall. No way, honestly.</p>` },
  { id:"g19", location:"watchtowers", file:"mum-in-the-archway.jpg",
    caption:"Mum, framed dead centre in a tower archway, with an entire mountain range behind her doing the background work.",
    detail:`<p>Mum stood in one of the tower archways, arms slightly out, floral top, khaki shorts, her blue bag across her, sandals on. The arch curves round her on both sides in dark grey brick and through the gap behind her it's green hillside and then proper misty mountains going back into the distance.</p>
    <p>The archways in these towers are the doorways the wall walkway runs straight through, so everyone on the wall funnels through them one at a time, which is also why it's such a good spot for a photo, it frames you whether you want framing or not.</p>
    <p>The walls at Mutianyu are around <strong>7 to 8 metres</strong> high, so the thing she's stood in is basically two floors of solid brick and granite with a person-shaped hole in it.</p>` },
  { id:"g20", location:"watchtowers", file:"stone-cannon.jpg",
    caption:"A lump of grey stone on the floor with a hole in the front, which turns out to be an actual cannon. Made of rock.",
    detail:`<p>Sat on the paving next to the wall there's this rounded grey stone about the size of a big dog, with a proper round hole bored into the front of it and some carved marks scratched down the side. Next to it is a rust-coloured sign board reading 石炮, Stone Cannon.</p>
    <p>The sign says stone cannons were carved out of hard stone and used gunpowder to fire stone projectiles, spraying out in a fan shape to hit as many attackers as possible at once, and that they were a key part of the defences on this section. So it's a rock, that shoots rocks, in a fan. Oh really.</p>
    <p>Down the side of the sign there's no graffiti, no smoking and no open flames, all three, which given the thing it's stood next to used to run on gunpowder feels sensible.</p>` },

  { id:"g21", location:"the-steps", file:"steps-through-the-arch.jpg",
    caption:"Looking up a stairwell inside a tower at a bright arch of sky, and somebody's head at the top who has no idea they're in this.",
    detail:`<p>Shot straight up a narrow stone staircase inside one of the towers toward the arched opening at the top, which is just blank white sky. The walls press in on both sides, so close you could touch both at once, and the top of one random person's head is poking into the corner of the arch.</p>
    <p>The steps are all different heights and depths, some shallow, some massive, none of them matching, which is not great news for your legs on the way up or your ankles on the way down.</p>
    <p>The stone's gone black and green at the bottom and there's moss in the corners where the light never reaches. Slightly manky, quite cool.</p>` },
  { id:"g22", location:"the-steps", file:"steep-steps.jpg",
    caption:"William halfway up the steepest bit, and the camera angle is not lying, it genuinely is that steep.",
    detail:`<p>Looking straight up a section of steps that's so steep the top of it disappears into the sky, with a metal handrail bolted down the left hand side and the crenellated wall running up beside it. William's stood partway up in the white tee and black shorts, and there's a handful of other people coming down past him going very carefully.</p>
    <p>The stairs on this bit are properly deep and irregular, and they were built like that on purpose, uneven steps slow attackers down and make it harder to charge up. They also slow you down when you are just a normal person on holiday who wants to get to the top.</p>
    <p>You can see the next tower peeking over the skyline right at the top, which looks close in the photo and is absolutely not close.</p>` },
  { id:"g23", location:"the-steps", file:"fan-on-the-steps.jpg",
    caption:"Not an ice cream, a little pink fan, and honestly it was doing more for me than an ice cream would have.",
    detail:`<p>This is me at the bottom of a long flight of steps holding one of those tiny handheld fans, pink one, on full blast pointed at my face, hair going sideways because of it. Behind me the steps go up and up and there's a whole load of people crawling up them, including one bloke hauling a big blue shopping bag up with a pink umbrella sticking out of it.</p>
    <p>The wall on the left is that massive rough grey block stuff rather than the neat brick, so this bit's built out of proper chunky granite, which is what most of the base of Mutianyu is made from.</p>
    <p>A tiny fan is not a serious solution to anything, but after a load of steps, it kind of is. Heaven on earth for about thirty seconds.</p>` },
  { id:"g24", location:"the-steps", file:"worn-steps.jpg",
    caption:"Just the steps, close up, and you can see exactly how much they've been walked on, which is a lot.",
    detail:`<p>Close-up on the actual steps, all big grey slabs with thin brick layers sandwiched in between, and every single edge rounded off and dipped in the middle from people walking on them. A couple of bits have got broken out completely with orange-brown brick showing underneath.</p>
    <p>There's a bloke sat down having a rest on the left with his bag on his knees, and other people's legs going up past on the right, which is basically the whole day in one photo.</p>
    <p>The mortar holding all this together had sticky rice in it, actual rice, mixed with lime, and it turns out that makes it waterproof and it gets stronger over time instead of crumbling. Which is why a wall from the 1300s is still holding up under this many trainers. No way.</p>` },
  { id:"g25", location:"the-steps", file:"family-on-the-steps.jpg",
    caption:"Me, Mum and William at the bottom of the steps, with about forty strangers climbing behind us.",
    detail:`<p>The three of us stood at the bottom of a big flight of steps, me in the middle in the grey tee, William on the right in the white one with his hand on his hip, Mum on the left with her blue bag and floral top. Everyone else in the photo is mid-climb.</p>
    <p>Behind us there's a bloke in a bucket hat with a backpack, somebody in a straw conical hat, kids being pulled up the steps, the whole lot. The steps carry on up past all of them and out of shot.</p>
    <p>Dad's behind the camera again, obviously. At this point I'm fairly sure the archive is just photos of the three of us stood in front of things.</p>` },

  { id:"g26", location:"toboggan", file:"toboggan-start.jpg",
    caption:"The queue for the toboggan, with people going off down the metal chute one at a time, and the toboggan down was awesome.",
    detail:`<p>Looking down on the start of the toboggan run from above, with the shiny metal chute coming out from under a grey shade sail and three riders on it already, spaced out one behind another, the front one a kid in a white tee and a cap. Big line of people waiting on the path behind them under the canopy, and a chairlift pylon and cable overhead.</p>
    <p>They send you off one at a time with a gap between so you don't pile into the back of the person in front, and you get your own little sled with a stick between your knees, push forward to go, pull back to brake.</p>
    <p>The toboggan down was awesome. That's the review.</p>` },
  { id:"g27", location:"toboggan", file:"toboggan-chute.jpg",
    caption:"The chute heading off into the mountains, and a bloke in a cap sat on a sled at the top being paid to sit on a sled.",
    detail:`<p>This is the top of the run, stainless steel chute curving away down the hillside on legs, off between the trees and out of sight. There's a member of staff in a white shirt and cap sat on a sled right at the start, plus a black shade sail and a board with pictures showing you how to sit and how to brake, in a few languages.</p>
    <p>Behind all of it is the actual view, layers of green hills, then proper jagged mountains going back until they're basically blue, with the chairlift cable slicing across the sky.</p>
    <p>The whole slideway is <strong>1,580 metres</strong> long and takes about five minutes to get down, which after all those steps is the best deal available anywhere on that mountain.</p>` },
  { id:"g28", location:"toboggan", file:"toboggan-riders.jpg",
    caption:"Three people on the chute at once, properly spaced out, all just sat there sliding down a mountain.",
    detail:`<p>Three riders on the run at the same time in this one, one at the top in a brown top and white trousers with a backpack, then two more further down the chute in shorts, and if you look properly there's a fourth one way off in the distance where the track bends back through the trees.</p>
    <p>The chute is one long metal gutter on stilts and it just follows the shape of the hill, straights, bends, dips, the lot, with the mountains sat there behind it doing the scenery.</p>
    <p>It gets up to about <strong>30 km/h</strong>, which does not sound fast written down and is completely different when it's you, in a plastic sled, with no roof, on a metal slide, in the air.</p>` }
  ]
};
