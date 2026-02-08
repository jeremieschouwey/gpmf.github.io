---
layout: default
title: Tracées hivernaux
permalink: /tracehiver/
---

# Tracées hivernaux

Choisis un tracé pour l’afficher sur la carte, puis télécharge le fichier GPX si tu veux l’importer dans ta montre (Garmin/Coros/Suunto), Strava, Komoot, etc.

<div class="traces-layout">
  <aside class="traces-panel">
    <div class="traces-panel-header">
      <h2>Liste des tracés</h2>
      <p class="muted" style="margin:6px 0 0 0;">
        Les GPX sont hébergés sur GitHub.
      </p>
    </div>

    <div class="traces-list" id="tracesList"></div>
  </aside>

  <section class="traces-map">
    <div class="traces-map-header">
      <div>
        <h2 id="traceTitle" style="margin:0;">Sélectionne un tracé</h2>
        <div class="muted" id="traceMeta" style="margin-top:6px;"></div>
      </div>

      <div class="traces-actions">
        <a class="btn" id="downloadBtn" href="#" download style="pointer-events:none; opacity:.5;">
          Télécharger GPX
        </a>
      </div>
    </div>

    <div id="map" class="map-box"></div>

    
  </section>
</div>

<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>

<!-- GPX loader -->
<script src="https://cdn.jsdelivr.net/npm/leaflet-gpx@1.7.0/dist/leaflet-gpx.min.js"></script>



<script>
  const TRACES = {{ site.data.gpx_traces | jsonify }};

  const elList  = document.getElementById('tracesList');
  const elTitle = document.getElementById('traceTitle');
  const elMeta  = document.getElementById('traceMeta');
  const elDl    = document.getElementById('downloadBtn');

  const map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  map.setView([46.8, 7.15], 11);

  let currentLayer = null;

  function gpxUrl(file) {
    // ⚠️ on construit l'URL proprement (évite les surprises de slash)
    const base = "{{ '/assets/gpx/' | relative_url }}";
    return base.replace(/\/?$/, '/') + file.replace(/^\//, '');
  }

  async function smokeTestFetch(url) {
    console.log('[GPX] fetch test:', url);
    const res = await fetch(url, { cache: 'no-store' });
    console.log('[GPX] status:', res.status, res.statusText);
    const txt = await res.text();
    console.log('[GPX] first chars:', txt.slice(0, 120));
    // Petit check “GPX-like”
    if (!txt.includes('<gpx') && !txt.includes('<trk') && !txt.includes('<rte')) {
      console.warn('[GPX] content does not look like GPX');
    }
  }

  function loadTrace(trace, buttonEl) {
    // UI
    if (buttonEl) {
      [...document.querySelectorAll('.trace-item')].forEach(el => el.classList.remove('is-active'));
      buttonEl.classList.add('is-active');
    }
    elTitle.textContent = trace.title || trace.file;
    elMeta.textContent = '';
    elDl.href = gpxUrl(trace.file);
    elDl.style.pointerEvents = 'auto';
    elDl.style.opacity = '1';

    const url = gpxUrl(trace.file);
    console.log('[GPX] loading:', trace.file, '->', url);

    // remove previous
    if (currentLayer) {
      map.removeLayer(currentLayer);
      currentLayer = null;
    }

    // IMPORTANT: si la map est dans un layout qui change, parfois il faut ça
    setTimeout(() => map.invalidateSize(true), 0);

    // Optionnel: test fetch pour voir si le fichier est vraiment récupéré
    smokeTestFetch(url).catch(err => console.error('[GPX] fetch failed:', err));

    currentLayer = new L.GPX(url, {
      async: true,
      polyline_options: {
        // on force un style visible
        opacity: 0.9,
        weight: 5
      }
    })
    .on('loaded', function(e) {
      console.log('[GPX] loaded event fired');
      const bounds = e.target.getBounds();
      console.log('[GPX] bounds:', bounds);

      if (bounds && bounds.isValid && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        console.warn('[GPX] invalid bounds -> fallback zoom');
        map.setView([46.8, 7.15], 12);
      }
    })
    .on('error', function(err) {
      console.error('[GPX] leaflet-gpx error:', err);
      alert("Erreur: impossible de lire le fichier GPX. Regarde la console (F12) pour le détail.");
    })
    .addTo(map);
  }

  function renderList() {
    if (!TRACES || !TRACES.length) {
      elList.innerHTML = `<p>Aucun tracé configuré.</p>`;
      return;
    }
    elList.innerHTML = TRACES.map((t, idx) => `
      <button class="trace-item" type="button" data-index="${idx}">
        <div class="trace-title">${t.title || t.file}</div>
      </button>
    `).join('');

    [...elList.querySelectorAll('.trace-item')].forEach(btn => {
      btn.addEventListener('click', () => loadTrace(TRACES[Number(btn.dataset.index)], btn));
    });

    elList.querySelector('.trace-item')?.click();
  }

  renderList();
</script>


<style>
  .traces-layout{
    display:grid;
    grid-template-columns: 360px 1fr;
    gap:16px;
    margin-top:16px;
    align-items:start;
  }
  @media (max-width: 900px){
    .traces-layout{ grid-template-columns: 1fr; }
  }

  .traces-panel{
    position:sticky;
    top:16px;
  }
  @media (max-width: 900px){
    .traces-panel{ position:static; }
  }

  .traces-panel-header{
    margin-bottom:10px;
  }

  .traces-list{
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  .trace-item{
    text-align:left;
    border:1px solid var(--border);
    background: var(--card);
    padding:12px;
    border-radius: var(--radius-sm);
    box-shadow: 0 6px 16px rgba(16,24,40,0.06);
    cursor:pointer;
  }
  .trace-item:hover{ transform: translateY(-1px); }
  .trace-item.is-active{
    outline: 2px solid rgba(217,50,0,0.25);
    border-color: rgba(217,50,0,0.35);
  }
  .trace-title{
    font-weight: 700;
    color: var(--text);
  }
  .trace-meta{
    margin-top:6px;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .traces-map-header{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:12px;
    margin-bottom:12px;
  }
  .traces-actions{ display:flex; gap:10px; flex-wrap:wrap; }

  .btn{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 12px;
    border-radius: 12px;
    border:1px solid var(--border);
    background: var(--card);
    color: var(--text);
    text-decoration:none;
    box-shadow: 0 8px 20px rgba(16,24,40,0.08);
    font-weight: 600;
    white-space:nowrap;
  }
  .btn:hover{ transform: translateY(-1px); }

  .map-box{
    height: 520px;
    border-radius: var(--radius);
    border:1px solid var(--border);
    overflow:hidden;
    box-shadow: var(--shadow);
    background: #fff;
  }

  /* Reuse your existing .card styles if present; this is safe fallback */
  .card{
    background: var(--card);
    border:1px solid var(--border);
    border-radius: var(--radius);
    padding:14px;
    box-shadow: var(--shadow);
  }
  .card-title{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
  }
  .muted{ color: var(--muted); }
</style>
