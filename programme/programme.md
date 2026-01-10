---
layout: default
title: Programme 2026
permalink: /programme/
---

# Programme 2026

<p>Navigue mois par mois et clique sur une date pour afficher le détail de la séance.</p>

<div class="cal-toolbar">
  <button id="calPrev" class="btn" type="button">◀ Mois précédent</button>
  <div id="calTitle" class="cal-title"></div>
  <button id="calNext" class="btn" type="button">Mois suivant ▶</button>
</div>

<div id="calGrid" class="cal-grid"></div>

<div id="calDetails" class="cal-details">
  <p>Sélectionne une date dans le calendrier.</p>
</div>

<script>
(async () => {
  const API_ALL = "https://gpmf-calendar.jeremieschouwey.workers.dev/api/calendar.all.json";

  const elTitle = document.getElementById("calTitle");
  const elGrid = document.getElementById("calGrid");
  const elDetails = document.getElementById("calDetails");
  const btnPrev = document.getElementById("calPrev");
  const btnNext = document.getElementById("calNext");

  // Charge toutes les séances (20 semaines)
  let data;
  try {
    const res = await fetch(API_ALL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    data = await res.json();
  } catch (e) {
    elGrid.innerHTML = "<p>Impossible de charger le programme.</p>";
    return;
  }

  // Indexer les séances par date YYYY-MM-DD (heure locale selon l'ISO renvoyé)
  const byDate = new Map();
  for (const w of (data.weeks || [])) {
    const d = new Date(w.date_iso);
    const key = ymdLocal(d);
    byDate.set(key, w);
  }

  // Mois courant affiché (par défaut : mois de la prochaine séance si elle existe, sinon mois actuel)
  const now = new Date();
  const next = (data.weeks || []).find(w => new Date(w.date_iso).getTime() >= Date.now());
  let currentMonth = next ? new Date(next.date_iso) : now;
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

  btnPrev.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    render();
  });
  btnNext.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    render();
  });

  function render() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0..11

    elTitle.textContent = monthNameFR(month) + " " + year;

    // En-têtes jours
    const headers = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    // Calcul grille
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // JS: getDay() => 0=dim...6=sam ; nous voulons lun=0...dim=6
    const offset = (firstDay.getDay() + 6) % 7;

    // Construction HTML
    let html = "";
    html += `<div class="cal-row cal-head">${headers.map(h => `<div class="cal-cell cal-headcell">${h}</div>`).join("")}</div>`;

    let day = 1;
    for (let row = 0; row < 6; row++) {
      let rowHtml = "";
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        if (cellIndex < offset || day > daysInMonth) {
          rowHtml += `<div class="cal-cell cal-empty"></div>`;
          continue;
        }

        const dateObj = new Date(year, month, day);
        const key = ymdLocal(dateObj);
        const hasEvent = byDate.has(key);

        rowHtml += `
          <button class="cal-cell cal-day ${hasEvent ? "cal-event" : ""}" type="button" data-date="${key}">
            <div class="cal-daynum">${day}</div>
            ${hasEvent ? `<div class="cal-dot" aria-label="Séance"></div>` : ``}
          </button>
        `;
        day++;
      }

      html += `<div class="cal-row">${rowHtml}</div>`;
      if (day > daysInMonth) break;
    }

    elGrid.innerHTML = html;

    // Bind click
    elGrid.querySelectorAll("button[data-date]").forEach(btn => {
      btn.addEventListener("click", () => showDetails(btn.getAttribute("data-date")));
    });

    // Si une séance existe dans le mois affiché, afficher automatiquement la première
    const firstEventKeyInMonth = [...byDate.keys()].find(k => {
      const d = new Date(k + "T00:00:00");
      return d.getFullYear() === year && d.getMonth() === month;
    });
    if (firstEventKeyInMonth) showDetails(firstEventKeyInMonth);
    else elDetails.innerHTML = "<p>Aucune séance planifiée sur ce mois.</p>";
  }

  function showDetails(key) {
  const ev = byDate.get(key);
  if (!ev) {
    elDetails.innerHTML = `<p>Aucune séance le ${key}.</p>`;
    return;
  }

  const meta = ev.meta || {};
  const levels = Array.isArray(meta.levels) ? meta.levels : [];
  const intensity = meta.intensity || null;
  const mercredi = meta.mercredi || {};
  const supplementaires = meta.supplementaires || {};
  const conseil = meta.conseil || "";

  const intensityLine = (intensity && (intensity.I || intensity.percent))
    ? `<div class="badge-row">
         <span class="badge">Semaine ${escapeHtml(ev.week)}</span>
         <span class="badge badge-soft">Intensité: ${[
           intensity.I ? `I ${escapeHtml(intensity.I)}` : "",
           intensity.percent ? escapeHtml(intensity.percent) : ""
         ].filter(Boolean).join(" — ")}</span>
       </div>`
    : `<div class="badge-row"><span class="badge">Semaine ${escapeHtml(ev.week)}</span></div>`;

  // Cartes par niveau
  const levelCards = levels.length
    ? levels.map(lvl => {
        const wTxt = typeof mercredi[lvl.id] === "string" ? mercredi[lvl.id] : "";
        const sTxt = typeof supplementaires[lvl.id] === "string" ? supplementaires[lvl.id] : "";

        return `
          <div class="level-card">
            <div class="level-title">${escapeHtml(lvl.label)}</div>

            <div class="block">
              <div class="block-title">Séance du mercredi</div>
              <div class="block-body">${formatMultiline(wTxt || "À définir")}</div>
            </div>

            <div class="block">
              <div class="block-title">Séances supplémentaires</div>
              <div class="block-body">${formatMultiline(sTxt || "À définir")}</div>
            </div>
          </div>
        `;
      }).join("")
    : "";

  // Conseil
  const conseilHtml = conseil
    ? `
      <div class="advice">
        <div class="advice-title">Conseil</div>
        <div class="advice-body">${formatMultiline(conseil)}</div>
      </div>
    `
    : "";

  // Fallback si jamais meta est absent (ou vide)
  const fallbackDescription = (!levels.length && ev.description)
    ? `<div class="block"><div class="block-title">Détails</div><div class="block-body">${formatMultiline(ev.description)}</div></div>`
    : "";

  elDetails.innerHTML = `
    <h2>${escapeHtml(ev.title)}</h2>

    ${intensityLine}

    <div class="details-meta">
      <div><strong>${escapeHtml(ev.date_human)}</strong></div>
      <div>${escapeHtml(ev.time)} (${escapeHtml(String(ev.duration_minutes))} min)</div>
      <div>${escapeHtml(ev.location || "")}</div>
    </div>

    ${levelCards ? `<div class="levels-grid">${levelCards}</div>` : ""}
    ${conseilHtml}
    ${fallbackDescription}
  `;
}


    const prog = (ev.program || []).filter(Boolean);
    elDetails.innerHTML = `
      <h2>${escapeHtml(ev.title)}</h2>
      <p><strong>Semaine ${ev.week}</strong><br/>
      ${escapeHtml(ev.date_human)} — ${escapeHtml(ev.time)} (${ev.duration_minutes} min)<br/>
      ${escapeHtml(ev.location)}</p>
      ${ev.description ? `<p>${escapeHtml(ev.description)}</p>` : ""}
      ${prog.length ? `<h3>Programme</h3><ul>${prog.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : "<p>Programme à définir.</p>"}
    `;
  }

  function ymdLocal(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function monthNameFR(m) {
    return ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][m];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  }

  render();
})();

function formatMultiline(text) {
  // Convertit les retours ligne en <br> et échappe le HTML
  return escapeHtml(String(text)).replace(/\r?\n/g, "<br/>");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

</script>
