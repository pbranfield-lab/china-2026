/* ============================================================
   SHARED SITE LOGIC — every page includes this after data.js.
   Each block guards on the elements it needs existing, so pages
   only wire up the bits of UI they actually contain.
   ============================================================ */

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
    if(a.getAttribute("href") === here) a.classList.add("current");
  });
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
  if(el && typeof HISTORY_INTRO !== "undefined") el.innerHTML = HISTORY_INTRO;
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
    modalImg.src = `Photographs/${photo.file}`;
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

  LOCATIONS.forEach(loc=>{
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
    currentLocation = LOCATIONS.find(l=>l.id===id);
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
            <img src="Photographs/${p.file}" alt="${p.caption}" loading="lazy" />
            <div class="cap">${p.caption}</div>
          </button>
        `).join("")
      : `<div class="photo-empty">${EMPTY_STATE_LINES[loc.num % EMPTY_STATE_LINES.length]}</div>`;

    detailPanel.innerHTML = `
      <h2>${loc.num}. ${loc.name}</h2>
      <div class="chinese">${loc.chinese}</div>
      <div class="story">${loc.story}</div>
      ${williamToggle.checked ? `<div class="william-box"><b>William, unimpressed, from the corner:</b><br>${loc.william}</div>` : ""}
      <div class="photo-grid">${photosHtml}</div>
    `;
    detailPanel.querySelectorAll(".photo-thumb").forEach(btn=>{
      btn.addEventListener("click", ()=> openPhoto(PHOTOS[parseInt(btn.dataset.photoIndex,10)]) );
    });
  }
  williamToggle.addEventListener("change", renderPanel);

  // Deep link support: map.html?loc=imperial-garden opens straight to that popout
  const params = new URLSearchParams(location.search);
  const deepLoc = params.get("loc");
  if(deepLoc && LOCATIONS.some(l=>l.id===deepLoc)){
    showLocation(deepLoc);
  }
})();

/* ---------- Gallery page: every photo, filterable by location ---------- */
(function(){
  const galleryGrid = document.getElementById("galleryGrid");
  if(!galleryGrid || typeof PHOTOS === "undefined") return;

  function renderGallery(filterLoc){
    const items = filterLoc ? PHOTOS.filter(p=>p.location===filterLoc) : PHOTOS;
    galleryGrid.innerHTML = items.map(p=>{
      const loc = LOCATIONS.find(l=>l.id===p.location);
      return `
        <button class="photo-thumb gallery-item" data-photo-id="${p.id}">
          <img src="Photographs/${p.file}" alt="${p.caption}" loading="lazy" />
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

    const locsUsed = [...new Set(PHOTOS.map(p=>p.location))]
      .map(id=>LOCATIONS.find(l=>l.id===id))
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
