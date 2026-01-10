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
  const INTERVAL_MS = 6000;
  const MAX_PHOTOS = 300;

  const imgEl  = document.getElementById("slideshowImg");
  const linkEl = document.getElementById("slideshowLink");
  const metaEl = document.getElementById("slideshowMeta");

  if (!imgEl || !linkEl) {
    console.error("[slideshow] éléments DOM introuvables");
    return;
  }

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  async function fetchJSON(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status} – ${url}`);
    return r.json();
  }

  try {
    metaEl.textContent = "Chargement des photos…";

    /* 1) Récupération des dossiers (EXACTEMENT comme la page Photos) */
    const folders = await fetchJSON(`${WORKER_BASE}/api/folders`);
    console.log("[slideshow] folders:", folders);

    let photos = [];

    /* 2) Pour chaque dossier → récupération des photos */
    for (const folder of folders) {
      const res = await fetchJSON(
        `${WORKER_BASE}/api/list?prefix=${encodeURIComponent(folder)}`
      );

      if (Array.isArray(res.files)) {
        for (const file of res.files) {
          if (file.url) {
            photos.push({
              url: file.url,
              name: file.name || "",
              folder
            });
          }
        }
      }

      if (photos.length >= MAX_PHOTOS) break;
    }

    if (!photos.length) {
      metaEl.textContent = "Aucune photo trouvée.";
      return;
    }

    shuffle(photos);
    console.log("[slideshow] photos chargées:", photos.length);

    /* 3) Slideshow */
    let idx = 0;

    const preload = (url) => {
      const i = new Image();
      i.decoding = "async";
      i.src = url;
    };

    const show = async (photo) => {
      imgEl.classList.add("is-fading");
      await new Promise(r => setTimeout(r, 250));

      imgEl.src = photo.url;
      metaEl.textContent = photo.folder.replace(/\/$/, "");
      linkEl.href = "/photos/";

      const next = photos[(idx + 1) % photos.length];
      if (next?.url) preload(next.url);

      requestAnimationFrame(() => imgEl.classList.remove("is-fading"));
    };

    await show(photos[idx]);

    setInterval(async () => {
      idx = (idx + 1) % photos.length;
      await show(photos[idx]);
    }, INTERVAL_MS);

  } catch (e) {
    console.error("[slideshow] erreur:", e);
    metaEl.textContent = "Erreur de chargement du diaporama.";
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

