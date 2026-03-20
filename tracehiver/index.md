---
layout: default
title: Tracées hivernaux
permalink: /tracehiver/
---

# Tracées hivernaux

Choisis un tracé pour l'afficher sur la carte, puis télécharge le fichier GPX si tu veux l'importer dans ta montre (Garmin/Coros/Suunto), Strava, Komoot, etc.

<div class="traces-layout">
  <aside class="traces-panel">
    <div class="traces-panel-header">
      <h2>Liste des tracés</h2>
      <p class="muted">Les GPX sont hébergés sur GitHub.</p>
    </div>
    <div class="traces-list" id="tracesList"></div>
  </aside>

  <section class="traces-map">
    <div class="traces-map-header">
      <div>
        <h2 id="traceTitle">Sélectionne un tracé</h2>
        <div class="trace-stats" id="traceStats"></div>
      </div>
      <div class="traces-actions">
        <a class="btn btn-outline" id="downloadBtn" href="#" download style="pointer-events:none;opacity:.5;">
          ⬇ Télécharger GPX
        </a>
      </div>
    </div>

    <div id="map" class="map-box"></div>
    <div id="elevationChart" class="elevation-chart"></div>
  </section>
</div>

<script>
const TRACES = {{ site.data.gpx_traces | jsonify }};

const elList     = document.getElementById('tracesList');
const elTitle    = document.getElementById('traceTitle');
const elStats    = document.getElementById('traceStats');
const elDl       = document.getElementById('downloadBtn');
const elElevChart = document.getElementById('elevationChart');

const map = L.map('map', { preferCanvas: true, renderer: L.canvas() });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
map.setView([46.8, 7.15], 11);

let currentLayer = null;

/* ---- Helpers ---- */

function gpxUrl(trace) {
  if (/^https?:\/\//.test(trace.file)) return trace.file;
  const base = "{{ '/assets/gpx/' | relative_url }}".replace(/\/?$/, '/');
  return base + trace.file.replace(/^\//, '');
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2
          + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function parseGpx(gpxText) {
  const xml = new DOMParser().parseFromString(gpxText, "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("GPX invalide");

  const pts = [...xml.getElementsByTagName("trkpt"), ...xml.getElementsByTagName("rtept")];
  const latlngs = [], elevations = [], distPoints = [];
  let distKm = 0;

  for (const p of pts) {
    const lat = parseFloat(p.getAttribute("lat"));
    const lon = parseFloat(p.getAttribute("lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

    if (latlngs.length > 0) {
      const prev = latlngs[latlngs.length - 1];
      distKm += haversineKm(prev[0], prev[1], lat, lon);
    }

    const eleEl = p.getElementsByTagName("ele")[0];
    const ele = eleEl ? parseFloat(eleEl.textContent) : null;

    latlngs.push([lat, lon]);
    elevations.push(Number.isFinite(ele) ? ele : null);
    distPoints.push(distKm);
  }

  let dplus = 0, dminus = 0;
  for (let i = 1; i < elevations.length; i++) {
    if (elevations[i] === null || elevations[i-1] === null) continue;
    const diff = elevations[i] - elevations[i-1];
    if (diff > 0.5) dplus += diff;
    else if (diff < -0.5) dminus -= diff;
  }

  return {
    latlngs, elevations, distPoints,
    distKm,
    dplus: Math.round(dplus),
    dminus: Math.round(dminus)
  };
}

/* ---- Elevation chart (SVG) ---- */

function drawElevation(distPoints, elevations) {
  const pairs = distPoints
    .map((d, i) => [d, elevations[i]])
    .filter(([, e]) => e !== null);

  if (pairs.length < 2) { elElevChart.innerHTML = ''; return; }

  const W = 800, H = 130;
  const PAD = { top: 12, right: 16, bottom: 28, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxDist = pairs[pairs.length - 1][0];
  const elevs   = pairs.map(p => p[1]);
  const minE    = Math.min(...elevs);
  const maxE    = Math.max(...elevs);
  const rangeE  = maxE - minE || 1;

  const px = d => PAD.left + (d / maxDist) * innerW;
  const py = e => PAD.top + (1 - (e - minE) / rangeE) * innerH;

  const linePath = pairs.map(([d, e], i) => `${i === 0 ? 'M' : 'L'}${px(d).toFixed(1)},${py(e).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${px(maxDist).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`;

  /* Axe Y : 3 repères */
  const yTicks = [minE, minE + rangeE / 2, maxE].map(e => ({
    e, y: py(e), label: Math.round(e) + ' m'
  }));

  /* Axe X : ~5 repères */
  const xSteps = Math.min(5, Math.floor(maxDist));
  const xTicks = Array.from({ length: xSteps + 1 }, (_, i) => {
    const d = (maxDist / xSteps) * i;
    return { d, x: px(d), label: d.toFixed(1) + ' km' };
  });

  elElevChart.innerHTML = `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="elevation-svg">
  <defs>
    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#d93200" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#d93200" stop-opacity="0.04"/>
    </linearGradient>
  </defs>

  <!-- Zone remplie -->
  <path d="${areaPath}" fill="url(#elevGrad)"/>
  <!-- Ligne -->
  <path d="${linePath}" fill="none" stroke="#d93200" stroke-width="2" stroke-linejoin="round"/>

  <!-- Axe Y -->
  ${yTicks.map(t => `
    <line x1="${PAD.left}" y1="${t.y.toFixed(1)}" x2="${(PAD.left + innerW).toFixed(1)}" y2="${t.y.toFixed(1)}"
          stroke="rgba(16,24,40,0.08)" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="${(PAD.left - 6).toFixed(1)}" y="${t.y.toFixed(1)}" text-anchor="end" dominant-baseline="middle"
          font-size="11" fill="#667085">${t.label}</text>
  `).join('')}

  <!-- Axe X -->
  ${xTicks.map(t => `
    <line x1="${t.x.toFixed(1)}" y1="${PAD.top}" x2="${t.x.toFixed(1)}" y2="${(PAD.top + innerH).toFixed(1)}"
          stroke="rgba(16,24,40,0.06)" stroke-width="1"/>
    <text x="${t.x.toFixed(1)}" y="${(PAD.top + innerH + 14).toFixed(1)}" text-anchor="middle"
          font-size="11" fill="#667085">${t.label}</text>
  `).join('')}
</svg>`;
}

/* ---- Afficher les stats ---- */

function renderStats({ distKm, dplus, dminus }) {
  elStats.innerHTML = `
    <span class="trace-stat">📏 ${distKm.toFixed(1)} km</span>
    <span class="trace-stat">⬆ ${dplus} m</span>
    <span class="trace-stat">⬇ ${dminus} m</span>
  `;
}

/* ---- Charger un tracé ---- */

function setActive(btn) {
  elList.querySelectorAll('.trace-item').forEach(el => el.classList.remove('is-active'));
  btn.classList.add('is-active');
}

async function loadTrace(trace, btn) {
  if (btn) setActive(btn);

  elTitle.textContent = trace.title || trace.file;
  elStats.innerHTML = '<span class="muted">Chargement…</span>';
  elElevChart.innerHTML = '';

  const url = gpxUrl(trace);
  elDl.href = url;
  elDl.style.pointerEvents = 'auto';
  elDl.style.opacity = '1';

  if (currentLayer) { map.removeLayer(currentLayer); currentLayer = null; }

  let gpxData;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();
    gpxData = parseGpx(txt);
  } catch (err) {
    elStats.innerHTML = `<span class="muted">Erreur : ${err.message}</span>`;
    /* Fallback sur les données YAML si disponibles */
    if (trace.distance_km || trace.dplus_m) {
      elStats.innerHTML = `
        <span class="trace-stat">📏 ${trace.distance_km ?? '—'} km</span>
        <span class="trace-stat">⬆ ${trace.dplus_m ?? '—'} m</span>
      `;
    }
    return;
  }

  const { latlngs, elevations, distPoints, distKm, dplus, dminus } = gpxData;

  if (latlngs.length < 2) {
    elStats.innerHTML = '<span class="muted">GPX vide ou illisible.</span>';
    return;
  }

  /* Attendre que la carte soit bien initialisée */
  await new Promise(requestAnimationFrame);
  map.invalidateSize(false);

  currentLayer = L.polyline(latlngs, { color: '#d93200', weight: 4, opacity: 0.9, noClip: true }).addTo(map);
  map.fitBounds(currentLayer.getBounds(), { padding: [24, 24], animate: false });

  renderStats({ distKm, dplus, dminus });
  drawElevation(distPoints, elevations);
}

/* ---- Rendu de la liste ---- */

function renderList() {
  if (!TRACES || !TRACES.length) {
    elList.innerHTML = '<p class="muted">Aucun tracé configuré.</p>';
    return;
  }

  elList.innerHTML = TRACES.map((t, idx) => `
    <button class="trace-item" type="button" data-index="${idx}">
      <div class="trace-title">${t.title || t.file}</div>
      ${t.distance_km ? `<div class="trace-item-meta">📏 ${t.distance_km} km${t.dplus_m ? ' · ⬆ ' + t.dplus_m + ' m' : ''}</div>` : ''}
    </button>
  `).join('');

  elList.querySelectorAll('.trace-item').forEach(btn => {
    btn.addEventListener('click', () => loadTrace(TRACES[Number(btn.dataset.index)], btn));
  });

  elList.querySelector('.trace-item')?.click();
}

renderList();
</script>
