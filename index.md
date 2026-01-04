---
layout: default
title: Accueil
---

# Association GPMF
Bienvenue sur notre site.
<!-- Leaflet CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<section class="map">
  <h2>Point de rendez-vous</h2>

  <div id="map"
       style="width:100%; height:360px; border-radius:8px; border:1px solid #ccc;">
  </div>

  <p style="margin-top: .5rem;">
    <a href="https://www.openstreetmap.org/?mlat=46.798062&amp;mlon=7.118103#map=19/46.798062/7.118103"
       target="_blank" rel="noopener">
      Ouvrir la carte
    </a>
  </p>
</section>

<section class="slideshow">
  <h2>Photos</h2>

  <div class="slideshow-frame">
    <a id="slideshowLink" href="/photos/" title="Voir la galerie">
      <img
        id="slideshowImg"
        alt="Diaporama photos GPMF"
        loading="eager"
        decoding="async"
      >
    </a>

    <div class="slideshow-caption">
      <span id="slideshowMeta">Chargement des photos…</span>
      <a class="slideshow-cta" href="/photos/">Voir la galerie</a>
    </div>
  </div>
</section>


<script>
document.addEventListener("DOMContentLoaded", async () => {
  const WORKER_BASE = "https://weathered-math-a354.jeremieschouwey.workers.dev";
  const ROOT_PREFIX = "";          // mets "GPMF 2025/" si tu veux limiter
  const INTERVAL_MS = 6000;
  const MAX_PHOTOS = 250;

  const imgEl  = document.getElementById("slideshowImg");
  const linkEl = document.getElementById("slideshowLink");
  const metaEl = document.getElementById("slideshowMeta");

  if (!imgEl || !linkEl) {
    console.error("[slideshow] éléments DOM introuvables (slideshowImg/slideshowLink).");
    return;
  }

  const isImageKey = (k) => /\.(jpe?g|png|webp|gif)$/i.test(k || "");

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  async function safeFetchJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
    return r.json();
  }

  async function list(prefix) {
    const url = `${WORKER_BASE}/api/list?prefix=${encodeURIComponent(prefix)}`;
    return safeFetchJSON(url);
  }

  // IMPORTANT: on essaie d’utiliser une URL directe renvoyée par ton API.
  // Si ton /api/list ne renvoie pas d’URL, il faudra utiliser l’endpoint réel de service d’image.
  function extractPhoto(it) {
    if (!it) return null;

    if (typeof it === "string") {
      if (isImageKey(it)) return { key: it, url: null };
      return null;
    }

    const key = it.key || it.Key || it.name || it.path || null;
    const url = it.url || it.URL || it.publicUrl || it.downloadUrl || it.directUrl || null;

    if (key && isImageKey(key)) return { key, url };
    return null;
  }

  async function loadPhotos() {
    const root = await list(ROOT_PREFIX);
    const items = root.items || root.objects || root.prefixes || root || [];

    let prefixes = [];
    let photos = [];

    // 1) si le root contient déjà des photos
    if (Array.isArray(items)) {
      for (const it of items) {
        // prefixes
        const p = (typeof it === "object" && (it.prefix || it.Prefix)) ? (it.prefix || it.Prefix) : null;
        if (typeof it === "string" && it.endsWith("/")) prefixes.push(it);
        if (p) prefixes.push(p);

        // photos
        const ph = extractPhoto(it);
        if (ph) photos.push(ph);
      }
    }

    // 2) si on a des dossiers, on liste chaque dossier
    for (const p of prefixes) {
      const res = await list(p);
      const subItems = res.items || res.objects || res.prefixes || res || [];
      if (Array.isArray(subItems)) {
        for (const it of subItems) {
          const ph = extractPhoto(it);
          if (ph) photos.push(ph);
          if (photos.length >= MAX_PHOTOS) break;
        }
      }
      if (photos.length >= MAX_PHOTOS) break;
    }

    // dédoublonne
    const seen = new Set();
    photos = photos.filter(ph => {
      const id = ph.url || ph.key;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    shuffle(photos);
    return photos.slice(0, MAX_PHOTOS);
  }

  function preload(url) {
    const i = new Image();
    i.decoding = "async";
    i.src = url;
  }

  let playlist = [];
  let idx = 0;

  async function setSlide(photo) {
    // Si ton API renvoie une URL, on l’utilise.
    // Sinon, on est bloqué et il faudra brancher l’endpoint exact qui sert l’image.
    const url = photo.url;

    if (!url) {
      metaEl.textContent = "Impossible de charger les URLs des photos (API list sans champ url).";
      console.error("[slideshow] Pas d'URL pour la photo:", photo);
      return;
    }

    imgEl.classList.add("is-fading");
    await new Promise(r => setTimeout(r, 250));

    imgEl.src = url;
    metaEl.textContent = (photo.key || "").split("/").pop() || "";

    const next = playlist[(idx + 1) % playlist.length];
    if (next?.url) preload(next.url);

    requestAnimationFrame(() => imgEl.classList.remove("is-fading"));
  }

  try {
    metaEl.textContent = "Chargement…";
    playlist = await loadPhotos();

    console.log("[slideshow] photos chargées:", playlist.length, playlist[0]);

    if (!playlist.length) {
      metaEl.textContent = "Aucune photo trouvée.";
      return;
    }

    await setSlide(playlist[idx]);

    setInterval(async () => {
      idx = (idx + 1) % playlist.length;
      await setSlide(playlist[idx]);
    }, INTERVAL_MS);

  } catch (e) {
    console.error("[slideshow] erreur:", e);
    metaEl.textContent = "Erreur de chargement (voir console).";
  }
});
</script>



<script>
  const lat = 46.798062;
  const lon = 7.118103;

  const map = L.map('map').setView([lat, lon], 18);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup('<strong>RDV estival</strong><br/>ici chaque mercredi à <strong>18h15</strong> !')
    .openPopup();
</script>

