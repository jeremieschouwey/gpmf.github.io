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
<script src="https://unpkg.com/leaflet-gpx@1.7.0/leaflet-gpx.min.js"></script>

<script>
  // Data from Jekyll (_data/gpx_traces.yml)
  const TRACES = {{ site.data.gpx_traces | jsonify }};

  const elList = document.getElementById('tracesList');
  const elTitle = document.getElementById('traceTitle');
  const elMeta  = document.getElementById('traceMeta');
  const elDl    = document.getElementById('downloadBtn');

  // Map init
  const map = L.map('map', { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Default view (Suisse) until a trace is loaded
  map.setView([46.8, 7.15], 11);

  let currentLayer = null;

  function formatMeta(t) {
    const parts = [];
    if (typeof t.distance_km !== 'undefined') parts.push(`${t.distance_km} km`);
    if (typeof t.dplus_m !== 'undefined') parts.push(`D+ ${t.dplus_m} m`);
    if (t.difficulty) parts.push(`${t.difficulty}`);
    return parts.join(" • ");
  }

  function gpxUrl(file) {
    return "{{ '/assets/gpx/' | relative_url }}" + file;
  }

  function setActive(buttonEl) {
    [...document.querySelectorAll('.trace-item')].forEach(el => el.classList.remove('is-active'));
    buttonEl.classList.add('is-active');
  }

  function loadTrace(trace, buttonEl) {
    if (buttonEl) setActive(buttonEl);

    elTitle.textContent = trace.title || trace.file;
    const meta = formatMeta(trace);
    elMeta.textContent = meta ? meta : '';
    if (trace.description) {
      elMeta.textContent = meta ? (meta + " — " + trace.description) : trace.description;
    }

    const url = gpxUrl(trace.file);

    // Download button
    elDl.href = url;
    elDl.style.pointerEvents = 'auto';
    elDl.style.opacity = '1';

    // Remove previous layer
    if (currentLayer) {
      map.removeLayer(currentLayer);
      currentLayer = null;
    }

    // Load GPX
    currentLayer = new L.GPX(url, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      }
    })
    .on('loaded', function(e) {
      const bounds = e.target.getBounds();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    })
    .on('error', function(err) {
      console.error('GPX load error', err);
      alert("Impossible de charger ce GPX. Vérifie le fichier et son chemin.");
    })
    .addTo(map);
  }

  function renderList() {
    if (!TRACES || !TRACES.length) {
      elList.innerHTML = `
        <div class="card">
          <p style="margin:0;">
            Aucun tracé n’est encore configuré.
            Ajoute des fichiers dans <code>assets/gpx</code> et référence-les dans <code>_data/gpx_traces.yml</code>.
          </p>
        </div>
      `;
      return;
    }

    elList.innerHTML = TRACES.map((t, idx) => {
      const title = t.title || t.file;
      const meta = formatMeta(t);
      return `
        <button class="trace-item" type="button" data-index="${idx}">
          <div class="trace-title">${title}</div>
          ${meta ? `<div class="trace-meta">${meta}</div>` : ``}
        </button>
      `;
    }).join('');

    // Bind clicks
    [...elList.querySelectorAll('.trace-item')].forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.index);
        loadTrace(TRACES[i], btn);
      });
    });

    // Auto-load first trace
    const firstBtn = elList.querySelector('.trace-item');
    if (firstBtn) firstBtn.click();
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
