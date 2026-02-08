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

<script>
  const TRACES = {{ site.data.gpx_traces | jsonify }};

  const elList  = document.getElementById('tracesList');
  const elTitle = document.getElementById('traceTitle');
  const elMeta  = document.getElementById('traceMeta');
  const elDl    = document.getElementById('downloadBtn');

 const map = L.map('map', {
  zoomAnimation: false,
  fadeAnimation: false,
  preferCanvas: true,
  renderer: L.canvas()
});

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

  function parseGpxToLatLngs(gpxText) {
  const xml = new DOMParser().parseFromString(gpxText, "application/xml");
  const parseError = xml.querySelector("parsererror");
  if (parseError) throw new Error("GPX XML parse error");

  const pts = [
    ...xml.getElementsByTagName("trkpt"),
    ...xml.getElementsByTagName("rtept")
  ];

  const latlngs = [];
  for (const p of pts) {
    const lat = parseFloat(p.getAttribute("lat"));
    const lon = parseFloat(p.getAttribute("lon"));

    // Filtrage strict
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat < -90 || lat > 90) continue;
    if (lon < -180 || lon > 180) continue;

    latlngs.push([lat, lon]);
  }
  return latlngs;
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

  console.log('[GPX] fetch:', url);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    alert("Impossible de charger le GPX (HTTP " + res.status + ")");
    return;
  }

  const txt = await res.text();
  const latlngs = parseGpxToLatLngs(txt);
  console.log('[GPX] points valid:', latlngs.length);

  if (latlngs.length < 2) {
    alert("GPX chargé mais aucun point exploitable (trkpt/rtept).");
    return;
  }

  // --- Stabiliser la map avant addLayer (important) ---
  await new Promise(requestAnimationFrame);
  map.invalidateSize(true);

  const size = map.getSize();
  console.log('[MAP] size:', size);
  if (!size || size.x === 0 || size.y === 0) {
    console.warn('[MAP] size is 0, retry in 200ms');
    setTimeout(() => loadTrace(trace, buttonEl), 200);
    return;
  }

  // Dessin: noClip évite certains soucis de clipping
  currentLayer = L.polyline(latlngs, {
    weight: 5,
    opacity: 0.9,
    noClip: true
  }).addTo(map);

  map.fitBounds(currentLayer.getBounds(), { padding: [20, 20], animate: false });
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

  .traces-panel-header{ margin-bottom:10px; }

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
  .trace-title{ font-weight: 700; color: var(--text); }

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
