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

/* The tracing playground's syllabus: 13 packs, unlocking in order as the
   reader traces (the rule lives in site.js). Every char needs a
   stroke-data file at assets/vendor/hanzi-data/<codepoint-hex>.js and no
   char may appear in two packs — check.mjs enforces both. Words are
   display-only and may use characters from any pack. Pinyin and meanings
   are load-bearing facts: verify before editing. */
const HANZI_PACKS = [
  { id:"trip", name:"The Trip Pack", hanzi:"旅",
    blurb:"The names of everywhere we actually went, 中国 to 上海. Start here.",
    chars: [
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
    ] },
  { id:"numbers", name:"One to Ten Thousand", hanzi:"数",
    blurb:"一 to 十, then 百, 千 and 万 — count all the way to ten thousand, plus zero.",
    chars: [
      { char:"一", pinyin:"yī",   meaning:"one",          word:"一月", wordMeaning:"January — month one" },
      { char:"二", pinyin:"èr",   meaning:"two",          word:"二月", wordMeaning:"February" },
      { char:"三", pinyin:"sān",  meaning:"three",        word:"三月", wordMeaning:"March" },
      { char:"四", pinyin:"sì",   meaning:"four",         word:"四月", wordMeaning:"April" },
      { char:"五", pinyin:"wǔ",   meaning:"five",         word:"五月", wordMeaning:"May" },
      { char:"六", pinyin:"liù",  meaning:"six",          word:"六月", wordMeaning:"June" },
      { char:"七", pinyin:"qī",   meaning:"seven",        word:"七月", wordMeaning:"July" },
      { char:"八", pinyin:"bā",   meaning:"eight",        word:"八月", wordMeaning:"August — when we were there" },
      { char:"九", pinyin:"jiǔ",  meaning:"nine",         word:"九月", wordMeaning:"September" },
      { char:"十", pinyin:"shí",  meaning:"ten",          word:"十月", wordMeaning:"October" },
      { char:"百", pinyin:"bǎi",  meaning:"hundred",      word:"一百", wordMeaning:"one hundred" },
      { char:"千", pinyin:"qiān", meaning:"thousand",     word:"一千", wordMeaning:"one thousand" },
      { char:"万", pinyin:"wàn",  meaning:"ten thousand", word:"一万", wordMeaning:"ten thousand — Chinese counts in wàn" },
      { char:"零", pinyin:"líng", meaning:"zero",         word:"零食", wordMeaning:"snacks" }
    ] },
  { id:"people", name:"People and Family", hanzi:"家",
    blurb:"Me, you, mum, dad — plus how to say thanks and goodbye properly.",
    chars: [
      { char:"人", pinyin:"rén",  meaning:"person",              word:"中国人", wordMeaning:"a Chinese person" },
      { char:"大", pinyin:"dà",   meaning:"big",                 word:"大人",   wordMeaning:"a grown-up — literally a big person" },
      { char:"小", pinyin:"xiǎo", meaning:"small",               word:"小猫",   wordMeaning:"a kitten — a little cat" },
      { char:"子", pinyin:"zǐ",   meaning:"child",               word:"孩子",   wordMeaning:"a child" },
      { char:"女", pinyin:"nǚ",   meaning:"female",              word:"女儿",   wordMeaning:"a daughter" },
      { char:"男", pinyin:"nán",  meaning:"male",                word:"男孩",   wordMeaning:"a boy" },
      { char:"我", pinyin:"wǒ",   meaning:"I, me",               word:"我们",   wordMeaning:"we" },
      { char:"你", pinyin:"nǐ",   meaning:"you",                 word:"你好",   wordMeaning:"hello — literally you-good" },
      { char:"他", pinyin:"tā",   meaning:"he",                  word:"他们",   wordMeaning:"they" },
      { char:"她", pinyin:"tā",   meaning:"she",                 word:"她们",   wordMeaning:"they — all girls" },
      { char:"好", pinyin:"hǎo",  meaning:"good",                word:"你好",   wordMeaning:"hello" },
      { char:"妈", pinyin:"mā",   meaning:"mum",                 word:"妈妈",   wordMeaning:"Mum" },
      { char:"爸", pinyin:"bà",   meaning:"dad",                 word:"爸爸",   wordMeaning:"Dad" },
      { char:"家", pinyin:"jiā",  meaning:"home, family",        word:"家人",   wordMeaning:"family — the people of your home" },
      { char:"朋", pinyin:"péng", meaning:"friend",              word:"朋友",   wordMeaning:"a friend" },
      { char:"友", pinyin:"yǒu",  meaning:"friend",              word:"朋友",   wordMeaning:"a friend" },
      { char:"们", pinyin:"men",  meaning:"makes words plural",  word:"我们",   wordMeaning:"we" },
      { char:"爱", pinyin:"ài",   meaning:"love",                word:"可爱",   wordMeaning:"cute — lovable" },
      { char:"谢", pinyin:"xiè",  meaning:"thanks",              word:"谢谢",   wordMeaning:"thank you" },
      { char:"再", pinyin:"zài",  meaning:"again",               word:"再见",   wordMeaning:"goodbye — see you again" },
      { char:"见", pinyin:"jiàn", meaning:"to see",              word:"再见",   wordMeaning:"goodbye" }
    ] },
  { id:"colours", name:"All the Colours", hanzi:"色",
    blurb:"红 to 紫 — and 紫 is the purple in 紫禁城, the Forbidden City's actual name.",
    chars: [
      { char:"红", pinyin:"hóng",  meaning:"red",    word:"红色",   wordMeaning:"red — the lucky colour" },
      { char:"黄", pinyin:"huáng", meaning:"yellow", word:"黄河",   wordMeaning:"the Yellow River" },
      { char:"蓝", pinyin:"lán",   meaning:"blue",   word:"蓝天",   wordMeaning:"blue sky" },
      { char:"绿", pinyin:"lǜ",    meaning:"green",  word:"绿茶",   wordMeaning:"green tea" },
      { char:"白", pinyin:"bái",   meaning:"white",  word:"白云",   wordMeaning:"white clouds" },
      { char:"黑", pinyin:"hēi",   meaning:"black",  word:"黑猫",   wordMeaning:"a black cat" },
      { char:"金", pinyin:"jīn",   meaning:"gold",   word:"金色",   wordMeaning:"golden" },
      { char:"银", pinyin:"yín",   meaning:"silver", word:"银色",   wordMeaning:"silvery" },
      { char:"紫", pinyin:"zǐ",    meaning:"purple", word:"紫禁城", wordMeaning:"the Purple Forbidden City — its real name" },
      { char:"粉", pinyin:"fěn",   meaning:"pink",   word:"粉色",   wordMeaning:"pink" },
      { char:"灰", pinyin:"huī",   meaning:"grey",   word:"灰色",   wordMeaning:"grey" },
      { char:"色", pinyin:"sè",    meaning:"colour", word:"颜色",   wordMeaning:"colour" }
    ] },
  { id:"animals", name:"Pandas and Dragons", hanzi:"猫",
    blurb:"Cat, dog, dragon, duck — and 熊猫, which is literally \"bear cat\", aka a panda.",
    chars: [
      { char:"猫", pinyin:"māo",   meaning:"cat",      word:"宫猫", wordMeaning:"the palace cats" },
      { char:"狗", pinyin:"gǒu",   meaning:"dog",      word:"小狗", wordMeaning:"a puppy" },
      { char:"鸟", pinyin:"niǎo",  meaning:"bird",     word:"小鸟", wordMeaning:"a little bird" },
      { char:"鱼", pinyin:"yú",    meaning:"fish",     word:"金鱼", wordMeaning:"a goldfish" },
      { char:"牛", pinyin:"niú",   meaning:"cow, ox",  word:"牛肉", wordMeaning:"beef" },
      { char:"羊", pinyin:"yáng",  meaning:"sheep",    word:"山羊", wordMeaning:"a goat — a mountain sheep" },
      { char:"虎", pinyin:"hǔ",    meaning:"tiger",    word:"老虎", wordMeaning:"a tiger" },
      { char:"龙", pinyin:"lóng",  meaning:"dragon",   word:"恐龙", wordMeaning:"a dinosaur — literally a terror dragon" },
      { char:"熊", pinyin:"xióng", meaning:"bear",     word:"熊猫", wordMeaning:"a panda — literally a bear-cat" },
      { char:"猪", pinyin:"zhū",   meaning:"pig",      word:"小猪", wordMeaning:"a piglet" },
      { char:"兔", pinyin:"tù",    meaning:"rabbit",   word:"兔子", wordMeaning:"a rabbit" },
      { char:"鸡", pinyin:"jī",    meaning:"chicken",  word:"公鸡", wordMeaning:"a rooster" },
      { char:"鸭", pinyin:"yā",    meaning:"duck",     word:"烤鸭", wordMeaning:"Beijing roast duck" },
      { char:"蛇", pinyin:"shé",   meaning:"snake",    word:"蛇年", wordMeaning:"the Year of the Snake" },
      { char:"鼠", pinyin:"shǔ",   meaning:"mouse",    word:"老鼠", wordMeaning:"a mouse — what the palace cats are for" },
      { char:"象", pinyin:"xiàng", meaning:"elephant", word:"大象", wordMeaning:"an elephant" }
    ] },
  { id:"food", name:"Dumplings and Tea", hanzi:"食",
    blurb:"Rice, noodles, tea, dumplings and baozi — the important stuff — plus eat and drink so you can do something about it.",
    chars: [
      { char:"饭", pinyin:"fàn",  meaning:"rice, a meal",         word:"米饭",   wordMeaning:"cooked rice" },
      { char:"面", pinyin:"miàn", meaning:"noodles",              word:"面条",   wordMeaning:"noodles" },
      { char:"米", pinyin:"mǐ",   meaning:"rice",                 word:"米饭",   wordMeaning:"cooked rice" },
      { char:"茶", pinyin:"chá",  meaning:"tea",                  word:"绿茶",   wordMeaning:"green tea" },
      { char:"肉", pinyin:"ròu",  meaning:"meat",                 word:"牛肉",   wordMeaning:"beef" },
      { char:"菜", pinyin:"cài",  meaning:"vegetables, a dish",   word:"中国菜", wordMeaning:"Chinese food" },
      { char:"蛋", pinyin:"dàn",  meaning:"egg",                  word:"鸡蛋",   wordMeaning:"a hen's egg" },
      { char:"果", pinyin:"guǒ",  meaning:"fruit",                word:"水果",   wordMeaning:"fruit" },
      { char:"包", pinyin:"bāo",  meaning:"bun, to wrap",         word:"包子",   wordMeaning:"baozi — steamed buns" },
      { char:"汤", pinyin:"tāng", meaning:"soup",                 word:"鸡汤",   wordMeaning:"chicken soup" },
      { char:"糖", pinyin:"táng", meaning:"sugar, sweets",        word:"糖果",   wordMeaning:"sweets" },
      { char:"奶", pinyin:"nǎi",  meaning:"milk",                 word:"牛奶",   wordMeaning:"milk" },
      { char:"饺", pinyin:"jiǎo", meaning:"dumpling",             word:"饺子",   wordMeaning:"jiaozi — dumplings" },
      { char:"吃", pinyin:"chī",  meaning:"to eat",               word:"吃饭",   wordMeaning:"to have a meal" },
      { char:"喝", pinyin:"hē",   meaning:"to drink",             word:"喝茶",   wordMeaning:"to drink tea" },
      { char:"冰", pinyin:"bīng", meaning:"ice",                  word:"冰水",   wordMeaning:"iced water" }
    ] },
  { id:"nature", name:"Mountains and Rivers", hanzi:"山",
    blurb:"山, 水, sun, moon, rain — outdoor things, drawn like tiny pictures of themselves.",
    chars: [
      { char:"山", pinyin:"shān", meaning:"mountain",     word:"火山", wordMeaning:"a volcano — a fire mountain" },
      { char:"水", pinyin:"shuǐ", meaning:"water",        word:"山水", wordMeaning:"a landscape — mountains and water" },
      { char:"火", pinyin:"huǒ",  meaning:"fire",         word:"火车", wordMeaning:"a train — literally a fire cart" },
      { char:"土", pinyin:"tǔ",   meaning:"earth, soil",  word:"土豆", wordMeaning:"a potato — literally an earth bean" },
      { char:"木", pinyin:"mù",   meaning:"wood",         word:"木头", wordMeaning:"wood" },
      { char:"日", pinyin:"rì",   meaning:"sun, day",     word:"生日", wordMeaning:"a birthday" },
      { char:"月", pinyin:"yuè",  meaning:"moon, month",  word:"月亮", wordMeaning:"the moon" },
      { char:"天", pinyin:"tiān", meaning:"sky, day",     word:"今天", wordMeaning:"today" },
      { char:"石", pinyin:"shí",  meaning:"stone",        word:"石头", wordMeaning:"a stone" },
      { char:"田", pinyin:"tián", meaning:"field",        word:"田地", wordMeaning:"farmland" },
      { char:"云", pinyin:"yún",  meaning:"cloud",        word:"白云", wordMeaning:"white clouds" },
      { char:"雨", pinyin:"yǔ",   meaning:"rain",         word:"下雨", wordMeaning:"raining" },
      { char:"风", pinyin:"fēng", meaning:"wind",         word:"台风", wordMeaning:"a typhoon — a big wind" },
      { char:"雪", pinyin:"xuě",  meaning:"snow",         word:"雪人", wordMeaning:"a snowman" },
      { char:"星", pinyin:"xīng", meaning:"star",         word:"星星", wordMeaning:"the stars" },
      { char:"河", pinyin:"hé",   meaning:"river",        word:"黄河", wordMeaning:"the Yellow River" },
      { char:"湖", pinyin:"hú",   meaning:"lake",         word:"西湖", wordMeaning:"West Lake" },
      { char:"花", pinyin:"huā",  meaning:"flower",       word:"花园", wordMeaning:"a garden" },
      { char:"草", pinyin:"cǎo",  meaning:"grass",        word:"草地", wordMeaning:"a lawn" },
      { char:"树", pinyin:"shù",  meaning:"tree",         word:"大树", wordMeaning:"a big tree" }
    ] },
  { id:"body", name:"The Body Bits", hanzi:"身",
    blurb:"Hand, heart, head — and 足 as in 足球, which is football, so obviously the best pack.",
    chars: [
      { char:"口", pinyin:"kǒu",  meaning:"mouth",  word:"入口", wordMeaning:"an entrance — the way in" },
      { char:"目", pinyin:"mù",   meaning:"eye",    word:"目光", wordMeaning:"a look, a gaze" },
      { char:"耳", pinyin:"ěr",   meaning:"ear",    word:"耳朵", wordMeaning:"ears" },
      { char:"手", pinyin:"shǒu", meaning:"hand",   word:"手机", wordMeaning:"a mobile phone — literally a hand machine" },
      { char:"足", pinyin:"zú",   meaning:"foot",   word:"足球", wordMeaning:"football" },
      { char:"头", pinyin:"tóu",  meaning:"head",   word:"石头", wordMeaning:"a stone" },
      { char:"心", pinyin:"xīn",  meaning:"heart",  word:"小心", wordMeaning:"careful — literally small-heart" },
      { char:"牙", pinyin:"yá",   meaning:"tooth",  word:"牙刷", wordMeaning:"a toothbrush" },
      { char:"眼", pinyin:"yǎn",  meaning:"eye",    word:"眼睛", wordMeaning:"eyes" },
      { char:"鼻", pinyin:"bí",   meaning:"nose",   word:"鼻子", wordMeaning:"a nose" },
      { char:"脸", pinyin:"liǎn", meaning:"face",   word:"脸红", wordMeaning:"to blush — to go face-red" },
      { char:"脚", pinyin:"jiǎo", meaning:"foot",   word:"脚印", wordMeaning:"a footprint" }
    ] },
  { id:"actions", name:"Doing Things", hanzi:"动",
    blurb:"Run, look, say, write, play, buy, fly — basically a whole holiday in nine characters.",
    chars: [
      { char:"走", pinyin:"zǒu",   meaning:"to walk",             word:"走路",   wordMeaning:"to walk" },
      { char:"跑", pinyin:"pǎo",   meaning:"to run",              word:"跑步",   wordMeaning:"running" },
      { char:"看", pinyin:"kàn",   meaning:"to look",             word:"看书",   wordMeaning:"to read a book" },
      { char:"听", pinyin:"tīng",  meaning:"to listen",           word:"听歌",   wordMeaning:"to listen to songs" },
      { char:"说", pinyin:"shuō",  meaning:"to speak",            word:"说话",   wordMeaning:"to talk" },
      { char:"读", pinyin:"dú",    meaning:"to read",             word:"读书",   wordMeaning:"to read, to study" },
      { char:"写", pinyin:"xiě",   meaning:"to write",            word:"写字",   wordMeaning:"to write characters — what you're doing now" },
      { char:"学", pinyin:"xué",   meaning:"to learn",            word:"学校",   wordMeaning:"school" },
      { char:"玩", pinyin:"wán",   meaning:"to play",             word:"好玩",   wordMeaning:"fun" },
      { char:"来", pinyin:"lái",   meaning:"to come",             word:"来了",   wordMeaning:"coming" },
      { char:"去", pinyin:"qù",    meaning:"to go",               word:"去中国", wordMeaning:"to go to China" },
      { char:"坐", pinyin:"zuò",   meaning:"to sit",              word:"坐船",   wordMeaning:"to take a boat" },
      { char:"站", pinyin:"zhàn",  meaning:"to stand; a station", word:"火车站", wordMeaning:"a train station" },
      { char:"睡", pinyin:"shuì",  meaning:"to sleep",            word:"睡觉",   wordMeaning:"to sleep" },
      { char:"笑", pinyin:"xiào",  meaning:"to laugh",            word:"微笑",   wordMeaning:"a smile" },
      { char:"买", pinyin:"mǎi",   meaning:"to buy",              word:"买票",   wordMeaning:"to buy tickets" },
      { char:"开", pinyin:"kāi",   meaning:"to open",             word:"开门",   wordMeaning:"to open the door" },
      { char:"唱", pinyin:"chàng", meaning:"to sing",             word:"唱歌",   wordMeaning:"to sing songs" },
      { char:"飞", pinyin:"fēi",   meaning:"to fly",              word:"飞机",   wordMeaning:"an aeroplane — a flying machine" },
      { char:"游", pinyin:"yóu",   meaning:"to swim; to tour",    word:"旅游",   wordMeaning:"to travel" }
    ] },
  { id:"time", name:"Seasons and Years", hanzi:"时",
    blurb:"All four seasons, plus year, today, and 明 — which is \"bright\", \"tomorrow\", and the Ming dynasty all at once.",
    chars: [
      { char:"年", pinyin:"nián", meaning:"year",           word:"新年", wordMeaning:"New Year" },
      { char:"今", pinyin:"jīn",  meaning:"now, this",      word:"今天", wordMeaning:"today" },
      { char:"明", pinyin:"míng", meaning:"bright; next",   word:"明天", wordMeaning:"tomorrow — also the Ming dynasty" },
      { char:"昨", pinyin:"zuó",  meaning:"yesterday",      word:"昨天", wordMeaning:"yesterday" },
      { char:"早", pinyin:"zǎo",  meaning:"early, morning", word:"早上", wordMeaning:"the morning" },
      { char:"晚", pinyin:"wǎn",  meaning:"late, evening",  word:"晚上", wordMeaning:"the evening" },
      { char:"时", pinyin:"shí",  meaning:"time",           word:"时间", wordMeaning:"time" },
      { char:"分", pinyin:"fēn",  meaning:"minute",         word:"十分", wordMeaning:"ten minutes — also \"totally\"" },
      { char:"春", pinyin:"chūn", meaning:"spring",         word:"春节", wordMeaning:"Chinese New Year — the Spring Festival" },
      { char:"夏", pinyin:"xià",  meaning:"summer",         word:"夏天", wordMeaning:"summer" },
      { char:"秋", pinyin:"qiū",  meaning:"autumn",         word:"秋天", wordMeaning:"autumn" },
      { char:"冬", pinyin:"dōng", meaning:"winter",         word:"冬天", wordMeaning:"winter" },
      { char:"周", pinyin:"zhōu", meaning:"week",           word:"周末", wordMeaning:"the weekend" },
      { char:"点", pinyin:"diǎn", meaning:"o'clock; a dot", word:"三点", wordMeaning:"three o'clock" }
    ] },
  { id:"travel", name:"Getting Around", hanzi:"行",
    blurb:"Doors, tickets, bridges, boats, the metro, the airport — plus 宫, the palace in 故宫.",
    chars: [
      { char:"车", pinyin:"chē",   meaning:"cart, car",       word:"火车",   wordMeaning:"a train" },
      { char:"门", pinyin:"mén",   meaning:"door, gate",      word:"午门",   wordMeaning:"the Meridian Gate" },
      { char:"路", pinyin:"lù",    meaning:"road",            word:"马路",   wordMeaning:"a road — literally a horse road" },
      { char:"街", pinyin:"jiē",   meaning:"street",          word:"大街",   wordMeaning:"a main street" },
      { char:"桥", pinyin:"qiáo",  meaning:"bridge",          word:"石桥",   wordMeaning:"a stone bridge" },
      { char:"票", pinyin:"piào",  meaning:"ticket",          word:"门票",   wordMeaning:"an entrance ticket" },
      { char:"园", pinyin:"yuán",  meaning:"garden, park",    word:"公园",   wordMeaning:"a park" },
      { char:"店", pinyin:"diàn",  meaning:"shop",            word:"饭店",   wordMeaning:"a restaurant" },
      { char:"馆", pinyin:"guǎn",  meaning:"hall, venue",     word:"博物馆", wordMeaning:"a museum" },
      { char:"宫", pinyin:"gōng",  meaning:"palace",          word:"故宫",   wordMeaning:"the Palace Museum — the old palace" },
      { char:"塔", pinyin:"tǎ",    meaning:"tower, pagoda",   word:"高塔",   wordMeaning:"a tall tower" },
      { char:"楼", pinyin:"lóu",   meaning:"building, floor", word:"高楼",   wordMeaning:"a skyscraper" },
      { char:"船", pinyin:"chuán", meaning:"boat",            word:"坐船",   wordMeaning:"to take a boat" },
      { char:"机", pinyin:"jī",    meaning:"machine",         word:"飞机",   wordMeaning:"an aeroplane" },
      { char:"场", pinyin:"chǎng", meaning:"open place",      word:"机场",   wordMeaning:"an airport" },
      { char:"地", pinyin:"dì",    meaning:"ground, place",   word:"地铁",   wordMeaning:"the metro — literally ground iron" },
      { char:"铁", pinyin:"tiě",   meaning:"iron",            word:"地铁",   wordMeaning:"the metro" }
    ] },
  { id:"opposites", name:"Total Opposites", hanzi:"反",
    blurb:"Up-down, left-right, fast-slow, hot-cold — and 出口 and 入口, the exit and entrance signs you see literally everywhere in China.",
    chars: [
      { char:"下", pinyin:"xià",  meaning:"down, below",   word:"下雨", wordMeaning:"raining — rain coming down" },
      { char:"左", pinyin:"zuǒ",  meaning:"left",          word:"左边", wordMeaning:"the left side" },
      { char:"右", pinyin:"yòu",  meaning:"right",         word:"右边", wordMeaning:"the right side" },
      { char:"前", pinyin:"qián", meaning:"front, before", word:"前面", wordMeaning:"in front" },
      { char:"后", pinyin:"hòu",  meaning:"back, after",   word:"后面", wordMeaning:"behind" },
      { char:"高", pinyin:"gāo",  meaning:"tall, high",    word:"高楼", wordMeaning:"a skyscraper" },
      { char:"低", pinyin:"dī",   meaning:"low",           word:"高低", wordMeaning:"high and low" },
      { char:"新", pinyin:"xīn",  meaning:"new",           word:"新年", wordMeaning:"New Year" },
      { char:"旧", pinyin:"jiù",  meaning:"old",           word:"旧书", wordMeaning:"old books" },
      { char:"多", pinyin:"duō",  meaning:"many",          word:"很多", wordMeaning:"loads" },
      { char:"少", pinyin:"shǎo", meaning:"few",           word:"多少", wordMeaning:"how many — literally many-few" },
      { char:"快", pinyin:"kuài", meaning:"fast",          word:"很快", wordMeaning:"very fast" },
      { char:"慢", pinyin:"màn",  meaning:"slow",          word:"慢慢", wordMeaning:"slowly" },
      { char:"冷", pinyin:"lěng", meaning:"cold",          word:"冷水", wordMeaning:"cold water" },
      { char:"热", pinyin:"rè",   meaning:"hot",           word:"热水", wordMeaning:"hot water" },
      { char:"东", pinyin:"dōng", meaning:"east",          word:"东方", wordMeaning:"the East" },
      { char:"南", pinyin:"nán",  meaning:"south",         word:"南方", wordMeaning:"the south" },
      { char:"出", pinyin:"chū",  meaning:"out",           word:"出口", wordMeaning:"an exit — the way out" },
      { char:"入", pinyin:"rù",   meaning:"in",            word:"入口", wordMeaning:"an entrance — the way in" }
    ] },
  { id:"imperial", name:"Imperial China", hanzi:"帝",
    blurb:"The reward pack. Emperors, brushes, lanterns and 福, which means luck — you've earned the fancy ones.",
    chars: [
      { char:"王", pinyin:"wáng",   meaning:"king",           word:"国王", wordMeaning:"a king" },
      { char:"皇", pinyin:"huáng",  meaning:"emperor",        word:"皇帝", wordMeaning:"the Emperor" },
      { char:"帝", pinyin:"dì",     meaning:"emperor",        word:"皇帝", wordMeaning:"the Emperor" },
      { char:"玉", pinyin:"yù",     meaning:"jade",           word:"玉石", wordMeaning:"jade" },
      { char:"凤", pinyin:"fèng",   meaning:"phoenix",        word:"龙凤", wordMeaning:"dragon and phoenix" },
      { char:"福", pinyin:"fú",     meaning:"luck, blessing", word:"福字", wordMeaning:"the luck character people hang on doors" },
      { char:"寿", pinyin:"shòu",   meaning:"long life",      word:"长寿", wordMeaning:"a long life" },
      { char:"喜", pinyin:"xǐ",     meaning:"joy",            word:"双喜", wordMeaning:"double happiness" },
      { char:"双", pinyin:"shuāng", meaning:"pair, double",   word:"双喜", wordMeaning:"double happiness" },
      { char:"字", pinyin:"zì",     meaning:"character",      word:"汉字", wordMeaning:"Chinese characters — these" },
      { char:"汉", pinyin:"hàn",    meaning:"Han, Chinese",   word:"汉字", wordMeaning:"Chinese characters" },
      { char:"服", pinyin:"fú",     meaning:"clothes",        word:"汉服", wordMeaning:"hanfu — traditional dress" },
      { char:"纸", pinyin:"zhǐ",    meaning:"paper",          word:"剪纸", wordMeaning:"papercutting" },
      { char:"笔", pinyin:"bǐ",     meaning:"pen, brush",     word:"毛笔", wordMeaning:"a writing brush" },
      { char:"墨", pinyin:"mò",     meaning:"ink",            word:"墨水", wordMeaning:"ink" },
      { char:"画", pinyin:"huà",    meaning:"painting",       word:"画画", wordMeaning:"to paint" },
      { char:"诗", pinyin:"shī",    meaning:"poem",           word:"唐诗", wordMeaning:"Tang poetry" },
      { char:"灯", pinyin:"dēng",   meaning:"lamp",           word:"灯笼", wordMeaning:"lanterns" },
      { char:"节", pinyin:"jié",    meaning:"festival",       word:"春节", wordMeaning:"the Spring Festival" }
    ] }
];

/* Flat view for the passport count and credits line. */
const HANZI = HANZI_PACKS.flatMap(p => p.chars);

/* Scale-o-matic cards. Declarative only — check.mjs evaluates this file,
   so no functions; the three ops (divide, inverse, plusYears) live in
   site.js. Every unitValue mirrors a number already published in that
   trip's FACTS, so there is exactly one copy of the truth to verify.
   input.key is shared across cards site-wide ("heightCm" typed at the
   Great Wall is pre-filled in Shanghai). */
const COMPARATORS = {
  sub: "Type in your numbers and the trip gets measured in you.",
  "forbidden-city": [
    { id:"rooms-vs-school", title:"Palace vs Your School",
      unitValue:8707, unitLabel:"Real number: 8,707 rooms — same as the facts above",
      input:{ key:"schoolRooms", label:"Rooms in your school", def:60, min:1, max:5000, step:1 },
      line:"The Forbidden City has 8,707 rooms, which is {n} of your entire school. Imagine the fire drills." },
    { id:"room-a-night", title:"One Room a Night", op:"plusYears",
      unitValue:8707, unitLabel:"Real number: 8,707 rooms, one night each",
      input:{ key:"age", label:"Your age", def:11, min:4, max:120, step:1 },
      line:"Sleep in a different room every single night and you'd finish aged {n}. Hope you like moving beds." }
  ],
  "great-wall": [
    { id:"walk-the-wall", title:"Walk the Whole Wall",
      unitValue:21196, unitLabel:"Real number: 21,196 km of wall in total",
      input:{ key:"walkKm", label:"How far you walk to school (km)", def:1, min:0.1, max:50, step:0.1 },
      line:"At your usual {v} km a day, all 21,196 km of wall would take you {n} days. Pack snacks." },
    { id:"wall-vs-you", title:"The Wall vs You",
      unitValue:800, unitLabel:"Real number: up to 8 m high at Mutianyu",
      input:{ key:"heightCm", label:"Your height (cm)", def:145, min:50, max:250, step:1 },
      line:"At Mutianyu the wall goes up to 8 m high — that's {n} of you, stacked up." }
  ],
  "xian": [
    { id:"army-vs-school", title:"Army vs Your School",
      unitValue:8000, unitLabel:"Real number: 8,000 clay soldiers",
      input:{ key:"schoolPeople", label:"People in your school", def:500, min:10, max:10000, step:10 },
      line:"8,000 clay soldiers is enough to fill your school {n} times over, and they'd all behave better than your class." },
    { id:"tomb-years", title:"38 Years of Digging",
      unitValue:38, unitLabel:"Real number: 38 years to build the tomb",
      input:{ key:"age", label:"Your age", def:11, min:4, max:120, step:1 },
      line:"The First Emperor's tomb took 38 years to build, which is {n} of your entire life so far. For one grave." }
  ],
  "xitang": [
    { id:"corridor-vs-corridor", title:"Corridor vs Corridor",
      unitValue:1000, unitLabel:"Real number: 1,000 m of covered corridor",
      input:{ key:"corridorM", label:"Your school's longest corridor (m)", def:30, min:5, max:500, step:5 },
      line:"Xitang's covered corridor runs 1,000 m, which is {n} of your school's longest corridor joined up." },
    { id:"lane-vs-armspan", title:"Too Wide for Xitang", op:"inverse",
      unitValue:80, unitLabel:"Real number: the narrowest lane is 80 cm",
      input:{ key:"armSpanCm", label:"Your arm span (cm)", def:140, min:50, max:250, step:1 },
      line:"Xitang's narrowest lane is 80 cm across, so with your arms out you're {n} times wider than the whole street." }
  ],
  "shanghai": [
    { id:"tower-of-you", title:"A Tower Made of You",
      unitValue:63200, unitLabel:"Real number: Shanghai Tower is 632 m",
      input:{ key:"heightCm", label:"Your height (cm)", def:145, min:50, max:250, step:1 },
      line:"Shanghai Tower is 632 m tall — that's {n} of you balanced on top of each other. Don't wobble." },
    { id:"you-vs-maglev", title:"You vs the Maglev",
      unitValue:431, unitLabel:"Real number: the Maglev tops 431 km/h",
      input:{ key:"runKmh", label:"Your fastest sprint (km/h)", def:12, min:1, max:45, step:1 },
      line:"Flat out you do {v} km/h, and the Maglev does 431, so it's {n} times faster than your absolute best. Sorry." }
  ]
};

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

/* The hidden-cat hunt: one cat per page, tucked into a corner of its
   anchor element. Finding all of them unlocks the Palace Cats bonus on
   play.html — anchored in the true fact that the Palace Museum has famous
   resident cats. `corner` is tl/tr/bl/br; `pose` picks a sticker
   silhouette in site.js. */
const CATS = [
  { id:"cat-home",    page:"index.html",   anchor:"#tripChooser",  corner:"br", pose:"sit",
    line:"A cat, right on the front page. Bold of it." },
  { id:"cat-story",   page:"story.html",   anchor:"#historyIntro", corner:"tr", pose:"loaf",
    line:"This one's been sitting in the history bit the whole time. Probably knows more than me by now." },
  { id:"cat-family",  page:"family.html",  anchor:"#familyGrid",   corner:"bl", pose:"sit",
    line:"A cat hiding in with my family. Honestly, it fits right in." },
  { id:"cat-map",     page:"map.html",     anchor:"#mapCase",      corner:"bl", pose:"loaf",
    line:"Found on the map. Cats always know exactly where they are." },
  { id:"cat-gallery", page:"gallery.html", anchor:"#galleryGrid",  corner:"tr", pose:"sit",
    line:"Hiding in the gallery. It's not actually in any of the photos, I checked." },
  { id:"cat-journey", page:"journey.html", anchor:".journey-map",  corner:"br", pose:"loaf",
    line:"A cat on the journey page. Longest walk of its little life." },
  { id:"cat-play",    page:"play.html",    anchor:".passport-book", corner:"tl", pose:"sit",
    line:"This one was on the games page the whole time. Sneaky little thingymajig." }
];

/* The bonus pack behind the hunt. Every fact verified; hedges kept. */
const CAT_BONUS = {
  heading:"The Palace Cats",
  hanzi:"宫猫",
  intro:"Seven out of seven — so now you get to know the thing I love most, which is that the Forbidden City has real actual cats living in it.",
  facts: [
    "The Palace Museum is home to a whole population of stray cats today — reportedly well over a hundred — and the staff feed them and give them names.",
    "So the story goes, they're reportedly descendants of the cats the Ming and Qing emperors kept. Imagine having an emperor for your great-great-whatever owner.",
    "The Ming palace genuinely had an official Cat Room — 猫儿房 — an actual office of palace staff whose whole job was raising the court's cats. A department. For cats.",
    "Emperor Jiajing's favourite cat was called Shuangmei, which means Frost-Eyebrows. When she died she reportedly got a coffin and her own burial mound.",
    "They earn their keep, too — the cats scare off the rodents that could chew the ancient wooden halls. Basically tiny security guards."
  ],
  certificateHeading:"Official Cat-Finder Certificate",
  certificateBody:"This certifies that ______________________ found all seven cats hiding on this website, which took proper detective work. Verified by me, personally. — Maisie"
};
