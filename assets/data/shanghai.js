/* ============================================================
   SHANGHAI (上海)
   One trip, all of its data. Loaded BEFORE assets/data.js, which
   stitches every trip file into the flat TRIPS / FACTS / LOCATIONS /
   PHOTOS globals the rest of the site reads.
   ============================================================ */

const INTRO_SHANGHAI = `
<p>Right, Shanghai, and this is the big one, properly the big one, about <strong>24 million</strong> people, one of the biggest cities on the entire planet. The name literally means "on the sea", 上海, shàng is on and hǎi is sea, which is a very casual name for a place this enormous, but then it wasn't always this enormous, which is kind of the whole story.</p>
<p>Because it started as basically nothing, a fishing town on some muddy flats where the Yangtze river meets the sea. Then in the 1840s Britain won the First Opium War and made China open the port up to foreign trade, and everyone piled in, British, French, Americans, all setting up their own bits of the city with their own banks and their own rules. Not exactly a nice chapter of history, that one, but it is the reason the Bund looks the way it does, so you're sort of walking through it.</p>
<p>The Bund is the strip along the river with <strong>52</strong> grand old stone buildings in a row, banks and hotels and trading houses from that era, and people call it a "museum of world architecture" because every single one's in a different style. And directly across the river there's Pudong, which was still basically farmland in the 1990s and is now the full sci-fi skyline you've seen in every film that wants to say "the future", including Shanghai Tower, the twisting one, <strong>632 metres</strong>, tallest building in China and second tallest on Earth.</p>
<p>That's the actual thing about Shanghai, the old and new stuff isn't kept in separate zones, it's all stacked on top of itself. There's a proper Ming dynasty garden, Yu Garden, started in <strong>1559</strong>, just sat there in the middle of the skyscrapers with a teahouse on stilts in a pond, completely unbothered by the four centuries that happened around it.</p>
<p>Also this city does not do slow. The metro's the longest network in the world, <strong>831 kilometres</strong> of it, there's a train to the airport that floats on magnets and does <strong>431 km/h</strong>, fastest commercial train anywhere, and even the lifts in Shanghai Tower do 74 km/h. Straight up. In a lift.</p>
<p>Dad's camera did not get one quiet minute in this entire city, and to be fair to him, for once I get it. Here's what we saw.</p>
`;

const TRIP_SHANGHAI = {

  trip:
  { id:"shanghai", name:"Shanghai", chinese:"上海", city:"Shanghai",
    icon:"🌃", blurb:"China's tallest tower, the world's fastest train and 24 million people — with a Ming dynasty garden hiding in the middle of it all.",
    map:"shanghai-map.svg", mapAlt:"Schematic plan of the Shanghai trip: the Huangpu River with the Bund on one side, the Lujiazui towers on the other, Yu Garden and the Maglev",
    mapCredit:"Site plan drawn for this page — not to scale.",
    photoDir:"shanghai",
    hero:"Photographs/shanghai/lujiazui-three-towers.jpg",
    heroAlt:"Looking straight up at Lujiazui's three supertall towers lit up against the night sky",
    intro: INTRO_SHANGHAI },

  facts: [
    { stat:"632 m", label:"of Shanghai Tower",
      q:"How tall is Shanghai Tower, the twisting one?",
      text:`Shanghai Tower is <strong>632 metres</strong> and 128 floors, China's tallest building and the second tallest on Earth. It's the twisting one, the whole thing corkscrews as it goes up, which helps it cope with the wind and also makes every other skyscraper look like it isn't trying.` },
    { stat:"74 km/h", label:"the lift, going up",
      q:"How fast do Shanghai Tower's lifts go, straight up?",
      text:`The lifts in Shanghai Tower do up to <strong>74 km/h</strong>, which is 20.5 metres every second, straight up, some of the fastest anywhere in the world. That's motorway speed. In a lift. Your ears find out about it before your brain does.` },
    { stat:"431 km/h", label:"the Maglev's top speed",
      q:"What's the Maglev's top speed?",
      text:`The Maglev tops out at <strong>431 km/h</strong>, the fastest commercial train in the world, and it doesn't even have wheels touching anything, it floats on magnets. About 30 kilometres to the airport in roughly 8 minutes, which makes every other train ever feel like a joke.` },
    { stat:"831 km", label:"of metro",
      q:"How long is Shanghai's metro network altogether?",
      text:`Shanghai's metro is <strong>831 kilometres</strong> long with 508 stations, the longest network on the planet. That's further than London to Edinburgh, except it's all one city's underground.` },
    { stat:"24 million", label:"people",
      q:"How many people live in Shanghai?",
      text:`About <strong>24 million</strong> people live here, 24.9 million at the last census, making it one of the biggest cities on Earth. That's not far off the population of a whole country, stacked into one city at the mouth of one river.` },
    { stat:"52", label:"grand old buildings on the Bund",
      q:"How many grand old buildings line up along the Bund?",
      text:`There are <strong>52</strong> grand old buildings along the Bund, a mile of colonial-era banks and hotels people call a "museum of world architecture", because every single one's in a different style. They were built to show off a hundred years ago, and they are still at it.` },
    { stat:"1559", label:"when Yu Garden was started",
      q:"What year did Yu Garden get started?",
      text:`Yu Garden got started in <strong>1559</strong>, in the Ming dynasty, and it's still there, a proper classical garden with rockeries and ponds and dragon-topped walls, buried right in the middle of the skyscrapers. It's older than basically everything for miles in every direction around it.` },
    { stat:"468 m", label:"of Oriental Pearl Tower",
      q:"How tall is the Oriental Pearl Tower, the retro spaceship one?",
      text:`The Oriental Pearl Tower is <strong>468 metres</strong> of concrete and giant spheres, finished in 1994 back when it was pretty much the only tall thing in Pudong. It looks like a retro spaceship stood next to the newer towers, and honestly that's exactly why everyone loves it.` },
    { stat:"on the sea", label:"what the name means",
      text:`上海 literally means <strong>"on the sea"</strong>, shàng is on, hǎi is sea. Dead simple name for a little fishing village, which is what it was, slightly funnier now it's one of the biggest cities that has ever existed.` },
    { stat:"49 million", label:"shipping containers a year",
      q:"How many shipping containers reportedly go through the port every year?",
      text:`Shanghai's port shifts reportedly around <strong>49 million</strong> shipping containers a year, the busiest container port in the world. Pretty much anything you own that says made in China on it had a decent chance of leaving through here.` }
  ],

  locations: [
  { id:"the-bund", num:1, x:38.0, y:38.0,
    name:"The Bund", chinese:"外滩 (Wàitān)",
    story:`<p>The Bund is the strip along the Huangpu river with <strong>52</strong> grand old stone buildings stood in a row, banks and hotels and trading houses from when Shanghai was a treaty port and half the world's money was flowing through it. People call it a "museum of world architecture" because every building's in a different style, and every one of them was built to out-show-off the one next door.</p>
    <p>Then you turn round, and that's the trick of the place, because with your back to the old buildings you're looking straight across the river at Pudong, the Oriental Pearl, the supertalls, the whole glowing lot. A hundred-odd years of history on one bank, staring at the future on the other, with one river in between.</p>
    <p>At night the old buildings all get floodlit gold and the entire city seems to turn up at the railing at the same time. It is rammed. Fair enough, honestly.</p>` },
  { id:"lujiazui", num:2, x:77.5, y:49.0,
    name:"Lujiazui", chinese:"陆家嘴 (Lùjiāzuǐ)",
    story:`<p>Lujiazui is the bit of Pudong where the three supertalls stand basically next to each other. There's Jin Mao with its stacked, pagoda-style tiers, the World Financial Centre, which everyone just calls the bottle-opener because of the massive rectangular hole at the top, and Shanghai Tower, <strong>632 metres</strong> of building that twists the whole way up, tallest in China, second tallest on Earth.</p>
    <p>The thing to actually do here is stand right underneath them and look straight up, all three leaning over you at once, which is the closest a pavement gets to making you feel about two centimetres tall. The maddest part is this was still more or less farmland in the early 1990s, so the entire skyline is younger than a lot of the people stood under it photographing it.</p>
    <p>Your neck gives up before the buildings do. That's the honest review of Lujiazui.</p>` },
  { id:"yu-garden", num:3, x:20.0, y:75.0,
    name:"Yu Garden", chinese:"豫园 (Yùyuán)",
    story:`<p>Yu Garden got started in <strong>1559</strong>, in the Ming dynasty, by an official called Pan Yunduan who built it as a garden for his elderly father, and it's a proper classical Chinese garden, rockeries, ponds, pavilions, walls with dragons running along the top of them, all of it arranged so every corner you turn is another little view somebody designed on purpose four hundred-odd years ago.</p>
    <p>Just outside there's the famous pond with the Huxinting teahouse stood on stilts right in the middle of it, and you get to it over a zig-zag bridge, which supposedly zig-zags because evil spirits can only travel in straight lines, so the corners shake them off. Believe that or don't, it also means everyone has to slow down and shuffle round every corner, so the bridge is permanently rammed.</p>
    <p>And the whole thing is buried right in the middle of the modern city, so you're stood in a Ming dynasty garden and there's a 632-metre tower looking over the wall at you. Old and new Shanghai in one glance, no effort required.</p>` },
  { id:"maglev", num:4, x:77.5, y:86.0,
    name:"The Maglev", chinese:"磁悬浮 (Cíxuánfú)",
    story:`<p>The Maglev is the train to the airport, and it's the fastest commercial train in the world, top speed <strong>431 km/h</strong>. It hasn't got wheels rolling on rails, it floats above the track on magnets and gets pushed along by them, so at full speed there is genuinely nothing touching anything.</p>
    <p>The run is about 30 kilometres and it does it in roughly <strong>8 minutes</strong>, which is the kind of journey time that makes every normal train feel like it's joking. There's a speed readout in the carriage so you can watch the number climb, which is obviously the entire point of being on board.</p>
    <p>It's pretty much the only one of its kind anywhere doing a proper commercial job, so this is basically the one place on the planet where floating to the airport at 431 km/h is just a normal Tuesday.</p>` }
  ],

  photos: [
  { id:"s1", location:"the-bund", file:"bund-skyline-night.mp4", type:"video",
    caption:"Dad's night film of the entire Pudong skyline going off, plus half of Shanghai at the railing filming the exact same thing.",
    detail:`<p>This is Dad's footage from the Bund promenade at night, the whole skyline across the river lit up at once, the Oriental Pearl doing its red and blue glow, Shanghai Tower shining away at the back, the full set.</p>
    <p>The railing was absolutely rammed, a whole line of people all holding their phones up at the same buildings at the same time, so the video's got nearly as many screens in it as towers. Some views just do that to everyone at once, apparently.</p>` },
  { id:"s2", location:"lujiazui", file:"lujiazui-three-towers.jpg",
    caption:"All three supertalls from directly underneath at night, which is the angle your neck pays for.",
    detail:`<p>This is stood right at the bottom looking straight up, Jin Mao on the left with its stacked tiers all lit up, the bottle-opener one in the middle with blue light running up its edges, and Shanghai Tower on the right doing its full twist, glowing gold with blue along the top, all three against a black sky.</p>
    <p>Shanghai Tower's the <strong>632-metre</strong> one, so from down here you're looking up more than half a kilometre of building. Very much a Dad shot, this one, and to be fair to him, it came out.</p>` },
  { id:"s3", location:"the-bund", file:"bund-buildings-night.jpg",
    credit:{ author:"DvTor8303", license:"CC0", licenseUrl:"https://creativecommons.org/publicdomain/zero/1.0/" },
    caption:"The Bund's grand old banks floodlit gold at night, green pyramid roof and all.",
    detail:`<p>This is a row of the Bund's old buildings all floodlit gold after dark, the one with the green pyramid roof, which is the famous old Peace Hotel, then the Bank of China building with its sign glowing at the top, and the ICBC bank along from it, with street lamps, trees and a whole crowd moving along the promenade underneath.</p>
    <p>These went up around a hundred years ago as banks and hotels, when Shanghai was one of the busiest trading ports anywhere, and they were built to look important. The floodlights mean they still get to, every single night.</p>` },
  { id:"s4", location:"yu-garden", file:"yu-garden-teahouse.jpg",
    credit:{ author:"Fredlyfish4", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"A teahouse on stilts in its own pond, with Shanghai Tower photobombing from about four hundred years in the future.",
    detail:`<p>This is the Huxinting teahouse, the dark wooden pavilion with the swoopy upturned roofs, stood on white stilts over the green pond by Yu Garden, a string of red lanterns hanging off one corner, a yellow tea flag out the window, and the zig-zag bridge on the left absolutely packed with people, some of them mid-photo at the railing.</p>
    <p>Then look just right of the rooftops and Shanghai Tower is stood there in the background, so you get proper old Shanghai and proper new Shanghai in one frame without moving your feet. That's basically the whole city in one photo.</p>` },
  { id:"s5", location:"maglev", file:"maglev-train.jpg",
    credit:{ author:"kallerna", license:"CC BY-SA 4.0", licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/" },
    caption:"The Maglev sat at the platform looking like it got delivered from the future, which is roughly accurate.",
    detail:`<p>This is the white Maglev waiting at the platform, streamlined nose, blue and orange stripe down the side, SMT logo on the front, with the shiny polished platform stretching off next to it and the Waiting Area markings painted on the floor.</p>
    <p>It looks dead calm sat here, but this thing floats on magnets and hits <strong>431 km/h</strong>, fastest commercial train on the planet, airport in about eight minutes. Trains at home could never.</p>` }
  ]
};
