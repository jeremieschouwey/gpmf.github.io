---
layout: default
title: Accueil
---

<div class="hero">
  <div class="badge">Chaque mercredi • 18h15 • Préparation Morat-Fribourg</div>

  <h1>Groupes Préparer Morat Fribourg</h1>
  <p class="subtitle">
    20 semaines pour préparer Morat-Fribourg !
  </p>

  <div class="kpi">
    <span class="badge">Ouvert à tous niveaux</span>
    <span class="badge">Programme progressif</span>
    <span class="badge">Gratuit et sans inscription</span>
  </div>
</div>
<div class="hr"></div>

<div class="grid mt-16">
  <div class="col-4">
    <div class="card">
      <div class="card-title">
        <h3>Prochain entrainement</h3>
        <a class="card-link" href="{{ '/programme' | relative_url }}">Détails</a>
      </div>
      <p class="muted">Consulte les détails du prochain entrainement.</p>
    </div>
  </div>

  <div class="col-4">
    <div class="card">
      <div class="card-title">
        <h3>Programme</h3>
        <a class="card-link" href="{{ '/programme' | relative_url }}">Ouvrir</a>
      </div>
      <p class="muted">Le programme entier des 20 semaines.</p>
    </div>
  </div>

  <div class="col-4">
    <div class="card">
      <div class="card-title">
        <h3>Actualités</h3>
        <a class="card-link" href="{{ '/actualites' | relative_url }}">Lire</a>
      </div>
      <p class="muted">Annonces, informations et divers de l'association</p>
    </div>
  </div>
</div>

<section class="map mt-16">
  <h2>Point de rendez-vous</h2>

  <div id="map-rdv" class="map-box" style="height:360px;"></div>

  <p class="muted">
    RDV estival ici chaque mercredi à 18h15 — parking à disposition indiqué sur la carte.
  </p>

  <div class="hr"></div>

  <small>
    <a href="https://www.openstreetmap.org/?#map=19/46.798233/7.118851">Afficher une carte plus grande</a>
  </small>
</section>
<h2>Nos sponsors</h2>
<div class="sponsors-grid">

 <figure class="sponsor-card">
    <a href="https://www.trilogiesport.ch" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/TrilogieSport.jpg' | relative_url }}"
           alt="Trilogie Sport Belfaux" />
    </a>
    <figcaption>Trilogie Sport Belfaux</figcaption>
  </figure>

  <figure class="sponsor-card">
    <a href="https://afc10000.ch/" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/AFC10000.jpg' | relative_url }}"
           alt="Amicale fribourgeoise des coureurs de 10'000m" />
    </a>
    <figcaption>afc10000</figcaption>
  </figure>

 

  <figure class="sponsor-card">
    <a href="https://www.givisiez.ch" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/CommuneGivisiez.jpg' | relative_url }}"
           alt="Commune de Givisiez" />
    </a>
    <figcaption>Commune de Givisiez</figcaption>
  </figure>

  <figure class="sponsor-card">
    <a href="https://granges-paccot.ch/" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/CommuneGrangePaccot.jpg' | relative_url }}"
           alt="Commune de Granges-Paccot" />
    </a>
    <figcaption>Commune de Granges-Paccot</figcaption>
  </figure>

  
  <figure class="sponsor-card">
    <a href="https://www.groupe-e.ch/fr/" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/GroupeE.jpg' | relative_url }}"
           alt="Groupe E" />
    </a>
    <figcaption>Groupe E</figcaption>
  </figure>

   <figure class="sponsor-card">
    <a href="https://soutien-loro.ch/fr" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/LoterieRomande.jpg' | relative_url }}"
           alt="Loterie Romande" />
    </a>
    <figcaption>Loterie Romande</figcaption>
  </figure>


   <figure class="sponsor-card">
    <a href="https://demoncor.ch/" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/RestaurantDeMoncor.jpg' | relative_url }}"
           alt="Restaurant De Moncor" />
    </a>
    <figcaption>Restaurant De Moncor</figcaption>
  </figure>

   <figure class="sponsor-card">
    <a href="https://www.villars-sur-glane.ch/" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/VillarsSurGlane.png' | relative_url }}"
           alt="Commune de Villars-sur-Glâne" />
    </a>
    <figcaption>Commune de Villars-sur-Glâne</figcaption>
  </figure>

  <figure class="sponsor-card">
    <a href="https://www.raiffeisen.ch/sarine-ouest/fr/ueber-uns/ihre-bank-vor-ort.html" target="_blank" rel="noopener noreferrer">
      <img src="{{ '/assets/sponsors/logos/raiffeisen.png' | relative_url }}"
           alt="RAIFFEISEN Sarine-Ouest" />
    </a>
    <figcaption>RAIFFEISEN Sarine-Ouest</figcaption>
  </figure>  

</div>


<script>
  document.addEventListener("DOMContentLoaded", () => {
    // Coordonnées
    const rdv = [46.798062, 7.118103];
    const parking = [46.799089633236605, 7.120852356673644];

    // Centre: milieu entre les 2 points
    const center = [(rdv[0] + parking[0]) / 2, (rdv[1] + parking[1]) / 2];

    const map = L.map("map-rdv", { scrollWheelZoom: false }).setView(center, 17);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const iconRdv = L.divIcon({
      className: '',
      html: '<div class="map-pin map-pin--rdv">🏃</div>',
      iconSize: [36, 36], iconAnchor: [18, 18], tooltipAnchor: [0, -22]
    });
    const iconParking = L.divIcon({
      className: '',
      html: '<div class="map-pin map-pin--parking">P</div>',
      iconSize: [36, 36], iconAnchor: [18, 18], tooltipAnchor: [0, -22]
    });

    const m1 = L.marker(rdv, { icon: iconRdv }).addTo(map)
      .bindTooltip("Rendez-vous", { permanent: true, direction: 'top', className: 'map-label map-label--rdv' })
      .bindPopup("<b>Point de rendez-vous</b><br>RDV estival chaque mercredi à 18h15 !");

    const m2 = L.marker(parking, { icon: iconParking }).addTo(map)
      .bindTooltip("Parking", { permanent: true, direction: 'top', className: 'map-label map-label--parking' })
      .bindPopup("<b>Parking à disposition</b><br>Places limitées !");

    // Ajuste automatiquement le zoom pour inclure les 2 marqueurs
    const bounds = L.latLngBounds([rdv, parking]);
    map.fitBounds(bounds, { padding: [30, 30] });
    map.zoomOut(1);

    // Optionnel: ouvre la popup RDV par défaut
    // m1.openPopup();
  });
</script>



<script>
(async () => {
  const container = document.getElementById("calendarUpcoming");

  try {
    const res = await fetch("https://gpmf-calendar.jeremieschouwey.workers.dev/api/calendar.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const items = data.upcoming || [];
    if (!items.length) {
      container.innerHTML = "<p>Aucune séance à afficher.</p>";
      return;
    }

    // On n'affiche que la prochaine séance
    const ev = items[0];
    const meta = ev.meta || {};
    const levels = Array.isArray(meta.levels) ? meta.levels : [];

    const intensity = meta.intensity || null;
    const mercredi = meta.mercredi || {};
    const conseil = meta.conseil || "";

    const intensityHtml = intensity && (intensity.I || intensity.percent)
      ? `<p><strong>Intensité :</strong> ${[intensity.I ? `I ${escapeHtml(intensity.I)}` : "", intensity.percent ? escapeHtml(intensity.percent) : ""].filter(Boolean).join(" — ")}</p>`
      : "";

    const seanceMercrediHtml = levels.length
      ? `
        <h4>Séance du mercredi</h4>
        <ul>
          ${levels.map(lvl => {
            const txt = typeof mercredi[lvl.id] === "string" ? mercredi[lvl.id] : "";
            return `<li><strong>${escapeHtml(lvl.label)} :</strong> ${escapeHtml(txt || "À définir")}</li>`;
          }).join("")}
        </ul>
      `
      : "";

    const conseilHtml = conseil
      ? `<p><strong>Conseil :</strong> ${escapeHtml(conseil)}</p>`
      : "";

    container.innerHTML = `
      <article class="calendar-item">
        <h3>${escapeHtml(ev.title || "Prochaine séance")}</h3>
        <div class="meta">
          <strong>${escapeHtml(ev.date_human)}</strong> — ${escapeHtml(ev.time)} (${escapeHtml(String(ev.duration_minutes))} min)<br/>
          ${escapeHtml(ev.location || "")}
        </div>

        ${intensityHtml}
        ${seanceMercrediHtml}
        ${conseilHtml}

        <p class="mt-16">
          <a class="btn btn-outline" href="https://gpmf-calendar.jeremieschouwey.workers.dev/api/calendar.ics" download>
            Télécharger le calendrier (.ics)
          </a>
        </p>
      </article>
    `;
  } catch (e) {
    container.innerHTML = "<p>Impossible de charger la prochaine séance.</p>";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
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
  const PER_FOLDER = 12;   // nb max de photos prises par dossier
const SHUFFLE_FOLDERS = true; // mélange l'ordre des dossiers


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

// Optionnel: mélanger l’ordre des dossiers pour varier encore plus
const foldersWork = SHUFFLE_FOLDERS ? shuffle([...folders]) : [...folders];

for (const folder of foldersWork) {
  const listRaw = await fetchJSON(
    `${WORKER_BASE}/api/list?prefix=${encodeURIComponent(folder)}`
  );

  const files = normalizeFiles(listRaw);

  // 1) transforme les fichiers en URLs
  let folderPhotos = [];
  for (const file of files) {
    const key = extractKey(file, folder);
    if (!key) continue;

    folderPhotos.push({
      url: buildPublicUrlFromKey(key),
      folder,
      name: (typeof file === "object" ? (file.name || file.key || "") : "")
    });
  }

  // 2) échantillonnage aléatoire dans le dossier
  shuffle(folderPhotos);
  folderPhotos = folderPhotos.slice(0, PER_FOLDER);

  // 3) ajoute au pool global
  photos.push(...folderPhotos);

  // 4) garde-fou global
  if (photos.length >= MAX_PHOTOS) break;
}

console.log("[slideshow] photos chargées =", photos.length, photos[0]);

if (!photos.length) {
  metaEl.textContent = "Aucune photo trouvée (voir logs /api/list en console).";
  return;
}

// Mélange global final
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




