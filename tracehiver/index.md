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

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>

<!-- GPX loader (CDN jsDelivr) -->
<script src="https://unpkg.com/leaflet-gpx@1.7.0/leaflet-gpx.js"></script>


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
    const base = "{{ '/assets/gpx/' | relative_url }}";
    return base.replace(/\/?$/, '/') + file.replace(/^\//, '');
  }

  function setActive(buttonEl) {
    [...document.querySelectorAll('.trace-item')].forEach(el => el.classList.remove('is-active'));
    buttonEl.classList.add('is-active');
  }

  // === TEST 1: scan GPX for invalid points (robust XML parser) ===
  async function scanGpxForInvalidPoints(url) {
    const res = await fetch(url, { cache: 'no-store' });
    console.log('[GPX scan] fetch', url, '->', res.status);

    const txt = await res.text();
    console.log('[GPX scan] first chars:', txt.slice(0, 120));

    const xml = new DOMParser().parseFromString(txt, "application/xml");
    const parseError = xml.querySelector("parsererror");
    if (parseError) {
      console.error('[GPX scan] XML parse error:', parseError.textContent);
      return;
    }

    const pts = [
      ...xml.getElementsByTagName("trkpt"),
      ...xml.getElementsByTagName("rtept")
    ];

    let total = 0, bad = 0;
    const samples = [];

    for (const p of pts) {
      total++;
      const lat = parseFloat(p.getAttribute("lat"));
      const lon = parseFloat(p.getAttribute("lon"));
      const ok = Number.isFinite(lat) && Number.isFinite(lon);
      if (!ok) {
        bad++;
        if (samples.length < 5) samples.push(p.outerHTML.slice(0, 160) + "...");
      }
    }

    console.log('[GPX scan] points:', total, 'bad:', bad);
    if (bad) console.warn('[GPX scan] bad samples:', samples);
    if (!total) console.warn('[GPX scan] no trkpt/rtept found at all');
  }

  async function loadTrace(trace, buttonEl) {
    if (buttonEl) setActive(buttonEl);

    elTitle.textContent = trace.title || trace.file;
    elMeta.textContent = '';

    const url = gpxUrl(trace.file);
    elDl.href = url;
    elDl.style.pointerEvents = 'auto';
    elDl.style.opacity = '1';

    if (currentLayer) {
      map.removeLayer(currentLayer);
      currentLayer = null;
    }

    // === TEST 1 execution ===
    try {
      await scanGpxForInvalidPoints(url);
    } catch (e) {
      console.error('[GPX scan] failed:', e);
    }

    // Debug plugin presence
    console.log('[DEBUG] Leaflet version:', L && L.version);
    console.log('[DEBUG] typeof L.GPX:', typeof (L && L.GPX));

    currentLayer = new L.GPX(url, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        opacity: 0.9,
        weight: 5
      }
    })
    .on('loaded', function(e) {
      const bounds = e.target.getBounds();
      if (bounds && bounds.isValid && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20], animate: false });
      }
    })
    .on('error', function(err) {
      console.error('GPX parse/load error', err);
      alert("Impossible de charger ce GPX. Vérifie le fichier et la console.");
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

  .muted{ color: var(--muted); }
</style>
