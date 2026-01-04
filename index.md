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

  <div class="slideshow-frame" aria-label="Diaporama photos">
    <a id="slideshowLink" href="/photos/" title="Voir la galerie">
      <img id="slideshowImg" alt="Photo aléatoire GPMF" loading="eager" decoding="async">
    </a>

    <div class="slideshow-caption">
      <span id="slideshowMeta"></span>
      <a class="slideshow-cta" href="/photos/">Voir la galerie</a>
    </div>
  </div>
</section>

<script>
(() => {
  // 1) CONFIG
  const WORKER_BASE = "https://weathered-math-a354.jeremieschouwey.workers.dev"; // <-- adapte
  const ROOT_PREFIX = ""; // ex: "GPMF 2025/" si tu veux limiter à un "dossier racine"
  const INTERVAL_MS = 6000; // vitesse du diaporama
  const MAX_PHOTOS = 250;   // limite de sécurité (évite de charger 3000 URLs)

  // 2) DOM
  const imgEl  = document.getElementById("slideshowImg");
  const linkEl = document.getElementById("slideshowLink");
  const metaEl = document.getElementById("slideshowMeta");

  if (!imgEl || !linkEl) return;

  // 3) HELPERS
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const safeFetchJSON = async (url) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
    return r.json();
  };

  // 4) ADAPTE ICI SELON TON API
  // On suppose:
  // - GET /api/list?prefix=... retourne { items: [...] }
  // - chaque item peut être soit un "prefix" (dossier) soit un "object" (photo)
  // Comme ton worker est "sur mesure", il peut être nécessaire de changer la lecture des champs.
  const isImageKey = (key) => /\.(jpe?g|png|webp|gif)$/i.test(key);

  const buildPublicUrlFromKey = (key) => {
    // Si ton Worker expose un endpoint "serve" / "file" / "photo" :
    // ex: `${WORKER_BASE}/api/file?key=${encodeURIComponent(key)}`
    // Adapte selon ton implémentation actuelle.
    return `${WORKER_BASE}/api/file?key=${encodeURIComponent(key)}`;
  };

  const list = async (prefix) => {
    const url = `${WORKER_BASE}/api/list?prefix=${encodeURIComponent(prefix)}`;
    return safeFetchJSON(url);
  };

  // 5) CHARGEMENT DES PHOTOS
  async function loadAllPhotos() {
    // a) récupère la liste racine
    const root = await list(ROOT_PREFIX);

    // Essaye de deviner les champs usuels
    const items = root.items || root.objects || root.prefixes || root || [];
    let prefixes = [];
    let keys = [];

    // Heuristique: si c'est une liste de strings -> c'est soit des prefixes soit des keys
    if (Array.isArray(items)) {
      for (const it of items) {
        if (typeof it === "string") {
          if (it.endsWith("/")) prefixes.push(it);
          else if (isImageKey(it)) keys.push(it);
        } else if (it && typeof it === "object") {
          const p = it.prefix || it.Prefix;
          const k = it.key || it.Key || it.name;
          if (p) prefixes.push(p);
          if (k && isImageKey(k)) keys.push(k);
        }
      }
    }

    // b) si on a des dossiers: on liste chaque dossier et on collecte les photos
    for (const p of prefixes) {
      const res = await list(p);
      const subItems = res.items || res.objects || res.prefixes || res || [];
      if (Array.isArray(subItems)) {
        for (const it of subItems) {
          let k = null;
          if (typeof it === "string") k = it;
          else if (it && typeof it === "object") k = it.key || it.Key || it.name;
          if (k && isImageKey(k)) keys.push(k);
          if (keys.length >= MAX_PHOTOS) break;
        }
      }
      if (keys.length >= MAX_PHOTOS) break;
    }

    // c) si pas de dossiers, on se contente des keys déjà trouvées
    // d) dédoublonne + shuffle
    keys = Array.from(new Set(keys));
    shuffle(keys);

    return keys;
  }

  // 6) LECTURE EN BOUCLE
  let playlist = [];
  let idx = 0;
  let timer = null;

  const preload = (url) => {
    const i = new Image();
    i.decoding = "async";
    i.src = url;
  };

  const setSlide = async (key) => {
    const url = buildPublicUrlFromKey(key);

    // fade out
    imgEl.classList.add("is-fading");

    // petit délai pour laisser la transition s'appliquer
    await new Promise(r => setTimeout(r, 250));

    // swap image
    imgEl.src = url;

    // affichage meta "simple"
    metaEl && (metaEl.textContent = key.split("/").pop() || "");

    // lien vers la page photos (tu peux aussi pointer vers un dossier spécifique si tu veux)
    linkEl.href = "/photos/";

    // preload suivant
    const nextKey = playlist[(idx + 1) % playlist.length];
    if (nextKey) preload(buildPublicUrlFromKey(nextKey));

    // fade in
    requestAnimationFrame(() => imgEl.classList.remove("is-fading"));
  };

  async function start() {
    try {
      playlist = await loadAllPhotos();
      if (!playlist.length) return;

      idx = 0;
      await setSlide(playlist[idx]);

      timer = setInterval(async () => {
        idx = (idx + 1) % playlist.length;
        await setSlide(playlist[idx]);
      }, INTERVAL_MS);

    } catch (e) {
      console.error("Slideshow error:", e);
    }
  }

  start();
})();
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

