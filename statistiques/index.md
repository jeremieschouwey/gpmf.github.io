---
layout: default
title: Statistiques
permalink: /statistiques/
---

# Statistiques

<p class="muted">
  Historique des présences GPMF par saison, avec vue d'ensemble, comparatif annuel et détail séance par séance.
</p>

<div id="statsApp">
  <p>Chargement des statistiques…</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
(async () => {
  const root = document.getElementById('statsApp');

  const fmtNumber = new Intl.NumberFormat('fr-CH', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  });
  const fmtDate = new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? iso : fmtDate.format(d);
  }

  function card(title, value, help = '') {
    return `
      <div class="card stat-card">
        <div class="stat-label">${escapeHtml(title)}</div>
        <div class="stat-value">${escapeHtml(value)}</div>
        ${help ? `<div class="stat-help">${escapeHtml(help)}</div>` : ''}
      </div>
    `;
  }

  function round1(value) {
    return Math.round((Number(value) || 0) * 10) / 10;
  }

  function computeSeasonSummary(season) {
    const sessions = Array.isArray(season.sessions) ? [...season.sessions] : [];
    sessions.sort((a, b) => String(a.date).localeCompare(String(b.date)));

    let seasonTotal = 0;
    let peakTotal = 0;
    let peakDate = null;
    const groupTotals = {};

    sessions.forEach(session => {
      const total = Number(session.total) || 0;
      seasonTotal += total;

      if (total > peakTotal) {
        peakTotal = total;
        peakDate = session.date || null;
      }

      const groups = session.groups && typeof session.groups === 'object' ? session.groups : {};
      Object.entries(groups).forEach(([name, value]) => {
        const n = Number(value) || 0;
        groupTotals[name] = (groupTotals[name] || 0) + n;
      });
    });

    return {
      session_count: sessions.length,
      season_total: seasonTotal,
      average_per_session: sessions.length ? round1(seasonTotal / sessions.length) : 0,
      peak_total: peakTotal,
      peak_date: peakDate,
      group_totals: groupTotals,
      sessions
    };
  }

  try {
    const res = await fetch('{{ "/assets/stats-gpmf.json" | relative_url }}', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    const seasonsRaw = Array.isArray(data.seasons) ? data.seasons : [];
    if (!seasonsRaw.length) {
      root.innerHTML = '<p>Aucune statistique disponible.</p>';
      return;
    }

    const seasonsSorted = seasonsRaw
      .map(season => ({ ...season, computedSummary: computeSeasonSummary(season) }))
      .sort((a, b) => a.year - b.year);

    const latestSeason = seasonsSorted[seasonsSorted.length - 1];
    const anomalies = Array.isArray(data.anomalies) ? data.anomalies : [];

    const allSessions = seasonsSorted.flatMap(season =>
      season.computedSummary.sessions.map(session => ({
        year: season.year,
        date: session.date,
        total: Number(session.total) || 0,
        intensity: session.intensity,
        remarks: session.remarks || '',
        groups: session.groups || {}
      }))
    );

    const globalSessionCount = allSessions.length;
    const globalParticipants = allSessions.reduce((sum, item) => sum + item.total, 0);
    const globalAverage = globalSessionCount ? round1(globalParticipants / globalSessionCount) : 0;
    const globalRecord = allSessions.reduce((best, current) => {
      if (!best || current.total > best.total) return current;
      return best;
    }, null);

    root.innerHTML = `
      <div class="grid stats-grid">
        <div class="col-3">${card('Saisons', fmtNumber.format(seasonsSorted.length), 'historique disponible')}</div>
        <div class="col-3">${card('Séances importées', fmtNumber.format(globalSessionCount), 'historique complet')}</div>
        <div class="col-3">${card('Moyenne globale', fmtNumber.format(globalAverage), 'participants par séance')}</div>
        <div class="col-3">${card('Record', fmtNumber.format(globalRecord?.total || 0), formatDate(globalRecord?.date))}</div>
      </div>

      <div class="grid" style="margin-top:16px;">
        <div class="col-6">
          <div class="card">
            <div class="card-title">
              <h3>Présences totales par saison</h3>
            </div>
            <div class="chart-box">
              <canvas id="seasonTotalsChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="card">
            <div class="card-title card-title-wrap">
              <h3>Détail d'une saison</h3>
              <label>
                <span class="muted" style="margin-right:8px;">Année</span>
                <select id="seasonPicker"></select>
              </label>
            </div>
            <div class="chart-box">
              <canvas id="seasonDetailChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="grid" style="margin-top:16px;">
        <div class="col-4">
          <div class="card">
            <div class="card-title"><h3>Résumé de la saison sélectionnée</h3></div>
            <div id="seasonSummary"></div>
          </div>
        </div>

        <div class="col-8">
          <div class="card">
            <div class="card-title"><h3>Top 10 des plus grosses affluences</h3></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rang</th>
                    <th>Date</th>
                    <th>Saison</th>
                    <th>Participants</th>
                  </tr>
                </thead>
                <tbody id="topSessionsBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="card-title"><h3 id="seasonTableTitle"></h3></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Intensité</th>
                <th>Remarques</th>
              </tr>
            </thead>
            <tbody id="seasonTableBody"></tbody>
          </table>
        </div>
      </div>

      ${anomalies.length ? `
        <div class="card" style="margin-top:16px; border-left: 4px solid var(--primary);">
          <div class="card-title"><h3>Points à vérifier dans l'import historique</h3></div>
          <ul style="margin:0; padding-left: 20px;">
            ${anomalies.map(item => `<li><strong>${escapeHtml(String(item.year_sheet))}</strong> : ${escapeHtml(item.issue)} — ex. ${escapeHtml((item.examples || []).join(', '))}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;

    const totalCtx = document.getElementById('seasonTotalsChart');
    new Chart(totalCtx, {
      type: 'line',
      data: {
        labels: seasonsSorted.map(s => s.year),
        datasets: [{
          label: 'Présences totales',
          data: seasonsSorted.map(s => s.computedSummary.season_total || 0),
          tension: 0.2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    [...allSessions]
      .sort((a, b) => (b.total - a.total) || String(a.date).localeCompare(String(b.date)))
      .slice(0, 10)
      .forEach((item, index) => {
        document.getElementById('topSessionsBody').insertAdjacentHTML('beforeend', `
          <tr>
            <td>${index + 1}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.year}</td>
            <td>${fmtNumber.format(item.total)}</td>
          </tr>
        `);
      });

    const picker = document.getElementById('seasonPicker');
    seasonsSorted.forEach(season => {
      picker.insertAdjacentHTML('beforeend', `<option value="${season.year}">${season.year}</option>`);
    });
    picker.value = String(latestSeason.year);

    let detailChart = null;

    function renderSeason(year) {
      const season = seasonsSorted.find(s => String(s.year) === String(year));
      if (!season) return;

      const sessions = season.computedSummary.sessions;
      const labels = sessions.map((s, i) => `S${i + 1}`);
      const totals = sessions.map(s => Number(s.total) || 0);
      const summary = season.computedSummary;
      const groups = Object.entries(summary.group_totals || {})
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => `<li><strong>${escapeHtml(name)}</strong> : ${fmtNumber.format(value)}</li>`)
        .join('');

      document.getElementById('seasonSummary').innerHTML = `
        <div class="stats-summary-list">
          <p><strong>Séances :</strong> ${fmtNumber.format(summary.session_count || 0)}</p>
          <p><strong>Total saison :</strong> ${fmtNumber.format(summary.season_total || 0)}</p>
          <p><strong>Moyenne :</strong> ${fmtNumber.format(summary.average_per_session || 0)}</p>
          <p><strong>Pic :</strong> ${fmtNumber.format(summary.peak_total || 0)} le ${formatDate(summary.peak_date)}</p>
          <div style="margin-top:12px;">
            <strong>Répartition cumulée par groupe</strong>
            ${groups ? `<ul style="margin:8px 0 0; padding-left:18px;">${groups}</ul>` : '<p class="muted" style="margin-top:8px;">Aucun détail par groupe disponible.</p>'}
          </div>
        </div>
      `;

      const ctx = document.getElementById('seasonDetailChart');
      if (detailChart) detailChart.destroy();
      detailChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: `Présences ${season.year}`,
            data: totals
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    function renderSeasonTable(year) {
      const season = seasonsSorted.find(s => String(s.year) === String(year));
      if (!season) return;

      document.getElementById('seasonTableTitle').textContent = `${season.year} — séances`;

      const body = document.getElementById('seasonTableBody');
      body.innerHTML = '';

      season.computedSummary.sessions.forEach(session => {
        body.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${formatDate(session.date)}</td>
            <td>${fmtNumber.format(Number(session.total) || 0)}</td>
            <td>${escapeHtml(session.intensity ?? '—')}</td>
            <td>${escapeHtml(session.remarks || '—')}</td>
          </tr>
        `);
      });
    }

    picker.addEventListener('change', e => {
      renderSeason(e.target.value);
      renderSeasonTable(e.target.value);
    });

    renderSeason(latestSeason.year);
    renderSeasonTable(latestSeason.year);

  } catch (err) {
    root.innerHTML = `<p>Impossible de charger les statistiques : ${escapeHtml(err.message)}</p>`;
  }
})();
</script>

<style>
.stats-grid .card,
.stat-card {
  height: 100%;
}

.stat-label {
  color: var(--muted);
  font-size: 0.95rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 6px;
}

.stat-help {
  color: var(--muted);
  margin-top: 4px;
}

.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.table-wrap th {
  font-size: 0.95rem;
}

.chart-box {
  position: relative;
  height: 320px;
  width: 100%;
}

.chart-box canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.stats-summary-list p {
  margin: 0 0 8px;
}

.card-title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 700px) {
  .chart-box {
    height: 260px;
  }

  .card-title-wrap {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
