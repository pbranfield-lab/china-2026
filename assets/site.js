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
  }

  const n = Math.min(5, eligible.length);
  const sub = document.getElementById("quizSub");
  if(sub) sub.textContent =
    `${n === 5 ? "Five" : n} quick ones about ${CURRENT_TRIP.name}. Every answer is hiding in my facts above — no googling.`;
  document.getElementById("quiz").hidden = false;
  intro();
})();
