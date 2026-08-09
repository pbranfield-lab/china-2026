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
  const PAGES = /^(index|story|family|map|gallery)\.html$/;
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
    /* Group thousands only if the written stat does. Year stats ("1974",
       "1368") carry no commas, and counting them up as "1,974" before
       snapping to "1974" on the last frame reads as a bug. */
    const grouped = parts[1].includes(",");
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
    a.innerHTML = `
      <div class="icon">${trip.icon}</div>
      <span class="hanzi">${trip.chinese}</span>
      <h3>${trip.name}</h3>
      <p>${trip.blurb}</p>
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
