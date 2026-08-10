/* ============================================================
   SHARED SITE LOGIC — every page includes this after data.js.
   Each block guards on the elements it needs existing, so pages
   only wire up the bits of UI they actually contain.
   ============================================================ */

/* ---------- Current trip ----------
   Resolved from ?trip=<id>. Falling back to TRIPS[0] keeps every existing
   link (and the already-deployed site) working with no query string. */
const CURRENT_TRIP = (function(){
  if(typeof TRIPS === "undefined") return null;
  const id = new URLSearchParams(location.search).get("trip");
  return TRIPS.find(t => t.id === id) || TRIPS[0];
})();

const TRIP_LOCATIONS = (CURRENT_TRIP && typeof LOCATIONS !== "undefined")
  ? LOCATIONS.filter(l => l.trip === CURRENT_TRIP.id)
  : (typeof LOCATIONS !== "undefined" ? LOCATIONS : []);

/* Resolve a photo's src from its OWN trip, not the current one, so a photo
   always points at the right folder regardless of which page shows it. */
function photoSrc(photo){
  const trip = (typeof TRIPS !== "undefined") ? TRIPS.find(t => t.id === photo.trip) : null;
  return trip ? `Photographs/${trip.photoDir}/${photo.file}` : `Photographs/${photo.file}`;
}

/* Thumbnail markup for one PHOTOS entry, shared by the map popout and the
   gallery. Video entries are flagged with an explicit type:"video" field rather
   than sniffing the extension. The #t=0.5 fragment makes the browser pull a
   frame half a second in as the still, so a video thumb doesn't render black
   without needing a separate poster JPG. */
function thumbMedia(photo){
  if(photo.type === "video"){
    return `<video src="${photoSrc(photo)}#t=0.5" muted playsinline preload="metadata"></video>
            <span class="play-badge" aria-hidden="true">▶</span>`;
  }
  return `<img src="${photoSrc(photo)}" alt="${photo.caption}" loading="lazy" />${creditBadge(photo)}`;
}

/* ---------- Attribution for sourced (non-family) photos ----------
   A handful of PHOTOS entries aren't the family's own and carry an optional
   credit:{author, license, licenseUrl}. CC BY / BY-SA both require the
   attribution to be visible wherever the work is shown, so it goes on the
   thumbnail as well as in the modal — naming it in CLAUDE.md isn't enough.
   The thumbnail version is deliberately plain text: a thumb is a <button>,
   and an <a> nested inside interactive content is invalid HTML. */
function creditBadge(photo){
  if(!photo.credit) return "";
  return `<span class="thumb-credit">© ${photo.credit.author} · ${photo.credit.license}</span>`;
}

/* ---------- Hero jump chips (story page) ----------
   Sections that reveal themselves append a chip to the hero so readers
   can see what's further down without scrolling blind. No-op on pages
   without the container; #factsJump stays a static element because
   check.mjs asserts it. */
function addHeroJump(href, label){
  const box = document.getElementById("heroJumps");
  if(!box) return;
  const a = document.createElement("a");
  a.className = "hero-jump";
  a.href = href;
  a.textContent = label;
  /* Chips arrive in script-execution order, which isn't page order —
     slot each one by where its target section actually sits. */
  const target = document.getElementById(href.replace(/^#/, ""));
  const before = [...box.children].find(c=>{
    const t = document.getElementById((c.getAttribute("href") || "").replace(/^#/, ""));
    return t && target && (target.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  box.insertBefore(a, before || null);
}

/* ---------- Reduced motion, shared flag ----------
   The stylesheet's prefers-reduced-motion blanket only reaches CSS
   animation; anything JS drives (count-ups, path draws, injected
   animations) must check this flag itself. */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Persistent state ----------
   One namespaced localStorage key holding a single JSON object, so the
   site never scatters keys and a future format change only has to bump
   the version suffix. Every access is wrapped: localStorage can be
   absent or throwing (private browsing, storage-blocked embeds) and the
   site must degrade to session-only behaviour, never error.

   Keys in use: sound (on/off), visited {tripId:true}, quizBest
   {tripId:n}, spotBest (n), cats {catId:true}, hanzi {char:true},
   inputs {comparatorKey:value}. */
const store = (function(){
  const KEY = "china2026:v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } };
  const save = d  => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e){} };
  return {
    get:   (k, fallback) => { const d = load(); return (k in d) ? d[k] : fallback; },
    set:   (k, v) => { const d = load(); d[k] = v; save(d); },
    patch: (k, obj) => { const d = load(); d[k] = Object.assign({}, d[k], obj); save(d); }
  };
})();

/* ---------- SoundKit ----------
   All audio in one place: the per-trip ambient loop (from AUDIO in
   extras.js), tiny WebAudio chirps for game feedback, and zh-CN speech
   for the hanzi playground. Ambience is OFF by default and only ever
   starts inside a user gesture — iOS and Chrome both refuse play()
   outside one, which is also why a page load with sound left on waits
   for the first pointerdown/keydown before resuming. speak() is
   independent of the ambience toggle: pressing a pronunciation button
   is its own consent. */
const SoundKit = (function(){
  let ambience = null;   // lazy <audio>, created inside a gesture
  let ctx = null;        // lazy AudioContext for the fx chirps

  const enabled = () => store.get("sound", "off") === "on";

  function ambientSrc(){
    if(typeof AUDIO === "undefined" || !CURRENT_TRIP) return null;
    return AUDIO[CURRENT_TRIP.id] || null;
  }

  function startAmbience(){
    const src = ambientSrc();
    if(!src) return;
    if(!ambience){
      ambience = document.createElement("audio");
      ambience.src = src.file;
      ambience.loop = true;
      ambience.preload = "none";
      ambience.volume = 0.35;
    }
    ambience.play().catch(()=>{});
  }

  function stopAmbience(){
    if(ambience) ambience.pause();
  }

  /* Feedback chirps are synthesised, not files: nothing to license,
     nothing to download, and they can't 404. No-ops while sound is off. */
  const FX = {
    right: [[660, 0], [880, 0.07]],
    wrong: [[220, 0], [175, 0.09]],
    stamp: [[330, 0], [220, 0.05]],
    cat:   [[780, 0], [990, 0.06], [1245, 0.12]]
  };
  function fx(name){
    if(!enabled() || !FX[name]) return;
    try{
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if(ctx.state === "suspended") ctx.resume();
      for(const [freq, at] of FX[name]){
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = freq;
        const t = ctx.currentTime + at;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.1, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + 0.14);
      }
    }catch(e){}
  }

  const zhVoice = () =>
    speechSynthesis.getVoices().find(v => /^zh([-_]|$)/i.test(v.lang));

  function speak(text){
    if(!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.8;
    const v = zhVoice();
    if(v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  /* Voice lists load async on most engines and some never fire
     voiceschanged, so callers get an answer via callback, exactly once. */
  function hasZhVoice(cb){
    if(!("speechSynthesis" in window)) return cb(false);
    let done = false;
    const answer = () => { if(!done){ done = true; cb(!!zhVoice()); } };
    if(speechSynthesis.getVoices().length) return answer();
    speechSynthesis.addEventListener("voiceschanged", answer, { once:true });
    setTimeout(answer, 1500);
  }

  return { enabled, startAmbience, stopAmbience, fx, speak, hasZhVoice };
})();

/* ---------- Nav: mobile toggle + current-page highlight ---------- */
(function(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if(toggle && links){
    toggle.addEventListener("click", ()=> links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>links.classList.remove("open")));
  }
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(a=>{
    const [pathAndQuery, hash] = a.getAttribute("href").split("#");
    const hrefPath = pathAndQuery.split("?")[0] || "index.html";
    // Anchor links point within a page, so they'd double-highlight alongside
    // the page's own nav entry. Only the plain page link gets "current".
    if(hrefPath === here && !hash) a.classList.add("current");
  });
})();

/* ---------- Contextual nav ----------
   The header carries the full set of links in static markup (check.mjs asserts
   all the pages agree), and this block adapts it per page. The home page is
   the trip chooser: trip-scoped links (story/facts/map/gallery) would silently
   land the reader on TRIPS[0] before they've chosen, so they hide there. On
   every other page a chip names the trip you're inside and links back to the
   chooser to switch. */
(function(){
  const links = document.getElementById("navLinks");
  if(!links) return;
  const here = location.pathname.split("/").pop() || "index.html";
  if(here === "index.html"){
    links.querySelectorAll("a[href]").forEach(a=>{
      const page = a.getAttribute("href").split("#")[0].split("?")[0];
      if(/^(story|map|gallery)\.html$/.test(page)) a.hidden = true;
    });
    return;
  }
  if(!CURRENT_TRIP) return;
  const chip = document.createElement("a");
  chip.className = "nav-trip";
  chip.href = "index.html";
  chip.title = "Choose another trip";
  chip.innerHTML = `<span aria-hidden="true">${CURRENT_TRIP.icon}</span><span class="nav-trip-name">${CURRENT_TRIP.name}</span><b aria-hidden="true">⇄</b>`;
  const brand = document.querySelector(".nav-brand");
  if(brand) brand.insertAdjacentElement("afterend", chip);
})();

/* ---------- Carry the current trip across every internal link ----------
   It isn't just the header nav that needs the param. Each page ends with
   "what to look at next" cards pointing at bare page names, and without the
   trip on them the reader gets silently dumped back onto TRIPS[0] — the Great
   Wall gallery's "See them on the map" would open the Forbidden City map.

   Links that already name a trip are left alone, which is what protects the
   home-page chooser cards from being rewritten to all point at the same trip.
   Hash is split off BEFORE the query, or "story.html#facts" would be rebuilt
   as "story.html#facts?trip=..." with the param stuck inside the fragment. */
(function(){
  if(!CURRENT_TRIP) return;
  const PAGES = /^(index|story|family|map|gallery|journey|play)\.html$/;
  document.querySelectorAll("a[href]").forEach(a=>{
    const raw = a.getAttribute("href");
    if(/^([a-z]+:|\/\/|#)/i.test(raw)) return;          // external, protocol-relative, in-page
    const [pathAndQuery, hash] = raw.split("#");
    const [path, query] = pathAndQuery.split("?");
    if(!PAGES.test(path)) return;
    if(query && /(^|&)trip=/.test(query)) return;       // already trip-specific
    a.setAttribute("href", path + "?trip=" + CURRENT_TRIP.id + (hash ? "#" + hash : ""));
  });
})();

/* Expose the trip on <body> so CSS can tune per-trip (the hand-drawn Xi'an
   plan is sparser than the Forbidden City one, so its pins want to be quieter). */
if(CURRENT_TRIP) document.documentElement.setAttribute("data-trip", CURRENT_TRIP.id);

/* ---------- Hero seal: show the current trip's characters ---------- */
(function(){
  const seal = document.getElementById("heroSeal");
  if(seal && CURRENT_TRIP) seal.textContent = CURRENT_TRIP.chinese;
})();

/* ---------- Version stamp (every page) ----------
   No element guard: there's no per-page container to key off, so this
   creates its own node and guards on the constant instead. */
(function(){
  if(typeof SITE_VERSION === "undefined") return;
  const el = document.createElement("div");
  el.className = "version-stamp";
  el.textContent = "v" + SITE_VERSION;
  document.body.appendChild(el);
})();

/* ---------- Sound toggle (every page) ----------
   Injected like the version stamp: no per-page container. Bottom-right
   (the stamp owns bottom-left). Turning it on inside the click handler
   satisfies the autoplay rules; arriving on a page with sound already on
   waits for the first gesture instead. */
(function(){
  if(typeof AUDIO === "undefined" || !CURRENT_TRIP) return;
  const btn = document.createElement("button");
  btn.id = "soundToggle";
  btn.className = "sound-toggle";
  const paint = () => {
    const on = SoundKit.enabled();
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.innerHTML = on ? "🔊 <span>Sound on</span>" : "🔇 <span>Sound off</span>";
  };
  btn.addEventListener("click", () => {
    const on = !SoundKit.enabled();
    store.set("sound", on ? "on" : "off");
    if(on) SoundKit.startAmbience(); else SoundKit.stopAmbience();
    paint();
  });
  paint();
  document.body.appendChild(btn);

  if(SoundKit.enabled()){
    const resume = () => SoundKit.startAmbience();
    window.addEventListener("pointerdown", resume, { once:true });
    window.addEventListener("keydown", resume, { once:true });
  }
})();

/* ---------- Play-page credits panel ----------
   Sounds are CC0 so credit isn't legally required, but the site's rule is
   that sourced media gets visible attribution regardless. Vendored
   libraries add their lines here in later features. */
(function(){
  const box = document.getElementById("playCredits");
  if(!box || typeof AUDIO === "undefined" || typeof TRIPS === "undefined") return;
  const lines = Object.entries(AUDIO).map(([tripId, a]) => {
    const trip = TRIPS.find(t => t.id === tripId);
    return `<li>${trip ? trip.name : tripId} ambience: <a href="${a.sourceUrl}">“${a.title}”</a> by ${a.author} (${a.license})</li>`;
  });
  if(typeof HANZI !== "undefined" && HANZI.length){
    lines.push(`<li>Character strokes: <a href="https://hanziwriter.org">Hanzi Writer</a> (MIT),
      data from <a href="https://github.com/skishore/makemeahanzi">Make Me a Hanzi</a> (Arphic Public License)</li>`);
  }
  if(!lines.length) return;
  box.innerHTML = `<h3>Credits, because fair's fair</h3>
    <ul>${lines.join("")}</ul>`;
  box.hidden = false;
})();

/* ---------- Scroll reveal ---------- */
(function(){
  const revealEls = document.querySelectorAll(".reveal");
  if(!revealEls.length) return;
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, {threshold:0.12});
    revealEls.forEach(el=>io.observe(el));
  } else {
    revealEls.forEach(el=>el.classList.add("in"));
  }
})();

/* ---------- History intro (story page) ---------- */
(function(){
  const el = document.getElementById("historyIntro");
  if(!el) return;
  const intro = (CURRENT_TRIP && CURRENT_TRIP.intro)
    || (typeof HISTORY_INTRO !== "undefined" ? HISTORY_INTRO : null);
  if(intro) el.innerHTML = intro;
})();

/* ---------- Ten mind-blowing facts (story page) ----------
   Teaser tiles show only the number. The fact itself lives in a popout you
   step through with ←/→ without closing, so reading all ten is one gesture
   rather than ten. The section is hidden in the markup and only revealed if
   the current trip actually has facts, so a trip without them doesn't leave
   an empty heading. */
(function(){
  const grid = document.getElementById("factsGrid");
  if(!grid || typeof FACTS === "undefined" || !CURRENT_TRIP) return;
  const facts = FACTS[CURRENT_TRIP.id];
  if(!facts || !facts.length) return;

  /* Four enamel fields, cycled by index. Real cloisonné is polychrome, and a
     grid of identical tiles reads as a spreadsheet. */
  const ENAMELS = ["teal", "coral", "jade", "deep"];

  grid.innerHTML = facts.map((f, i)=>`
    <button class="fact-tile" data-index="${i}" data-enamel="${ENAMELS[i % ENAMELS.length]}">
      <span class="fact-index">${String(i + 1).padStart(2, "0")}</span>
      <span class="fact-stat" data-stat="${f.stat}">${f.stat}</span>
      <span class="fact-label">${f.label}</span>
      <span class="fact-hint">tap to find out →</span>
    </button>
  `).join("");

  const sub = document.getElementById("factsSub");
  if(sub) sub.textContent = `Ten things about ${CURRENT_TRIP.name} I genuinely did not believe until I checked.`;

  const section = document.getElementById("facts");
  section.hidden = false;

  /* The section starts hidden, so the browser can't honour a #facts fragment on
     first paint — there's nothing to scroll to yet. Redo the jump by hand once
     it's revealed, then again after load: images and the reveal animations
     change the page height after first paint, and a jump made before that
     settles lands several hundred pixels off.

     `behavior:"auto"` is deliberate: the stylesheet sets scroll-behavior:smooth,
     and an animated jump started during load gets cancelled partway, leaving you
     at the top of the page. An instant jump can't be interrupted. scrollIntoView
     (rather than scrollTo) is used so #facts's scroll-margin-top keeps the
     heading clear of the sticky nav. */
  if(location.hash === "#facts"){
    /* Landing here from another page is surprisingly awkward to get right: the
       section is revealed by script (so there's nothing for the browser's own
       fragment handling to find), and the big CJK webfonts land after load and
       reflow the long intro above it by several hundred pixels. A single jump
       at any one moment therefore lands short, long, or not at all depending on
       what has finished loading.

       So rather than guess the right moment, re-assert the position every frame
       for a short window and stop the instant the reader takes over. */
    const jumpToFacts = ()=> section.scrollIntoView({ block:"start", behavior:"auto" });
    let settled = false;
    const release = ()=>{ settled = true; };
    // pointerdown covers a scrollbar drag, which fires none of the others and
    // would otherwise be fought by the pin for the rest of the window.
    ["wheel","keydown","pointerdown","touchstart"].forEach(e =>
      window.addEventListener(e, release, { once:true, passive:true }));

    const until = Date.now() + 1200;
    (function pin(){
      if(settled) return;
      jumpToFacts();
      if(Date.now() < until) requestAnimationFrame(pin);
    })();
  }

  /* The jump link lives above the fold; hide it if there's nothing to jump to. */
  const jump = document.getElementById("factsJump");
  if(jump){
    jump.hidden = false;
    /* Supplement the browser's own fragment jump rather than replacing it — no
       preventDefault, so if this scroll ever fails the plain anchor still works
       and the button can't end up dead. It's here because clicking the link
       when the URL already ends in #facts is a same-fragment navigation, which
       browsers ignore; without this the button would do nothing on the second
       press, or when arriving via the nav's "10 Facts" link. */
    jump.addEventListener("click", ()=>{
      section.scrollIntoView({ block:"start" });
    });
  }

  /* ---- Count the stats up when the grid first comes into view ----
     Only the leading number animates; any suffix ("52 m", "19 million") is
     re-appended every frame so the tile never changes shape mid-count. This is
     a content change rather than a CSS animation, so the stylesheet's
     prefers-reduced-motion blanket can't suppress it — it needs its own guard. */
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el){
    const raw = el.dataset.stat;
    const parts = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    if(!parts) return;                                   // e.g. a purely verbal stat
    const target = parseFloat(parts[1].replace(/,/g, ""));
    if(!isFinite(target)) return;
    const suffix = parts[2];
    const decimals = (parts[1].split(".")[1] || "").length;
    /* Group thousands only if the stat itself does. Years are the reason:
       counting to "1974" would otherwise read "1,974" every frame and then
       snap to the ungrouped string on the last one. */
    const grouped = parts[1].indexOf(",") !== -1;
    const DURATION = 900;
    const started = performance.now();
    (function frame(now){
      const t = Math.min(1, (now - started) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      if(t < 1){
        el.textContent = (target * eased).toLocaleString("en-GB", {
          minimumFractionDigits:decimals, maximumFractionDigits:decimals,
          useGrouping:grouped
        }) + suffix;
        requestAnimationFrame(frame);
      } else {
        el.textContent = raw;                            // land on the exact string
      }
    })(started);
  }
  if(!REDUCED && "IntersectionObserver" in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        obs.unobserve(e.target);                         // count once, never again
        countUp(e.target);
      });
    }, {threshold:0.4});
    grid.querySelectorAll(".fact-stat").forEach(el=>io.observe(el));
  }

  /* ---- The popout ----
     Guarded separately so a page served from an older cache still gets working
     tiles, a revealed section and a working jump link. */
  const overlay = document.getElementById("factOverlay");
  const pop = overlay && overlay.querySelector(".fact-pop");
  if(!overlay || !pop) return;

  const elBadge = document.getElementById("factBadge");
  const elStat  = document.getElementById("factStat");
  const elLabel = document.getElementById("factLabel");
  const elQuote = document.getElementById("factQuote");
  const elCount = document.getElementById("factCount");
  const elDots  = document.getElementById("factDots");
  const btnPrev = document.getElementById("factPrev");
  const btnNext = document.getElementById("factNext");
  const btnClose = document.getElementById("factClose");

  let index = 0;
  let lastFocused = null;

  elDots.innerHTML = facts.map((f, i)=>
    `<span class="fact-dot" data-index="${i}"></span>`).join("");

  function draw(){
    const f = facts[index];
    elBadge.textContent = `Fact ${String(index + 1).padStart(2, "0")} of ${facts.length}`;
    elStat.textContent  = f.stat;
    elLabel.textContent = f.label;
    // The opening quote mark is its own element in the markup; this closes it.
    elQuote.innerHTML   = f.text + "”";
    elCount.textContent = `${index + 1} / ${facts.length}`;
    pop.dataset.enamel  = ENAMELS[index % ENAMELS.length];
    Array.prototype.forEach.call(elDots.children, (dot, i)=>
      dot.classList.toggle("on", i === index));
  }

  function openFact(i){
    index = i;
    draw();
    lastFocused = document.activeElement;
    overlay.hidden = false;
    /* Replay the spring even if the overlay was somehow already open — reading
       the offsetHeight is what forces the restart. */
    pop.style.animation = "none";
    void pop.offsetHeight;
    pop.style.animation = "";
    btnClose.focus();
  }

  function closeFact(){
    if(overlay.hidden) return;
    overlay.hidden = true;
    if(lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }

  /* Wraps rather than stopping at either end — ten facts is a loop, not a
     queue, and a dead arrow at fact 10 reads like a bug. */
  function step(delta){
    index = (index + delta + facts.length) % facts.length;
    draw();
  }

  grid.addEventListener("click", e=>{
    const tile = e.target.closest(".fact-tile");
    if(tile) openFact(parseInt(tile.dataset.index, 10));
  });
  btnPrev.addEventListener("click", ()=>step(-1));
  btnNext.addEventListener("click", ()=>step(1));
  btnClose.addEventListener("click", closeFact);
  elDots.addEventListener("click", e=>{
    const dot = e.target.closest(".fact-dot");
    if(!dot) return;
    index = parseInt(dot.dataset.index, 10);
    draw();
  });
  overlay.addEventListener("click", e=>{ if(e.target === overlay) closeFact(); });

  /* Keyboard is bound to the overlay rather than the document: focus is moved
     inside on open and trapped there, so this can't fire while the reader is
     elsewhere on the page, and it can't collide with another page's Escape
     handler. */
  const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  overlay.addEventListener("keydown", e=>{
    if(e.key === "Escape"){ closeFact(); return; }
    if(e.key === "ArrowRight"){ e.preventDefault(); step(1); return; }
    if(e.key === "ArrowLeft"){ e.preventDefault(); step(-1); return; }
    if(e.key !== "Tab") return;
    const items = Array.prototype.filter.call(
      pop.querySelectorAll(FOCUSABLE), el => el.offsetParent !== null);
    if(!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
})();

/* ---------- Family grid (family page) ---------- */
(function(){
  const familyGrid = document.getElementById("familyGrid");
  if(!familyGrid || typeof FAMILY === "undefined") return;
  FAMILY.forEach(person=>{
    const card = document.createElement("div");
    card.className = "family-card";
    card.innerHTML = `
      <div class="seal-avatar" id="avatar-${person.id}">${person.emoji}</div>
      <h3>${person.name}</h3>
      <div class="family-role">${person.role}</div>
      <p>${person.bio}</p>
    `;
    familyGrid.appendChild(card);
    const img = new Image();
    img.onload = ()=>{
      const av = document.getElementById(`avatar-${person.id}`);
      if(!av) return;
      av.innerHTML = "";
      const el = document.createElement("img");
      el.src = `Photographs/${person.file}`;
      el.alt = person.name;
      av.appendChild(el);
    };
    img.src = `Photographs/${person.file}`;
  });
})();

/* ---------- Photo modal (used by both the map popout and the gallery page) ---------- */
let openPhoto = function(){};
(function(){
  const modalOverlay = document.getElementById("modalOverlay");
  if(!modalOverlay) return;
  const modalImg = document.getElementById("modalImg");
  const modalVideo = document.getElementById("modalVideo");
  const modalTitle = document.getElementById("modalTitle");
  const modalDetail = document.getElementById("modalDetail");
  const modalLocation = document.getElementById("modalLocation");
  const modalCredit = document.getElementById("modalCredit");

  /* Drop the video's source entirely rather than just hiding it — a paused
     <video> that still holds a src keeps buffering, and leaving one loaded
     behind a closed overlay is how audio ends up bleeding into the next photo. */
  function unloadVideo(){
    if(!modalVideo) return;
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    modalVideo.style.display = "none";
  }

  openPhoto = function(photo){
    if(photo.type === "video" && modalVideo){
      modalImg.style.display = "none";
      modalImg.removeAttribute("src");
      modalVideo.src = photoSrc(photo);
      modalVideo.style.display = "block";
    } else {
      unloadVideo();
      modalImg.src = photoSrc(photo);
      modalImg.alt = photo.caption;
      modalImg.style.display = "block";
    }
    modalTitle.textContent = photo.caption;
    modalDetail.innerHTML = photo.detail || "";
    if(modalLocation){
      const loc = (typeof LOCATIONS !== "undefined") ? LOCATIONS.find(l=>l.id===photo.location) : null;
      modalLocation.textContent = loc ? `${loc.num}. ${loc.name}` : "";
    }
    /* Full attribution, with the licence linked out to its deed. Hidden
       outright for the family's own photos rather than left as an empty rule. */
    if(modalCredit){
      const c = photo.credit;
      modalCredit.innerHTML = c
        ? `Photograph by ${c.author}, used under <a href="${c.licenseUrl}" target="_blank" rel="noopener license">${c.license}</a>. Not one of ours.`
        : "";
      modalCredit.hidden = !c;
    }
    modalOverlay.classList.add("open");
  };
  function closePhotoModal(){
    modalOverlay.classList.remove("open");
    unloadVideo();
  }
  document.getElementById("modalClose").addEventListener("click", closePhotoModal);
  modalOverlay.addEventListener("click", e=>{ if(e.target===modalOverlay) closePhotoModal(); });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closePhotoModal(); });
})();

/* ---------- Map page: swap the plan + credit for the current trip ---------- */
(function(){
  if(!CURRENT_TRIP) return;
  const img = document.getElementById("mapImg");
  if(img){
    img.src = "assets/" + CURRENT_TRIP.map;
    img.alt = CURRENT_TRIP.mapAlt;
  }
  const legend = document.getElementById("mapLegend");
  if(legend) legend.textContent = CURRENT_TRIP.mapCredit;
})();

/* ---------- Home page: rotate the hero image per visit ----------
   No trip is the site's theme, so the front page shouldn't permanently lead
   with one trip's photograph. Picks a random trip's `hero` on each load. The
   stylesheet keeps a hard-coded background as the no-JS fallback; note its URL
   is relative to assets/, whereas `hero` paths here are relative to the page. */
(function(){
  const hero = document.querySelector(".hero.home-hero");
  if(!hero || typeof TRIPS === "undefined") return;
  const candidates = TRIPS.filter(t => t.hero);
  if(!candidates.length) return;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  hero.style.backgroundImage = `url('${pick.hero}')`;
  hero.dataset.heroTrip = pick.id;
})();

/* ---------- Home page: the hero subtitle, counted from TRIPS ----------
   The site covers a growing number of trips, so the count and the city list are
   derived rather than written into the markup — otherwise every new trip leaves
   a stale "two trips" on the front page. Cities are de-duplicated because more
   than one trip can share a city (the Forbidden City and the Great Wall are
   both Beijing). */
(function(){
  const sub = document.getElementById("heroSub");
  if(!sub || typeof TRIPS === "undefined" || !TRIPS.length) return;

  const WORDS = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
  const count = WORDS[TRIPS.length] || String(TRIPS.length);

  const cities = [...new Set(TRIPS.map(t => t.city).filter(Boolean))];
  const cityList = cities.length > 1
    ? cities.slice(0, -1).join(", ") + " and " + cities[cities.length - 1]
    : cities[0] || "";

  /* Phrased as "N trips across <cities>" rather than "N trips across China —
     <cities>", because trips and cities don't match one-to-one: three trips
     across two cities reads like an error when both numbers are on show. */
  const trips = TRIPS.length === 1 ? "trip" : "trips";
  sub.textContent = cityList
    ? `${count} ${trips} across ${cityList}, told by me, Maisie, aged 11, world's leading expert.`
    : `${count} ${trips} across China, told by me, Maisie, aged 11, world's leading expert.`;
})();

/* ---------- Home page: a card per trip ---------- */
(function(){
  const chooser = document.getElementById("tripChooser");
  if(!chooser || typeof TRIPS === "undefined") return;
  const cards = TRIPS.map(trip=>{
    const a = document.createElement("a");
    a.className = "nav-card";
    a.href = `map.html?trip=${trip.id}`;
    /* Magazine cover lines: say how much is inside, computed so a new photo
       or fact never leaves a stale count. Zero-count parts just drop out. */
    const counts = [
      [(typeof LOCATIONS !== "undefined") ? LOCATIONS.filter(l=>l.trip===trip.id).length : 0, "spots"],
      [(typeof PHOTOS !== "undefined") ? PHOTOS.filter(p=>p.trip===trip.id).length : 0, "photos"],
      [(typeof FACTS !== "undefined" && FACTS[trip.id]) ? FACTS[trip.id].length : 0, "facts"]
    ].filter(([n])=>n).map(([n, word])=>`${n} ${word}`).join(" · ");
    a.innerHTML = `
      <div class="icon">${trip.icon}</div>
      <span class="hanzi">${trip.chinese}</span>
      <h3>${trip.name}</h3>
      <p>${trip.blurb}</p>
      ${counts ? `<span class="card-counts">${counts}</span>` : ""}
    `;
    return a;
  });
  // Trip cards go first; whatever's already in the markup (Meet the Expedition)
  // stays put at the end.
  chooser.prepend(...cards);

  /* Feature cards for the trip-agnostic pages, slotted between the trips
     and the static Expedition card. Their cover lines are computed like
     the trip counts, so they never go stale. Prefix match: the ?trip=
     rewrite pass has already run over the static markup by now. */
  const staticCard = chooser.querySelector('a[href^="family.html"]');
  const feature = (href, icon, hanzi, title, blurb, counts)=>{
    const a = document.createElement("a");
    a.className = "nav-card";
    a.href = href;
    a.innerHTML = `
      <div class="icon">${icon}</div>
      <span class="hanzi">${hanzi}</span>
      <h3>${title}</h3>
      <p>${blurb}</p>
      ${counts ? `<span class="card-counts">${counts}</span>` : ""}`;
    chooser.insertBefore(a, staticCard);
  };
  const kmTotal = (typeof JOURNEY !== "undefined" && JOURNEY.totalLabel) ? JOURNEY.totalLabel : "";
  const eraCount = (typeof TIMELINE !== "undefined") ? TIMELINE.eras.length : 0;
  feature("journey.html", "🧭", "旅程", "The Whole Trip",
    "The route draws itself right across China, then a timeline of every dynasty since the Qin. Britain does not come out of it well.",
    [kmTotal, eraCount ? `${eraCount} dynasties` : ""].filter(Boolean).join(" · "));
  const charCount = (typeof HANZI !== "undefined") ? HANZI.length : 0;
  feature("play.html", "🎮", "玩", "The Games Bit",
    "Learn to write actual Chinese, guess my zoomed-in photos, and fill a passport up as you go.",
    [charCount ? `${charCount} characters` : "", "Spot-It", "your passport"].filter(Boolean).join(" · "));
})();

/* ---------- Map page: pins + focus-shift popout ---------- */
(function(){
  const pinLayer = document.getElementById("pinLayer");
  if(!pinLayer || typeof LOCATIONS === "undefined") return;

  const detailPanel = document.getElementById("detailPanel");
  const williamToggle = document.getElementById("williamToggle");
  const mapCase = document.getElementById("mapCase");
  const locationOverlay = document.getElementById("locationOverlay");
  const locationBackdrop = document.getElementById("locationBackdrop");
  const locationCard = document.getElementById("locationCard");
  const locationClose = document.getElementById("locationClose");
  let currentLocation = null;

  TRIP_LOCATIONS.forEach(loc=>{
    const btn = document.createElement("button");
    btn.className = "pin";
    btn.style.left = loc.x + "%";
    btn.style.top = loc.y + "%";
    btn.style.animationDelay = (loc.num * 0.15) + "s";
    btn.dataset.id = loc.id;
    btn.title = loc.name;
    btn.textContent = loc.num;
    btn.addEventListener("click", ()=>showLocation(loc.id));
    pinLayer.appendChild(btn);
  });

  function showLocation(id){
    currentLocation = TRIP_LOCATIONS.find(l=>l.id===id);
    if(!currentLocation) return;
    document.querySelectorAll(".pin").forEach(p=>p.classList.toggle("active", p.dataset.id===id));
    renderPanel();
    mapCase.classList.add("dimmed");
    locationOverlay.classList.add("open");
    locationCard.scrollTop = 0;
  }
  function closeLocation(){
    mapCase.classList.remove("dimmed");
    locationOverlay.classList.remove("open");
    document.querySelectorAll(".pin").forEach(p=>p.classList.remove("active"));
  }
  locationClose.addEventListener("click", closeLocation);
  locationBackdrop.addEventListener("click", closeLocation);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && locationOverlay.classList.contains("open")) closeLocation(); });

  function renderPanel(){
    if(!currentLocation) return;
    const loc = currentLocation;
    const photos = PHOTOS.filter(p=>p.location===loc.id);
    const photosHtml = photos.length
      ? photos.map(p=>`
          <button class="photo-thumb" data-photo-index="${PHOTOS.indexOf(p)}">
            ${thumbMedia(p)}
            <div class="cap">${p.caption}</div>
          </button>
        `).join("")
      : `<div class="photo-empty">${EMPTY_STATE_LINES[loc.num % EMPTY_STATE_LINES.length]}</div>`;

    detailPanel.innerHTML = `
      <h2>${loc.num}. ${loc.name}</h2>
      <div class="chinese">${loc.chinese}</div>
      <div class="story">${loc.story}</div>
      ${(williamToggle.checked && loc.william) ? `<div class="william-box"><b>William, unimpressed, from the corner:</b><br>${loc.william}</div>` : ""}
      <div class="photo-grid">${photosHtml}</div>
    `;
    detailPanel.querySelectorAll(".photo-thumb").forEach(btn=>{
      btn.addEventListener("click", ()=> openPhoto(PHOTOS[parseInt(btn.dataset.photoIndex,10)]) );
    });
  }
  williamToggle.addEventListener("change", renderPanel);

  // Deep link support: map.html?loc=imperial-garden opens straight to that popout.
  // Validated against the current trip, so a mismatched ?trip=/?loc= pair is ignored
  // rather than half-opening a popout for a pin that isn't on this map.
  const params = new URLSearchParams(location.search);
  const deepLoc = params.get("loc");
  if(deepLoc && TRIP_LOCATIONS.some(l=>l.id===deepLoc)){
    showLocation(deepLoc);
  }
})();

/* ---------- Gallery page: every photo, filterable by location ---------- */
(function(){
  const galleryGrid = document.getElementById("galleryGrid");
  if(!galleryGrid || typeof PHOTOS === "undefined") return;

  const tripPhotos = CURRENT_TRIP ? PHOTOS.filter(p=>p.trip===CURRENT_TRIP.id) : PHOTOS;

  function renderGallery(filterLoc){
    const items = filterLoc ? tripPhotos.filter(p=>p.location===filterLoc) : tripPhotos;
    galleryGrid.innerHTML = items.map(p=>{
      const loc = TRIP_LOCATIONS.find(l=>l.id===p.location);
      return `
        <button class="photo-thumb gallery-item" data-photo-id="${p.id}">
          ${thumbMedia(p)}
          <div class="cap">${loc ? loc.num + '. ' + loc.name : ''}</div>
        </button>
      `;
    }).join("");
    galleryGrid.querySelectorAll(".gallery-item").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const photo = PHOTOS.find(p=>p.id===btn.dataset.photoId);
        if(photo) openPhoto(photo);
      });
    });
  }
  renderGallery(null);

  const filterBar = document.getElementById("galleryFilter");
  if(filterBar){
    function setActive(target){
      filterBar.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
      target.classList.add("active");
    }
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.className = "active";
    allBtn.addEventListener("click", ()=>{ setActive(allBtn); renderGallery(null); });
    filterBar.appendChild(allBtn);

    const locsUsed = [...new Set(tripPhotos.map(p=>p.location))]
      .map(id=>TRIP_LOCATIONS.find(l=>l.id===id))
      .filter(Boolean)
      .sort((a,b)=>a.num-b.num);
    locsUsed.forEach(loc=>{
      const btn = document.createElement("button");
      btn.textContent = `${loc.num}. ${loc.name}`;
      btn.addEventListener("click", ()=>{ setActive(btn); renderGallery(loc.id); });
      filterBar.appendChild(btn);
    });
  }
})();

/* ---------- The Journey (journey page) ----------
   The route map draws itself as the leg cards scroll past. Path lengths
   are measured at runtime, never hardcoded; day-trip legs are out-and-back
   spurs whose next leg starts from the same base city. Cards are injected
   here, so their trip links must carry ?trip= themselves — the rewrite
   pass has already run. Under reduced motion (or no IntersectionObserver)
   the whole route renders drawn with the final total showing. */
(function(){
  const stage = document.getElementById("journeyStage");
  if(!stage || typeof JOURNEY === "undefined" || !JOURNEY.stops.length) return;
  const svg = document.getElementById("routeMap");
  const legsBox = document.getElementById("journeyLegs");
  const distEl = document.getElementById("distanceNow");
  if(!svg || !legsBox || !distEl) return;

  const tripOf = id => (typeof TRIPS !== "undefined" && TRIPS.find(t => t.id === id)) || null;

  const legPaths = [...svg.querySelectorAll(".route-leg")]
    .sort((a, b) => Number(a.dataset.leg) - Number(b.dataset.leg));
  legPaths.forEach(p=>{
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });

  const stopMarks = [...svg.querySelectorAll(".route-stop")];
  const markOf = trip => stopMarks.find(s => s.dataset.stop === trip);

  const cum = [0];
  JOURNEY.legs.forEach(l => cum.push(cum[cum.length - 1] + l.km));

  function card(leg, html){
    const el = document.createElement("article");
    el.className = "leg-card";
    el.dataset.leg = String(leg);
    el.innerHTML = html;
    legsBox.appendChild(el);
  }

  const startTrip = tripOf(JOURNEY.stops[0].trip);
  card(0, `
    <span class="leg-badge">The start</span>
    <h3>${JOURNEY.stops[0].label} ${startTrip ? startTrip.icon : ""}</h3>
    <p>${JOURNEY.start}</p>
    <a class="leg-link" href="story.html?trip=${JOURNEY.stops[0].trip}">Read the ${startTrip ? startTrip.name : ""} story →</a>`);

  JOURNEY.legs.forEach((leg, i)=>{
    const from = JOURNEY.stops.find(s => s.trip === leg.from);
    const to = JOURNEY.stops[i + 1];
    const trip = tripOf(leg.to);
    card(i + 1, `
      <span class="leg-badge">${leg.day ? "Day trip" : `Leg ${i + 1}`}</span>
      <h3>${from.label} ${leg.day ? "⇄" : "→"} ${to.label} ${trip ? trip.icon : ""}</h3>
      <span class="leg-km">${leg.distanceLabel} — ${leg.compare}</span>
      <p>${leg.blurb}</p>
      <a class="leg-link" href="story.html?trip=${leg.to}">Read the ${trip ? trip.name : ""} story →</a>`);
  });

  card(JOURNEY.legs.length, `
    <span class="leg-badge">The whole thing</span>
    <h3>${JOURNEY.totalLabel}</h3>
    <p>${JOURNEY.end}</p>
    <a class="leg-link" href="play.html?trip=${CURRENT_TRIP ? CURRENT_TRIP.id : ""}">Earned a go on The Games Bit →</a>`);

  let high = -1;
  function setDistance(n){
    const target = cum[Math.min(n, cum.length - 1)];
    const from = Number(distEl.dataset.v || 0);
    distEl.dataset.v = String(target);
    if(REDUCED_MOTION || from === target){
      distEl.textContent = target.toLocaleString("en-GB");
      return;
    }
    const t0 = performance.now();
    (function tick(now){
      const t = Math.min(1, ((now || performance.now()) - t0) / 700);
      const eased = 1 - Math.pow(1 - t, 3);
      distEl.textContent = Math.round(from + (target - from) * eased).toLocaleString("en-GB");
      if(t < 1) requestAnimationFrame(tick);
    })();
  }

  function activate(n){
    if(n <= high) return;
    high = n;
    for(let k = 1; k <= n && k <= legPaths.length; k++)
      legPaths[k - 1].style.strokeDashoffset = 0;
    JOURNEY.stops.slice(0, n + 1).forEach(s=>{
      const mark = markOf(s.trip);
      if(mark) mark.classList.add("in");
    });
    setDistance(n);
  }

  activate(0);
  if(REDUCED_MOTION || !("IntersectionObserver" in window)){
    activate(JOURNEY.legs.length);
  } else {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) activate(Number(e.target.dataset.leg));
      });
    }, {threshold: 0.4});
    legsBox.querySelectorAll(".leg-card").forEach(c => obs.observe(c));
  }

  document.getElementById("journey").hidden = false;
})();

/* ---------- Dynasty timeline (journey page) ----------
   A horizontally scrolling ribbon of era blocks with the trip-relevant
   events pinned inside their dynasty. Events render inside their era
   rather than being absolutely positioned, so nothing can overlap at any
   viewport. Native overflow scrolling keeps it keyboard- and
   touch-accessible with no motion to guard. */
(function(){
  const ribbon = document.getElementById("timelineRibbon");
  if(!ribbon || typeof TIMELINE === "undefined" || !TIMELINE.eras.length) return;

  const tones = ["teal", "coral", "jade", "deep"];
  const fmtY = y => y < 0 ? `${-y} BC` : String(y);

  const scroll = document.createElement("div");
  scroll.className = "timeline-scroll";
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "region");
  scroll.setAttribute("aria-label", "Timeline of Chinese dynasties, scrolls sideways");
  const track = document.createElement("div");
  track.className = "timeline-track";

  TIMELINE.eras.forEach((era, i)=>{
    const years = era.to - era.from;
    const block = document.createElement("section");
    block.className = "era-block";
    block.dataset.enamel = tones[i % tones.length];
    /* Width leans on duration without being proportional — a straight
       scale would make the Qin unreadably thin next to the Han. */
    block.style.minWidth = Math.round(Math.min(320, 110 + years / 5)) + "px";
    const evs = TIMELINE.events
      .filter(e => e.year >= era.from && e.year < era.to)
      .sort((a, b) => a.year - b.year);
    block.innerHTML = `
      <header class="era-head">
        ${era.hanzi ? `<span class="era-hanzi">${era.hanzi}</span>` : ""}
        <h3>${era.name}</h3>
        <span class="era-years">${fmtY(era.from)} – ${fmtY(era.to)}</span>
      </header>
      ${evs.map(e=>{
        const trip = (typeof TRIPS !== "undefined" && TRIPS.find(t => t.id === e.trip)) || null;
        return `<article class="tl-event">
          <span class="tl-year">${e.approx ? "roughly " : ""}${fmtY(e.year)}</span>
          <p class="tl-china">${trip ? trip.icon + " " : ""}${e.china}</p>
          <p class="tl-britain"><b>Meanwhile in Britain:</b> ${e.britain}</p>
          ${trip ? `<a class="tl-link" href="story.html?trip=${trip.id}">${trip.name} →</a>` : ""}
        </article>`;
      }).join("")}`;
    track.appendChild(block);
  });

  if(TIMELINE.today){
    const cap = document.createElement("div");
    cap.className = "tl-today";
    cap.innerHTML = `<span class="era-hanzi">今</span><p>${TIMELINE.today}</p>`;
    track.appendChild(cap);
  }

  scroll.appendChild(track);
  ribbon.appendChild(scroll);
  document.getElementById("timeline").hidden = false;
})();

/* ---------- Then & Now (story page) ----------
   A historic photograph and one of the family's, stacked in one frame;
   an invisible full-frame range input drives the divider, which keeps the
   whole thing keyboard- and touch-accessible for free. The "now" image
   sits on top clipped from the left, so slider right = more now.
   Attribution renders under every frame — public domain still gets
   credited, and a credited "now" photo keeps its credit too. */
(function(){
  const grid = document.getElementById("thenNowGrid");
  if(!grid || typeof THEN_NOW === "undefined" || !CURRENT_TRIP) return;
  const pairs = (THEN_NOW.pairs || []).filter(p => p.trip === CURRENT_TRIP.id);
  if(!pairs.length) return;

  const sub = document.getElementById("thenNowSub");
  if(sub && THEN_NOW.sub) sub.textContent = THEN_NOW.sub;

  const creditLine = (label, c, extra) => c
    ? `${label}: <a href="${c.sourceUrl || c.licenseUrl}">${c.author}</a>${extra ? ", " + extra : ""} (${c.license})`
    : `${label}: one of ours`;

  pairs.forEach(pair=>{
    const nowPhoto = (typeof PHOTOS !== "undefined") && PHOTOS.find(p => p.id === pair.now);
    if(!nowPhoto) return;
    const fig = document.createElement("figure");
    fig.className = "thennow-frame";
    fig.innerHTML = `
      <div class="tn-stage" style="aspect-ratio:${pair.aspect}">
        <img class="tn-then" src="Photographs/${pair.then.file}" alt="${pair.title} in ${pair.then.year}">
        <div class="tn-nowclip"><img class="tn-now" src="${photoSrc(nowPhoto)}" alt="${nowPhoto.caption}"></div>
        <div class="tn-handle" aria-hidden="true"><span>⇄</span></div>
        <span class="tn-tab tn-tab-then" aria-hidden="true">THEN · ${pair.then.year}</span>
        <span class="tn-tab tn-tab-now" aria-hidden="true">NOW · 2026</span>
        <input type="range" class="tn-range" min="0" max="100" value="50"
               aria-label="Compare ${pair.title}: slide right for today, left for ${pair.then.year}">
      </div>
      <figcaption>
        <p class="tn-blurb">${pair.blurb}</p>
        <p class="tn-credit">${creditLine("Then", pair.then.credit, pair.then.year)} ·
          ${creditLine("Now", nowPhoto.credit)}</p>
      </figcaption>`;
    const range = fig.querySelector(".tn-range");
    const clip = fig.querySelector(".tn-nowclip");
    const handle = fig.querySelector(".tn-handle");
    const set = () => {
      const p = Number(range.value);
      clip.style.clipPath = `inset(0 0 0 ${p}%)`;
      handle.style.left = p + "%";
    };
    range.addEventListener("input", set);
    set();
    grid.appendChild(fig);
  });

  if(grid.children.length){
    document.getElementById("thenNow").hidden = false;
    addHeroJump("#thenNow", "🕰️ Then & Now ↓");
  }
})();

/* ---------- Hanzi playground (play page) ----------
   Vendored HanziWriter drives the stroke box; per-character data lives in
   assets/vendor/hanzi-data/<hex>.js wrapped as plain scripts so the page
   works on file:// with no fetch/CORS. Under reduced motion the character
   renders completed instead of autoplaying strokes; the tracing quiz is
   user-driven so it stays. The 🔊 button only appears if the browser
   actually has a Chinese voice. */
(function(){
  const grid = document.getElementById("hanziGrid");
  const stage = document.getElementById("hanziStage");
  if(!grid || !stage || typeof HANZI_PACKS === "undefined" || !HANZI_PACKS.length) return;
  if(typeof HanziWriter === "undefined") return;

  const hex = ch => ch.codePointAt(0).toString(16);
  function charDataLoader(char, onLoad, onError){
    if(window.HANZI_DATA && HANZI_DATA[char]) return onLoad(HANZI_DATA[char]);
    const s = document.createElement("script");
    s.src = `assets/vendor/hanzi-data/${hex(char)}.js`;
    s.onload = () => (window.HANZI_DATA && HANZI_DATA[char])
      ? onLoad(HANZI_DATA[char])
      : onError(new Error("no data for " + char));
    s.onerror = onError;
    document.head.appendChild(s);
  }

  const tones = ["teal", "coral", "jade", "deep"];
  const traced = () => store.get("hanzi", {}) || {};
  let currentBtn = null;

  /* Packs unlock in order: tracing NEED characters of a pack opens the
     next one. The next locked pack shows as a teaser with its countdown;
     anything further shows name-only, so the road ahead is visible
     without spoiling it. */
  const NEED = 10;
  const tracedIn = pack => {
    const t = traced();
    return pack.chars.filter(h => t[h.char]).length;
  };
  const needFor = pack => Math.min(NEED, pack.chars.length);
  function unlockedCount(){
    let n = 1;
    while(n < HANZI_PACKS.length && tracedIn(HANZI_PACKS[n - 1]) >= needFor(HANZI_PACKS[n - 1])) n++;
    return n;
  }

  const sub = document.getElementById("hanziSub");
  if(sub) sub.textContent =
    `${HANZI.length} characters in ${HANZI_PACKS.length} packs, unlocking as you trace. Start with our trip names and see how far you get.`;

  function renderGrid(){
    grid.innerHTML = "";
    const open = unlockedCount();
    HANZI_PACKS.forEach((pack, pi)=>{
      const head = document.createElement("div");
      const done = tracedIn(pack);
      if(pi < open){
        head.className = "hanzi-pack-head";
        head.innerHTML = `
          <span class="hanzi-pack-hanzi">${pack.hanzi}</span>
          <div class="hanzi-pack-text"><h3>${pack.name}</h3><p>${pack.blurb}</p></div>
          <span class="hanzi-pack-progress">${done} / ${pack.chars.length}</span>`;
        grid.appendChild(head);
        const row = document.createElement("div");
        row.className = "hanzi-pack-grid";
        pack.chars.forEach((h, i)=>{
          const b = document.createElement("button");
          b.type = "button";
          b.className = "hanzi-tile";
          b.dataset.enamel = tones[i % tones.length];
          b.dataset.char = h.char;
          b.innerHTML = `
            <span class="hanzi-glyph">${h.char}</span>
            <span class="hanzi-pinyin">${h.pinyin}</span>
            <span class="hanzi-mean">${h.meaning}</span>
            ${traced()[h.char] ? `<span class="hanzi-done" title="Traced">✓</span>` : ""}`;
          b.addEventListener("click", ()=> select(h, b));
          row.appendChild(b);
        });
        grid.appendChild(row);
        if(done === pack.chars.length){
          const full = document.createElement("p");
          full.className = "hanzi-pack-complete";
          full.textContent = `That's all of ${pack.name}. Every stroke, all you.`;
          grid.appendChild(full);
        }
      } else if(pi === open){
        const prev = HANZI_PACKS[pi - 1];
        const more = needFor(prev) - tracedIn(prev);
        head.className = "hanzi-pack-head locked";
        head.innerHTML = `
          <span class="hanzi-pack-hanzi">🔒</span>
          <div class="hanzi-pack-text"><h3>${pack.name}</h3><p>${pack.blurb}</p></div>
          <span class="hanzi-pack-progress">${more} more from ${prev.name} and this one's yours.</span>`;
        grid.appendChild(head);
      } else {
        head.className = "hanzi-pack-head locked far";
        head.innerHTML = `
          <span class="hanzi-pack-hanzi">🔒</span>
          <div class="hanzi-pack-text"><h3>${pack.name}</h3></div>`;
        grid.appendChild(head);
      }
    });
  }
  renderGrid();

  function select(h, btn){
    if(currentBtn) currentBtn.classList.remove("active");
    currentBtn = btn;
    btn.classList.add("active");
    stage.hidden = false;
    stage.innerHTML = `
      <div class="hanzi-box"></div>
      <div class="hanzi-side">
        <h3 class="hanzi-word"><span class="hanzi-glyphword">${h.char}</span> ${h.pinyin} — ${h.meaning}</h3>
        <p class="hanzi-wordline">As in <b class="hanzi-glyphword">${h.word}</b>, ${h.wordMeaning}.</p>
        <div class="hanzi-actions">
          <button type="button" class="hanzi-btn" data-act="watch">${REDUCED_MOTION ? "Show it done" : "▶ Watch the strokes"}</button>
          <button type="button" class="hanzi-btn" data-act="trace">✍️ Trace it</button>
          <button type="button" class="hanzi-btn" data-act="speak" hidden>🔊 Say it</button>
        </div>
        <p class="hanzi-status" aria-live="polite"></p>
      </div>`;
    const writer = HanziWriter.create(stage.querySelector(".hanzi-box"), h.char, {
      width: 220, height: 220, padding: 12,
      charDataLoader,
      strokeColor: "#302217",
      outlineColor: "#E4D2AE",
      drawingColor: "#C93A2B",
      radicalColor: "#C93A2B",
      delayBetweenStrokes: 350,
      showCharacter: false
    });
    if(REDUCED_MOTION) writer.showCharacter();
    const status = stage.querySelector(".hanzi-status");
    stage.querySelector('[data-act="watch"]').addEventListener("click", ()=>{
      status.textContent = "";
      if(REDUCED_MOTION){ writer.showCharacter(); }
      else { writer.hideCharacter(); writer.animateCharacter(); }
    });
    stage.querySelector('[data-act="trace"]').addEventListener("click", ()=>{
      status.textContent = "Draw the strokes in the right order — it'll put you straight if you go wrong. There's a proper order, apparently, and it matters.";
      writer.quiz({
        onComplete: ()=>{
          const before = unlockedCount();
          SoundKit.fx("right");
          store.patch("hanzi", { [h.char]: true });
          status.textContent = `That's ${h.char} done. You just wrote actual Chinese.`;
          /* Progress counts and lock states live in the grid, so redraw
             it and re-mark the tile we're working from. */
          renderGrid();
          currentBtn = grid.querySelector(`[data-char="${h.char}"]`);
          if(currentBtn) currentBtn.classList.add("active");
          if(unlockedCount() > before){
            SoundKit.fx("stamp");
            status.textContent += " New pack unlocked below.";
          }
        }
      });
    });
    const speakBtn = stage.querySelector('[data-act="speak"]');
    SoundKit.hasZhVoice(ok=>{
      if(!ok) return;
      speakBtn.hidden = false;
      speakBtn.addEventListener("click", ()=> SoundKit.speak(h.word || h.char));
    });
    stage.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "nearest" });
  }

  document.getElementById("hanzi").hidden = false;
})();

/* ---------- Spot-It (play page) ----------
   A zoomed crop of a family photo (never credited/sourced ones, so no
   in-game attribution is owed) against four thumbnails. The crop is pure
   CSS background positioning computed per round — no per-photo data.
   Photos are referenced by id; nothing indexes into PHOTOS positionally.
   The zoom tightens as a streak grows and resets on a miss. */
(function(){
  const card = document.getElementById("spotCard");
  if(!card || typeof PHOTOS === "undefined") return;
  const pool = PHOTOS.filter(p => !p.credit && p.type !== "video");
  if(pool.length < 8) return;

  let streak = 0;
  let zoom = 340;
  const best = () => store.get("spotBest", 0);
  const MILESTONES = {
    3: "Three in a row. Alright, someone's warmed up.",
    5: "Five in a row. Okay, this is actually getting impressive.",
    10: "Ten in a row. That's expert level and I'll allow it."
  };

  function pick(n){
    const set = [], used = new Set();
    let guard = 200;
    while(set.length < n && guard--){
      const p = pool[Math.floor(Math.random() * pool.length)];
      if(!used.has(p.id)){ used.add(p.id); set.push(p); }
    }
    return set;
  }

  function round(){
    const four = pick(4);
    const it = four[Math.floor(Math.random() * four.length)];
    const posX = 15 + Math.random() * 70;
    const posY = 15 + Math.random() * 70;
    card.innerHTML = `
      <div class="spot-top">
        <span class="quiz-badge">Spot It</span>
        <span class="spot-streak">Streak <b>${streak}</b> · Best <b>${best()}</b></span>
      </div>
      <div class="spot-zoom" role="img"
           aria-label="A zoomed-in detail from one of the four photos below"
           style="background-image:url('${photoSrc(it)}');background-size:${zoom}%;background-position:${posX}% ${posY}%"></div>
      <p class="spot-q">Which photo is that from?</p>
      <div class="spot-choices">
        ${four.map(p => `
          <button type="button" class="spot-choice" data-id="${p.id}">
            <img src="${photoSrc(p)}" alt="${p.caption}" loading="lazy">
          </button>`).join("")}
      </div>
      <p class="spot-verdict" aria-live="polite"></p>`;
    const verdict = card.querySelector(".spot-verdict");
    const buttons = [...card.querySelectorAll(".spot-choice")];
    buttons.forEach(b => b.addEventListener("click", ()=>{
      const right = b.dataset.id === it.id;
      buttons.forEach(x=>{
        x.disabled = true;
        if(x.dataset.id === it.id) x.classList.add("correct");
        else if(x === b) x.classList.add("wrong");
      });
      let line;
      if(right){
        streak++;
        zoom = Math.min(500, zoom + 15);
        SoundKit.fx("right");
        line = MILESTONES[streak] || "Got it. You've clearly been paying attention.";
        if(streak > best()){
          store.set("spotBest", streak);
          line += " New personal best. Write that down somewhere, this is history.";
        }
      } else {
        streak = 0;
        zoom = 340;
        SoundKit.fx("wrong");
        line = "Nope — it was that one. To be fair, I zoomed in really far.";
      }
      verdict.textContent = line;
      const next = document.createElement("button");
      next.type = "button";
      next.className = "quiz-next";
      next.textContent = "Next one →";
      next.addEventListener("click", round);
      verdict.after(next);
      next.focus();
    }));
  }

  round();
  document.getElementById("spotit").hidden = false;
})();

/* ---------- Scale-o-matic (story page) ----------
   Verified trip numbers translated into the reader's world. Cards are
   declarative data (COMPARATORS in extras.js — no functions, check.mjs
   evaluates that file); the three ops live here. Inputs persist in the
   shared store under one key each, so "your height" typed on one trip is
   already filled in on the next. */
(function(){
  const grid = document.getElementById("scaleGrid");
  if(!grid || typeof COMPARATORS === "undefined" || !CURRENT_TRIP) return;
  const list = COMPARATORS[CURRENT_TRIP.id];
  if(!list || !list.length) return;

  const sub = document.getElementById("scaleSub");
  if(sub && COMPARATORS.sub) sub.textContent = COMPARATORS.sub;

  const fmt = n => !isFinite(n) ? "—"
    : n >= 20 ? Math.round(n).toLocaleString("en-GB")
    : (Math.round(n * 10) / 10).toLocaleString("en-GB");
  const compute = (c, v) =>
    c.op === "inverse"   ? v / c.unitValue :
    c.op === "plusYears" ? Math.round(v + c.unitValue / 365.25) :
                           c.unitValue / v;

  list.forEach(c=>{
    const el = document.createElement("article");
    el.className = "scale-card";
    const saved = (store.get("inputs", {}) || {})[c.input.key];
    const v0 = (saved !== undefined) ? saved : c.input.def;
    el.innerHTML = `
      <h3>${c.title}</h3>
      <label class="scale-label">${c.input.label}
        <input class="scale-input" type="number" inputmode="decimal"
               value="${v0}" min="${c.input.min}" max="${c.input.max}" step="${c.input.step}">
      </label>
      <p class="scale-line" aria-live="polite"></p>
      <p class="scale-src">${c.unitLabel}</p>`;
    const input = el.querySelector(".scale-input");
    const line = el.querySelector(".scale-line");
    const render = ()=>{
      const v = Number(input.value);
      if(!v || v <= 0){ line.textContent = "Type a number and I'll do the maths."; return; }
      line.innerHTML = c.line
        .replace("{n}", `<b>${fmt(compute(c, v))}</b>`)
        .replace("{v}", String(v));
      store.patch("inputs", { [c.input.key]: v });
    };
    input.addEventListener("input", render);
    render();
    grid.appendChild(el);
  });

  document.getElementById("scale").hidden = false;
  addHeroJump("#scale", "📏 The Scale-o-matic ↓");
})();

/* ---------- Passport: visit stamps ----------
   A trip counts as visited once the reader has been on any of its
   trip-scoped pages. Index, family, journey and play are trip-agnostic —
   landing there says nothing about which trip you explored, so they
   don't stamp. */
(function(){
  if(!CURRENT_TRIP) return;
  const here = location.pathname.split("/").pop() || "index.html";
  if(!/^(story|map|gallery)\.html$/.test(here)) return;
  store.patch("visited", { [CURRENT_TRIP.id]: true });
})();

/* ---------- Maisie's Passport (play page) ----------
   Renders whatever the store holds: per-trip ARRIVED stamps and quiz
   bests, plus a totals page. Degrades politely when localStorage is
   blocked — the probe write tells us whether stamps will survive. */
(function(){
  const book = document.getElementById("passportBook");
  if(!book || typeof TRIPS === "undefined") return;

  let canSave = true;
  try {
    localStorage.setItem("china2026:probe", "1");
    localStorage.removeItem("china2026:probe");
  } catch(e){ canSave = false; }

  const visited = store.get("visited", {}) || {};
  const quizBest = store.get("quizBest", {}) || {};
  const hanziDone = Object.keys(store.get("hanzi", {}) || {}).length;
  const spotBest = store.get("spotBest", 0);
  const cats = Object.keys(store.get("cats", {}) || {}).length;
  const anything = Object.keys(visited).length || Object.keys(quizBest).length
    || hanziDone || spotBest || cats;

  const note = txt => {
    const p = document.createElement("p");
    p.className = "passport-note";
    p.textContent = txt;
    book.appendChild(p);
  };
  if(!canSave) note("Your browser isn't saving anything right now (private mode, probably), so these stamps will vanish when you leave. Enjoy them while they last.");
  if(!anything) note("Nothing in here yet. Go explore the site — the stamps sort themselves out.");

  TRIPS.forEach(t=>{
    const page = document.createElement("article");
    page.className = "passport-page";
    const stars = quizBest[t.id];
    page.innerHTML = `
      <div class="pp-head">
        <span class="pp-icon">${t.icon}</span>
        <div><h3>${t.name}</h3><span class="pp-hanzi">${t.chinese}</span></div>
      </div>
      <div class="pp-rows">
        <span class="pp-row">${visited[t.id]
          ? "Pages explored"
          : `<a class="pp-go" href="story.html?trip=${t.id}">You haven't been here yet →</a>`}</span>
        <span class="pp-row">${stars
          ? `Quiz best: ${"⭐".repeat(stars)}`
          : `<a class="pp-go" href="story.html?trip=${t.id}#quiz">Quiz not conquered yet →</a>`}</span>
      </div>
      ${visited[t.id] ? `<span class="pp-stamp stamp-in"><b class="pp-stamp-hanzi">到</b> ARRIVED</span>` : ""}`;
    book.appendChild(page);
  });

  const summary = document.createElement("article");
  summary.className = "passport-page pp-summary";
  summary.innerHTML = `
    <div class="pp-head">
      <span class="pp-icon">🧳</span>
      <div><h3>The Totals</h3><span class="pp-hanzi">合计</span></div>
    </div>
    <p class="pp-caption">Everything you've done on this site, all totted up in one place.</p>
    <div class="pp-rows">
      <span class="pp-row">Characters traced: <b>${hanziDone}</b> of ${typeof HANZI !== "undefined" ? HANZI.length : "?"}</span>
      <span class="pp-row">Spot-It best streak: <b>${spotBest}</b></span>
      <span class="pp-row">Secrets found: <b>${cats}</b> of ${typeof CATS !== "undefined" && CATS.length ? CATS.length : 7}</span>
    </div>
    <p class="pp-tease">Something small is hiding on every single page of this site. Find all seven and something good happens. Not saying what.</p>`;
  book.appendChild(summary);

  document.getElementById("passport").hidden = false;
})();

/* ---------- Hidden cats (every page) ----------
   One small sticker cat per page, tucked into a corner of its anchor.
   Inline DOM SVG (no data-URI, so no %23 escaping applies). Found cats
   stay visible at low opacity so a revisit isn't confusing. Finding all
   of them unlocks the Palace Cats bonus panel on play.html. */
(function(){
  if(typeof CATS === "undefined" || !CATS.length) return;
  const here = location.pathname.split("/").pop() || "index.html";
  const cat = CATS.find(c => c.page === here);

  const found = () => store.get("cats", {}) || {};
  const allFound = () => CATS.every(c => found()[c.id]);

  const POSES = {
    sit: `<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      <path d="M13 34 C7 34 5 28 6.5 23 C7.5 19 10 16.5 12 15.5 L10.5 8 L16 12 C17.5 11.6 19.5 11.6 21 12 L26.5 8 L25 15.5 C27 16.5 29.5 19 30.5 23 C32 28 30 34 24 34 Z"
        fill="#F0A421" stroke="#302217" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 30 C34 29 36 25 34.5 21" fill="none" stroke="#302217" stroke-width="2" stroke-linecap="round"/>
      <circle cx="15.5" cy="20" r="1.3" fill="#302217"/>
      <circle cx="22.5" cy="20" r="1.3" fill="#302217"/>
      <path d="M17.5 24 Q19 25.5 20.5 24" fill="none" stroke="#302217" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    loaf: `<svg viewBox="0 0 44 34" width="36" height="28" aria-hidden="true">
      <path d="M8 28 C3 28 2 22 5 19 C4 13 8 9 13 9 L11.5 3.5 L16.5 7 C18 6.6 20 6.6 21.5 7 L26.5 3.5 L25 9 C33 9 40 14 41 20 C42 25 39 28 34 28 Z"
        fill="#F0A421" stroke="#302217" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="14.5" cy="15" r="1.3" fill="#302217"/>
      <circle cx="21.5" cy="15" r="1.3" fill="#302217"/>
      <path d="M16.5 19 Q18 20.5 19.5 19" fill="none" stroke="#302217" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`
  };

  function toast(msg){
    let el = document.getElementById("toast");
    if(!el){
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.classList.remove("show"), 4500);
  }

  if(cat){
    const anchor = document.querySelector(cat.anchor);
    if(anchor){
      if(getComputedStyle(anchor).position === "static") anchor.style.position = "relative";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cat-sticker cat-${cat.corner}`;
      btn.setAttribute("aria-label", "A small cat. Suspicious.");
      btn.innerHTML = POSES[cat.pose] || POSES.sit;
      if(found()[cat.id]) btn.classList.add("found");
      btn.addEventListener("click", ()=>{
        const already = found()[cat.id];
        store.patch("cats", { [cat.id]: true });
        btn.classList.add("found");
        SoundKit.fx("cat");
        if(already){
          toast("Already found this one. It remembers you.");
        } else {
          const total = Object.keys(found()).length;
          toast(allFound()
            ? cat.line + " That's all seven — the games page has something for you."
            : cat.line + ` (${total} of ${CATS.length})`);
        }
      });
      anchor.appendChild(btn);
    }
  }

  /* The bonus panel, play.html only. */
  const bonus = document.getElementById("catBonus");
  if(bonus && typeof CAT_BONUS !== "undefined" && allFound()){
    bonus.innerHTML = `
      <div class="section-head reveal">
        <h2 class="section-title">${CAT_BONUS.heading} <span class="pp-hanzi">${CAT_BONUS.hanzi || ""}</span></h2>
        <p class="section-sub">${CAT_BONUS.intro}</p>
      </div>
      <div class="catfacts reveal">
        ${CAT_BONUS.facts.map((f, i)=>`
          <article class="catfact" data-enamel="${["teal","coral","jade","deep"][i % 4]}">
            <span class="catfact-index">🐈 ${i + 1}</span>
            <p>${f}</p>
          </article>`).join("")}
      </div>
      <div class="cat-cert-row reveal">
        <button type="button" class="quiz-sticker" id="certBtn">🖨️ Print my Cat-Finder Certificate</button>
      </div>`;
    bonus.hidden = false;
    document.getElementById("certBtn").addEventListener("click", ()=>{
      if(!document.getElementById("certPrint")){
        const cert = document.createElement("div");
        cert.id = "certPrint";
        cert.className = "cert-print";
        cert.innerHTML = `
          <div class="cert-inner">
            <div class="cert-seal">中</div>
            <h1>${CAT_BONUS.certificateHeading}</h1>
            <p>${CAT_BONUS.certificateBody}</p>
            <p class="cert-foot">China 2026 · pbranfield-lab.github.io/china-2026</p>
          </div>`;
        document.body.appendChild(cert);
      }
      window.print();
    });
  }
})();

/* ---------- Home page: "Did you know?" teaser ----------
   One random fact from any trip, straight under the hero, with a dice button
   to shuffle — the hook that pulls a visitor from the front door into a trip.
   The "all N facts" link names the fact's own trip explicitly, so the
   link-rewrite pass (which only fills in missing trip params) leaves it be. */
(function(){
  const card = document.getElementById("teaserCard");
  if(!card || typeof FACTS === "undefined" || typeof TRIPS === "undefined") return;
  const pool = [];
  TRIPS.forEach(t=>(FACTS[t.id] || []).forEach(f=>pool.push({trip:t, fact:f})));
  if(!pool.length) return;

  let last = -1;
  function draw(){
    let i;
    do { i = Math.floor(Math.random() * pool.length); } while(pool.length > 1 && i === last);
    last = i;
    const {trip, fact} = pool[i];
    card.innerHTML = `
      <span class="teaser-badge">Did you know?</span>
      <div class="teaser-stat">${fact.stat}</div>
      <div class="teaser-label">${fact.label}</div>
      <p class="teaser-text">${fact.text}</p>
      <div class="teaser-foot">
        <span class="teaser-trip">${trip.icon} ${trip.name}</span>
        <button class="teaser-again" type="button">🎲 Another one</button>
        <a class="teaser-more" href="story.html?trip=${trip.id}#facts">All ${(FACTS[trip.id] || []).length}, plus the quiz →</a>
      </div>`;
    card.querySelector(".teaser-again").addEventListener("click", draw);
  }
  draw();
  document.getElementById("teaser").hidden = false;
})();

/* ---------- The Big Quiz (story page) ----------
   Built from the same FACTS the tiles show, so there is no second copy of the
   truth to drift. Only facts whose stat is a single leading number can be
   quizzed — a numeric answer needs numeric decoys, so "east", "rice" and
   ranges like "7–8 m" sit out. Decoys are scaled (or, for years, shifted) and
   then formatted to match the real stat's commas/decimals/suffix, so the odd
   one out never gives itself away by its shape. */
(function(){
  const card = document.getElementById("quizCard");
  if(!card || typeof FACTS === "undefined" || !CURRENT_TRIP) return;

  const eligible = (FACTS[CURRENT_TRIP.id] || []).map(fact=>{
    const m = /^([~≈]?)([\d,]+(?:\.\d+)?)([^\d]*)$/.exec(fact.stat);
    if(!m) return null;
    const value = parseFloat(m[2].replace(/,/g, ""));
    if(Number.isNaN(value)) return null;
    const dec = m[2].includes(".");
    const year = Number.isInteger(value) && value >= 1000 && value <= 2100 && !m[1] && !m[3].trim();
    const fmt = n=>{
      let s = dec ? n.toFixed(1) : String(Math.round(n));
      if(m[2].includes(",")) s = Number(s).toLocaleString("en-GB", {minimumFractionDigits: dec ? 1 : 0});
      return m[1] + s + m[3];
    };
    return {fact, value, year, fmt};
  }).filter(Boolean);
  if(eligible.length < 4) return;   // not enough to quiz on; section stays hidden

  const shuffle = arr=>{
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  function decoys(q){
    const seen = new Set([q.value]);
    const out = [];
    let guard = 40;
    while(out.length < 2 && guard--){
      let v;
      if(q.year){
        v = q.value + (Math.random() < .5 ? -1 : 1) * (12 + Math.floor(Math.random() * 120));
        if(v > 2025) v = q.value - (12 + Math.floor(Math.random() * 120));
      } else if(q.value === 0){
        /* Nothing scales off zero, so borrow a couple of confidently wrong
           numbers — one cheeky, one enormous. */
        v = [7, 12, 88, 350, 1200, 9999][Math.floor(Math.random() * 6)];
      } else {
        const f = [0.25, 0.4, 0.6, 1.5, 2.5, 4][Math.floor(Math.random() * 6)];
        v = q.value * f;
        v = q.value >= 100 ? Math.round(v / 10) * 10 : (Math.round(v * 10) / 10);
      }
      if(!seen.has(v) && v >= 0){ seen.add(v); out.push(v); }
    }
    return out;
  }

  const RIGHT = [
    "YES. Nailed it.",
    "Correct. I'm impressed, and I don't impress easily.",
    "Right! Somebody's been paying attention.",
    "Correct — as verified by me, personally."
  ];
  const WRONG = [
    "Nope! The real answer is even better:",
    "Not quite — brace yourself:",
    "Wrong, but honestly the truth is weirder:",
    "No — and this is the bit I didn't believe either:"
  ];

  /* Solo keeps the original five questions; two-player wants an even count
     so both players face the same number, alternating question by question. */
  let quiz, idx, players, scores;
  const cur = () => idx % players;

  function intro(){
    card.innerHTML = `
      <div class="quiz-top"><span class="quiz-badge">The Big Quiz</span></div>
      <h3 class="quiz-q">How many of you are there, then?</h3>
      <p class="quiz-mode-sub">Two player is pass-the-phone — you get a question, then you hand it over. No peeking.</p>
      <div class="quiz-choices quiz-mode">
        <button class="quiz-choice" type="button" data-players="1">Just me</button>
        <button class="quiz-choice" type="button" data-players="2">Two of us</button>
      </div>`;
    card.querySelectorAll("[data-players]").forEach(b=>
      b.addEventListener("click", ()=> start(Number(b.dataset.players))));
  }

  function start(n){
    players = n || 1;
    const want = players === 2 ? 6 : 5;
    const cap = players === 2 ? eligible.length - (eligible.length % 2) : eligible.length;
    quiz = shuffle([...eligible]).slice(0, Math.min(want, cap)).map(q=>{
      const choices = shuffle([
        {text: q.fact.stat, right: true},
        ...decoys(q).map(v=>({text: q.fmt(v), right: false}))
      ]);
      return {...q, choices};
    });
    idx = 0; scores = Array(players).fill(0);
    ask();
  }

  function ask(){
    const q = quiz[idx];
    card.innerHTML = `
      <div class="quiz-top">
        <span class="quiz-badge">Question ${idx + 1} of ${quiz.length}</span>
        ${players === 2 ? `<span class="quiz-player" data-p="${cur() + 1}">Player ${cur() + 1}, your go</span>` : ""}
        <span class="quiz-score" aria-label="Score">${"⭐".repeat(scores[cur()]) || "☆"}</span>
      </div>
      <h3 class="quiz-q">${q.fact.q || `Guess the ${q.year ? "year" : "number"}: <em>${q.fact.label}</em>`}</h3>
      <div class="quiz-choices">
        ${q.choices.map((c, i)=>`<button class="quiz-choice" type="button" data-i="${i}">${c.text}</button>`).join("")}
      </div>
      <div class="quiz-after" hidden>
        <p class="quiz-verdict"></p>
        <div class="quiz-explain">${q.fact.text}</div>
        <button class="quiz-next" type="button">${idx + 1 === quiz.length ? "Show me my score →" : "Next question →"}</button>
      </div>`;

    const buttons = [...card.querySelectorAll(".quiz-choice")];
    buttons.forEach(btn=>btn.addEventListener("click", ()=>{
      const pick = q.choices[Number(btn.dataset.i)];
      buttons.forEach(b=>{
        b.disabled = true;
        if(q.choices[Number(b.dataset.i)].right) b.classList.add("correct");
        else if(b === btn) b.classList.add("wrong");
      });
      if(pick.right) scores[cur()]++;
      SoundKit.fx(pick.right ? "right" : "wrong");
      const verdictPool = pick.right ? RIGHT : WRONG;
      card.querySelector(".quiz-verdict").textContent =
        (pick.right ? "✅ " : "❌ ") + verdictPool[Math.floor(Math.random() * verdictPool.length)];
      card.querySelector(".quiz-score").textContent = "⭐".repeat(scores[cur()]) || "☆";
      const after = card.querySelector(".quiz-after");
      after.hidden = false;
      after.querySelector(".quiz-next").focus();
    }));
    card.querySelector(".quiz-next").addEventListener("click", ()=>{
      idx++;
      if(idx < quiz.length) ask(); else finish();
    });
  }

  function verdict(s, n){
    if(s === n) return "Full marks. You may now call yourself an expert. I'll allow it.";
    if(s >= n * .6) return "Very solid. A couple more goes and you'll be nearly as good as me.";
    if(s >= n * .4) return "Hmm. Did you read my facts, or just admire the pictures?";
    return "That was William-level effort. Scroll up, read my facts, come back.";
  }

  function duelVerdict(){
    const [a, b] = scores;
    if(a === b) return a === 0
      ? "Nil–nil. Did either of you actually read the site?"
      : "It's a draw. Go again, one of you has to win eventually.";
    const winner = a > b ? 1 : 2;
    return [
      `Player ${winner} wins. Verified by me, personally.`,
      `Player ${winner} takes it. No arguing, I checked the maths.`
    ][Math.floor(Math.random() * 2)];
  }

  /* The share sticker is drawn, never photographed: vectors, text and emoji
     only, so the canvas stays untainted (toDataURL works even on file://). */
  function saveSticker(){
    const scoreText = players === 2 ? `${scores[0]} – ${scores[1]}` : `${scores[0]} / ${quiz.length}`;
    document.fonts.load("96px 'Lilita One'").catch(()=>{}).then(()=>{
      const c = document.createElement("canvas");
      c.width = 640; c.height = 640;
      const x = c.getContext("2d");
      const box = (dx, dy) => {
        x.beginPath();
        x.roundRect(60 + dx, 60 + dy, 520, 520, 24);
      };
      x.fillStyle = "#FAEED6"; x.fillRect(0, 0, 640, 640);
      x.fillStyle = "rgba(48,34,23,.82)"; box(10, 12); x.fill();
      x.fillStyle = "#FFFCF3"; box(0, 0); x.fill();
      x.lineWidth = 5; x.strokeStyle = "#302217"; box(0, 0); x.stroke();
      x.textAlign = "center";
      x.font = "80px 'Lilita One', sans-serif";
      x.fillText(CURRENT_TRIP.icon, 320, 190);
      x.fillStyle = "#77614C";
      x.font = "800 24px Outfit, sans-serif";
      x.fillText((players === 2 ? "HEAD TO HEAD · " : "") + CURRENT_TRIP.name.toUpperCase(), 320, 250);
      x.fillStyle = "#C93A2B";
      x.font = "110px 'Lilita One', sans-serif";
      x.fillText(scoreText, 320, 380);
      x.fillStyle = "#302217";
      x.font = "34px 'Lilita One', sans-serif";
      x.fillText("⭐".repeat(Math.max(...scores)) || "☆", 320, 440);
      x.fillStyle = "#77614C";
      x.font = "600 22px Outfit, sans-serif";
      x.fillText("The Big Quiz · China 2026 · by Maisie", 320, 540);
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "china-2026-quiz-sticker.png";
      a.click();
    });
  }

  function finish(){
    const best = Math.max(...scores);
    const prev = (store.get("quizBest", {}) || {})[CURRENT_TRIP.id] || 0;
    store.patch("quizBest", { [CURRENT_TRIP.id]: Math.max(best, prev) });

    const scoreboard = players === 2
      ? `<div class="quiz-final-stat">${scores[0]} – ${scores[1]}</div>
         <div class="quiz-duel">
           <span>Player 1: ${"⭐".repeat(scores[0]) || "☆"}</span>
           <span>Player 2: ${"⭐".repeat(scores[1]) || "☆"}</span>
         </div>
         <p class="quiz-verdict">${duelVerdict()}</p>`
      : `<div class="quiz-final-stat">${scores[0]} / ${quiz.length}</div>
         <div class="quiz-final-stars">${"⭐".repeat(scores[0]) || "…nothing? Really?"}</div>
         <p class="quiz-verdict">${verdict(scores[0], quiz.length)}</p>`;

    card.innerHTML = `
      <div class="quiz-final">
        <span class="quiz-badge">Final score</span>
        ${scoreboard}
        <div class="quiz-final-actions">
          <button class="quiz-again" type="button">🔁 Different questions, same quiz</button>
          <button class="quiz-sticker" type="button">📸 Save my score as a sticker</button>
          <button class="quiz-mode-switch" type="button">Change players</button>
        </div>
      </div>`;
    card.querySelector(".quiz-again").addEventListener("click", ()=> start(players));
    card.querySelector(".quiz-sticker").addEventListener("click", saveSticker);
    card.querySelector(".quiz-mode-switch").addEventListener("click", intro);

    /* Pull the reader onward: another trip's quiz, picked at random from
       the trips that actually have one. Injected after the rewrite pass,
       so the link carries its own ?trip=. */
    const others = (typeof TRIPS !== "undefined" ? TRIPS : [])
      .filter(t => t.id !== CURRENT_TRIP.id && (FACTS[t.id] || []).length >= 4);
    if(others.length){
      const next = others[Math.floor(Math.random() * others.length)];
      const a = document.createElement("a");
      a.className = "quiz-crosslink";
      a.href = `story.html?trip=${next.id}#quiz`;
      a.textContent = `Reckon you'd survive the ${next.name} one? →`;
      card.querySelector(".quiz-final").appendChild(a);
    }
  }

  const n = Math.min(5, eligible.length);
  const sub = document.getElementById("quizSub");
  if(sub) sub.textContent =
    `${n === 5 ? "Five" : n} quick ones about ${CURRENT_TRIP.name}. Every answer is hiding in my facts above — no googling.`;
  document.getElementById("quiz").hidden = false;
  addHeroJump("#quiz", "🧠 The Big Quiz ↓");
  intro();
})();
