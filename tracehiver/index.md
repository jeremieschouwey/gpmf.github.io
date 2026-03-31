---
layout: default
title: Tracées hivernaux
permalink: /tracehiver/
uses_map: true
---

# Tracées hivernaux

Choisis un tracé pour l'afficher sur la carte, puis télécharge le fichier GPX si tu veux l'importer dans ta montre (Garmin/Coros/Suunto), Strava, Komoot, etc.

<div class="traces-layout">
  <aside class="traces-panel">
    <div class="traces-panel-header">
      <h2>Liste des tracés</h2>
      <p class="muted" id="tracesSubtitle">Chargement…</p>
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
const TRACES = [
  {% for trace in site.data.gpx_traces %}
  {
    title:      {{ trace.title | jsonify }},
    filename:   {{ trace.file | jsonify }},
    url:        {{ trace.file | prepend: '/assets/gpx/' | jsonify }},
    difficulty: {{ trace.difficulty | jsonify }},
    description:{{ trace.description | jsonify }}
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

document.addEventListener('DOMContentLoaded', async function () {

document.getElementById('tracesSubtitle').textContent =
  TRACES.length + ' tracé' + (TRACES.length > 1 ? 's' : '') + ' disponible' + (TRACES.length > 1 ? 's' : '');

const elList      = document.getElementById('tracesList');
const elTitle     = document.getElementById('traceTitle');
const elStats     = document.getElementById('traceStats');
const elDl        = document.getElementById('downloadBtn');
const elElevChart = document.getElementById('elevationChart');

const map = L.map('map', { preferCanvas: true, renderer: L.canvas() });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
map.setView([46.8, 7.15], 11);

let currentLayer  = null;
let hoverMarker   = null;
let currentLatlngs     = [];
let currentDistPoints  = [];

/* ---- Helpers ---- */

function gpxUrl(trace) {
  return trace.url || (API_BASE + '/api/gpx/' + encodeURIComponent(trace.filename));
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

/* ---- Elevation chart (SVG) avec interaction souris ---- */

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

  const yTicks = [minE, minE + rangeE / 2, maxE].map(e => ({
    e, y: py(e), label: Math.round(e) + ' m'
  }));

  const xSteps = Math.min(5, Math.floor(maxDist));
  const xTicks = Array.from({ length: xSteps + 1 }, (_, i) => {
    const d = (maxDist / xSteps) * i;
    return { d, x: px(d), label: d.toFixed(1) + ' km' };
  });

  elElevChart.innerHTML = `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="elevation-svg" style="cursor:crosshair">
  <defs>
    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#d93200" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#d93200" stop-opacity="0.04"/>
    </linearGradient>
  </defs>

  <path d="${areaPath}" fill="url(#elevGrad)"/>
  <path d="${linePath}" fill="none" stroke="#d93200" stroke-width="2" stroke-linejoin="round"/>

  ${yTicks.map(t => `
    <line x1="${PAD.left}" y1="${t.y.toFixed(1)}" x2="${(PAD.left + innerW).toFixed(1)}" y2="${t.y.toFixed(1)}"
          stroke="rgba(16,24,40,0.08)" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="${(PAD.left - 6).toFixed(1)}" y="${t.y.toFixed(1)}" text-anchor="end" dominant-baseline="middle"
          font-size="11" fill="#667085">${t.label}</text>
  `).join('')}

  ${xTicks.map(t => `
    <line x1="${t.x.toFixed(1)}" y1="${PAD.top}" x2="${t.x.toFixed(1)}" y2="${(PAD.top + innerH).toFixed(1)}"
          stroke="rgba(16,24,40,0.06)" stroke-width="1"/>
    <text x="${t.x.toFixed(1)}" y="${(PAD.top + innerH + 14).toFixed(1)}" text-anchor="middle"
          font-size="11" fill="#667085">${t.label}</text>
  `).join('')}

  <!-- Éléments interactifs (cachés par défaut) -->
  <line   class="h-vline" x1="0" y1="${PAD.top}" x2="0" y2="${PAD.top + innerH}"
          stroke="#d93200" stroke-width="1.5" stroke-dasharray="4 3" style="display:none"/>
  <circle class="h-dot"   r="5" fill="#d93200" stroke="white" stroke-width="2" style="display:none"/>
  <rect   class="h-bg"    width="96" height="32" rx="5"
          fill="white" stroke="rgba(217,50,0,0.3)" stroke-width="1" style="display:none"/>
  <text   class="h-txt1"  font-size="10.5" fill="#667085"  style="display:none"/>
  <text   class="h-txt2"  font-size="10.5" font-weight="700" fill="#101828" style="display:none"/>

  <!-- Zone de capture souris -->
  <rect class="h-hit" x="${PAD.left}" y="${PAD.top}" width="${innerW}" height="${innerH}" fill="transparent"/>
</svg>`;

  /* Références aux éléments SVG */
  const svg   = elElevChart.querySelector('svg');
  const hVline = svg.querySelector('.h-vline');
  const hDot   = svg.querySelector('.h-dot');
  const hBg    = svg.querySelector('.h-bg');
  const hTxt1  = svg.querySelector('.h-txt1');
  const hTxt2  = svg.querySelector('.h-txt2');

  svg.addEventListener('mousemove', (e) => {
    const rect   = svg.getBoundingClientRect();
    const svgX   = (e.clientX - rect.left) * (W / rect.width);
    const dist   = Math.max(0, Math.min(maxDist, (svgX - PAD.left) / innerW * maxDist));

    /* Point le plus proche dans le profil */
    let ci = 0, minDiff = Infinity;
    for (let i = 0; i < pairs.length; i++) {
      const diff = Math.abs(pairs[i][0] - dist);
      if (diff < minDiff) { minDiff = diff; ci = i; }
    }
    const [d, elev] = pairs[ci];
    const cx = px(d), cy = py(elev);

    /* Ligne verticale */
    hVline.setAttribute('x1', cx); hVline.setAttribute('x2', cx);
    hVline.style.display = '';

    /* Point sur la courbe */
    hDot.setAttribute('cx', cx); hDot.setAttribute('cy', cy);
    hDot.style.display = '';

    /* Tooltip (bascule gauche/droite selon la position) */
    const tipW = 96, tipX = (cx + tipW + 10 > W - PAD.right) ? cx - tipW - 6 : cx + 8;
    const tipY = PAD.top + 2;
    hBg.setAttribute('x', tipX);    hBg.setAttribute('y', tipY);    hBg.style.display = '';
    hTxt1.setAttribute('x', tipX + 8); hTxt1.setAttribute('y', tipY + 13);
    hTxt1.textContent = d.toFixed(2) + ' km'; hTxt1.style.display = '';
    hTxt2.setAttribute('x', tipX + 8); hTxt2.setAttribute('y', tipY + 25);
    hTxt2.textContent = Math.round(elev) + ' m'; hTxt2.style.display = '';

    /* Marqueur sur la carte : trouver le point GPS le plus proche en distance */
    if (currentLatlngs.length > 0) {
      let mi = 0, mDiff = Infinity;
      for (let i = 0; i < currentDistPoints.length; i++) {
        const diff = Math.abs(currentDistPoints[i] - d);
        if (diff < mDiff) { mDiff = diff; mi = i; }
      }
      const ll = currentLatlngs[mi];
      if (hoverMarker) {
        hoverMarker.setLatLng(ll);
      } else {
        hoverMarker = L.circleMarker(ll, {
          radius: 7, color: '#d93200', fillColor: '#d93200',
          fillOpacity: 1, weight: 2.5
        }).addTo(map);
      }
    }
  });

  svg.addEventListener('mouseleave', () => {
    [hVline, hDot, hBg, hTxt1, hTxt2].forEach(el => el.style.display = 'none');
    if (hoverMarker) { map.removeLayer(hoverMarker); hoverMarker = null; }
  });
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

  elTitle.textContent = trace.title || trace.filename;
  elStats.innerHTML = '<span class="muted">Chargement…</span>';
  elElevChart.innerHTML = '';

  const url = gpxUrl(trace);
  elDl.href = url;
  elDl.style.pointerEvents = 'auto';
  elDl.style.opacity = '1';

  if (currentLayer)  { map.removeLayer(currentLayer);  currentLayer  = null; }
  if (hoverMarker)   { map.removeLayer(hoverMarker);   hoverMarker   = null; }
  currentLatlngs = []; currentDistPoints = [];

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
  currentLatlngs    = latlngs;
  currentDistPoints = distPoints;

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

const difficultyLabel = { facile: '🟢 Facile', moyen: '🟡 Moyen', difficile: '🔴 Difficile' };

function renderList() {
  if (!TRACES || !TRACES.length) {
    elList.innerHTML = '<p class="muted">Aucun tracé disponible.</p>';
    return;
  }

  elList.innerHTML = TRACES.map((t, idx) => `
    <button class="trace-item" type="button" data-index="${idx}">
      <div class="trace-title">${t.title || t.filename}</div>
      ${t.difficulty ? `<div class="trace-item-meta">${difficultyLabel[t.difficulty] || t.difficulty}</div>` : ''}
      ${t.description ? `<div class="trace-item-meta">${t.description}</div>` : ''}
    </button>
  `).join('');

  elList.querySelectorAll('.trace-item').forEach(btn => {
    btn.addEventListener('click', () => loadTrace(TRACES[Number(btn.dataset.index)], btn));
  });

  elList.querySelector('.trace-item')?.click();
}

renderList();

}); // DOMContentLoaded
</script>
