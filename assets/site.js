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
    const hrefPath = a.getAttribute("href").split("?")[0] || "index.html";
    if(hrefPath === here) a.classList.add("current");
    if(CURRENT_TRIP) a.setAttribute("href", hrefPath + "?trip=" + CURRENT_TRIP.id);
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
   The section is hidden in the markup and only revealed if the current trip
   actually has facts, so a trip without them doesn't leave an empty heading. */
(function(){
  const grid = document.getElementById("factsGrid");
  if(!grid || typeof FACTS === "undefined" || !CURRENT_TRIP) return;
  const facts = FACTS[CURRENT_TRIP.id];
  if(!facts || !facts.length) return;

  grid.innerHTML = facts.map((f, i)=>`
    <div class="fact-card">
      <div class="fact-index">${String(i + 1).padStart(2, "0")}</div>
      <div class="fact-stat">${f.stat}</div>
      <div class="fact-label">${f.label}</div>
      <p class="fact-text">${f.text}</p>
    </div>
  `).join("");

  const sub = document.getElementById("factsSub");
  if(sub) sub.textContent = `Ten things about ${CURRENT_TRIP.name} I genuinely did not believe until I checked.`;
  document.getElementById("factsSection").hidden = false;
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
  const modalTitle = document.getElementById("modalTitle");
  const modalDetail = document.getElementById("modalDetail");
  const modalLocation = document.getElementById("modalLocation");

  openPhoto = function(photo){
    modalImg.src = photoSrc(photo);
    modalImg.alt = photo.caption;
    modalImg.style.display = "block";
    modalTitle.textContent = photo.caption;
    modalDetail.innerHTML = photo.detail || "";
    if(modalLocation){
      const loc = (typeof LOCATIONS !== "undefined") ? LOCATIONS.find(l=>l.id===photo.location) : null;
      modalLocation.textContent = loc ? `${loc.num}. ${loc.name}` : "";
    }
    modalOverlay.classList.add("open");
  };
  function closePhotoModal(){ modalOverlay.classList.remove("open"); }
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
            <img src="${photoSrc(p)}" alt="${p.caption}" loading="lazy" />
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
          <img src="${photoSrc(p)}" alt="${p.caption}" loading="lazy" />
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
