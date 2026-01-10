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

<section class="calendar">
  <h2>Calendrier</h2>

  <div id="calendarUpcoming">
    <p>Chargement…</p>
  </div>

  <p>
    <a class="btn" href="https://gpmf-calendar.jeremieschouwey.workers.dev/api/calendar.ics" download>
      Télécharger le calendrier (.ics)
    </a>
  </p>
</section>

<script>
(async () => {
  const container = document.getElementById("calendarUpcoming");

  try {
    const res = await fetch("https://gpmf-calendar.jeremieschouwey.workers.dev/api/calendar.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const items = data.upcoming || [];
    if (!items.length) {
      container.innerHTML = "<p>Aucune séance à afficher dans la période à venir.</p>";
      return;
    }

    container.innerHTML = items.map(ev => `
      <article class="calendar-item">
        <h3>${ev.title}</h3>
        <div class="meta">
          <strong>${ev.date_human}</strong> — ${ev.time} (${ev.duration_minutes} min)<br/>
          ${ev.location}
        </div>
      </article>
    `).join("");
  } catch (e) {
    container.innerHTML = "<p>Impossible de charger le calendrier.</p>";
  }
})();
</script>



<section class="slideshow">
  <h2>Photos</h2>

  <div class="slideshow-frame">
    <a id="slideshowLink" href="{{ '/photos/' | relative_url }}" title="Voir la galerie">

      <img
        id="slideshowImg"
        alt="Diaporama photos GPMF"
        loading="eager"
        decoding="async"
      >
    </a>

    <div class="slideshow-caption">
      <span id="slideshowMeta">Chargement des photos…</span>
      <a class="slideshow-cta" href="{{ '/photos/' | relative_url }}">Voir la galerie</a>
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

  if (!imgEl || !linkEl || !metaEl) {
    console.error("[slideshow] DOM manquant (slideshowImg/slideshowLink/slideshowMeta).");
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

  function normalizeFiles(payload) {
    if (payload && typeof payload === "object") {
      if (Array.isArray(payload.files)) return payload.files;
      if (Array.isArray(payload.items)) return payload.items;
      if (Array.isArray(payload.objects)) return payload.objects;
      if (Array.isArray(payload.data)) return payload.data;
    }
    return [];
  }

  function extractKey(file, folderFallback) {
    // On veut construire: "<folder>/<filename>" (URL path)
    // Certains objets auront "key" complet; d'autres juste "name".
    if (!file) return null;

    if (typeof file === "string") return file;

    const key =
      file.key || file.Key || file.path || file.pathname || file.object || null;

    const name =
      file.name || file.Name || file.filename || file.file || null;

    // Si l'API donne déjà un chemin complet, on l'utilise
    if (key) return key;

    // Sinon on reconstruit: folder + name
    if (folderFallback && name) return `${folderFallback}${name}`;

    return null;
  }

  function buildPublicUrlFromKey(key) {
    // L’URL image est directement: WORKER_BASE + "/" + key
    // key peut contenir des espaces; encodeURI conserve les "/" mais encode les espaces.
    const base = WORKER_BASE.replace(/\/$/, "");
    const path = key.startsWith("/") ? key : `/${key}`;
    return base + encodeURI(path);
  }

  try {
    metaEl.textContent = "Chargement des dossiers…";

    const foldersRaw = await fetchJSON(`${WORKER_BASE}/api/folders`);
    console.log("[slideshow] /api/folders raw =", foldersRaw);

    let folders = [];
    if (Array.isArray(foldersRaw)) {
      folders = foldersRaw;
    } else if (foldersRaw && typeof foldersRaw === "object") {
      folders =
        foldersRaw.folders ||
        foldersRaw.prefixes ||
        foldersRaw.items ||
        foldersRaw.data ||
        foldersRaw.results ||
        [];
    }
    if (!Array.isArray(folders)) folders = [];

    folders = folders
      .map(f => (typeof f === "string" ? f : (f.prefix || f.name || f.folder || "")))
      .filter(Boolean);

    console.log("[slideshow] folders normalized =", folders);

    if (!folders.length) {
      metaEl.textContent = "Aucun dossier retourné par /api/folders (voir console).";
      return;
    }

    metaEl.textContent = "Chargement des photos…";

    let photos = [];

    for (const folder of folders) {
      const listRaw = await fetchJSON(
        `${WORKER_BASE}/api/list?prefix=${encodeURIComponent(folder)}`
      );

      console.log("[slideshow] list raw for", folder, "=", listRaw);

      const files = normalizeFiles(listRaw);

      for (const file of files) {
        const key = extractKey(file, folder);
        if (!key) continue;

        const url = buildPublicUrlFromKey(key);

        photos.push({
          url,
          folder,
          name: (typeof file === "object" ? (file.name || file.key || "") : "")
        });

        if (photos.length >= MAX_PHOTOS) break;
      }

      if (photos.length >= MAX_PHOTOS) break;
    }

    console.log("[slideshow] photos chargées =", photos.length, photos[0]);

    if (!photos.length) {
      metaEl.textContent = "Aucune photo trouvée (voir logs /api/list en console).";
      return;
    }

    shuffle(photos);

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
      linkEl.href = "{{ '/photos/' | relative_url }}";

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
    metaEl.textContent = "Erreur diaporama (voir console).";
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

