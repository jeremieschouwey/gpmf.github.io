---
layout: default
title: Programme 2026
permalink: /programme/
---

# Programme 2026

<p>Navigue mois par mois et clique sur une date pour afficher le détail de la séance.</p>

<div class="cal-toolbar">
  <button id="calPrev" class="btn btn-ghost" type="button">◀ Mois précédent</button>
  <div id="calTitle" class="cal-title"></div>
  <button id="calNext" class="btn btn-ghost" type="button">Mois suivant ▶</button>
</div>

<div id="calGrid" class="cal-grid"></div>

<div id="calDetails" class="cal-details">
  <p>Sélectionne une date dans le calendrier.</p>
</div>

<section class="training-notes">
  <h2>Conseils d’entraînement sur 20 semaines</h2>

  <p>
    Chaque semaine, nous vous proposons un entraînement en groupe, très spécifique, avec des exercices effectués régulièrement
    dans le domaine de la résistance (haute intensité). Un entraînement dans la zone de résistance correspond à un effort
    « un peu dur » à « dur » (mais pas « très dur ») ; il est plus exigeant et le temps de récupération pour le corps est plus long.
  </p>

  <p>
    Il est conseillé de faire un entraînement de course à pied en résistance par semaine (éventuellement deux pour les compétiteurs,
    s’ils n’ont pas de course en vue la même semaine).
  </p>

  <p>
    Nous vous recommandons de pratiquer individuellement un entraînement supplémentaire qui devrait s’accomplir en endurance
    (basse intensité), c’est-à-dire que l’effort devrait être « facile » à « un peu difficile ». Vous pouvez l’organiser à votre convenance.
    Chaque séance de course peut être remplacée par la pratique d’un autre sport ou de la musculation.
  </p>

  <p>
    Si vous avez prévu une compétition le week-end, évitez de faire un entraînement intensif la semaine avant et après la compétition.
  </p>

  <p>
    La durée de l’entraînement indiquée est une suggestion. Même si vous n’avez que 30 minutes à disposition, cela vaut la peine d’en profiter.
    Par contre, de trop longues et répétées sorties sont inefficaces et usent inutilement le corps.
  </p>

  <div class="two-cols">
    <div class="note-card">
      <h3>Pratique d’un autre sport</h3>
      <p>
        Aquajogging ou aquagym, vélo ou VTT, natation, walking / nordic-walking ou marche en montagne, parcours-vita, fitness,
        spinning, sport d’équipe, inline, planche à voile, ski, tai-chi, etc.
      </p>
    </div>

    <div class="note-card">
      <h3>Séances de récupération</h3>
      <p>
        Stretching, exercices de mobilité, massage, méthode de relaxation, exercices de respiration, bains thermaux (ou bain tout court),
        sieste, yoga, etc.
      </p>
    </div>
  </div>

  <div class="note-card">
    <h3>Intensité I</h3>
    <p>
      L’intensité de l’entraînement du mercredi est donnée pour chaque semaine en se référant à l’échelle de Borg.
    </p>
    <p class="quote">
      N’oubliez pas de rire, ça muscle les abdominaux.
    </p>
  </div>

  <h2>L’échelle de perception de Borg</h2>

  <p>
    Cette méthode repose sur les sensations physiques qu’une personne ressent pendant l’effort physique : augmentation de la fréquence cardiaque,
    du rythme respiratoire, de la transpiration et de la fatigue musculaire. Bien que cette mesure soit subjective, une estimation de l’effort perçu
    peut fournir une assez bonne évaluation de l’intensité réelle pendant l’effort.
  </p>

  <h3>Procédure</h3>
  <p>
    Le but est de mesurer votre perception de l’effort pendant l’entraînement. Votre perception doit traduire la difficulté et l’intensité de l’effort,
    en tenant aussi compte de la fatigue musculaire ou générale ressentie. Essayez de vous concentrer sur le ressenti global de votre effort.
  </p>

  <p>
    Lors de l’entraînement, essayez d’ajuster l’effort par rapport au requis dans le plan d’entraînement. Ceci vous permet de progresser pendant
    les 20 semaines de la préparation au Morat-Fribourg.
  </p>

  <h3>L’échelle de Borg (résumé)</h3>
  <div class="table-wrap">
    <table class="borg">
      <thead>
        <tr>
          <th>Note</th>
          <th>Perception de l’intensité</th>
          <th>Intensité (%)</th>
          <th>Capacité de parler</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>6</td>
          <td>Échauffement / retour au calme</td>
          <td></td>
          <td>Chanter sans interruption est possible</td>
        </tr>
        <tr>
          <td>7–9</td>
          <td>Très très léger / très léger</td>
          <td>40%</td>
          <td></td>
        </tr>
        <tr>
          <td>10</td>
          <td>Très léger / facile</td>
          <td>50%</td>
          <td>Discuter sans interruption est possible</td>
        </tr>
        <tr>
          <td>11–12</td>
          <td>Un peu fatigant</td>
          <td>60%</td>
          <td>Zone endurance (aérobie)</td>
        </tr>
        <tr>
          <td>13–14</td>
          <td>Moyennement difficile</td>
          <td>70%</td>
          <td>Discuter avec intermittence est possible</td>
        </tr>
        <tr>
          <td>15–16</td>
          <td>Pénible / difficile</td>
          <td>80%</td>
          <td>Zone effort intensif (anaérobie)</td>
        </tr>
        <tr>
          <td>17</td>
          <td>Très pénible / très difficile</td>
          <td></td>
          <td>Plus de discussion possible</td>
        </tr>
        <tr>
          <td>18</td>
          <td>Très fatigant</td>
          <td>90%</td>
          <td></td>
        </tr>
        <tr>
          <td>19–20</td>
          <td>Très, très fatigant → exténuant</td>
          <td>100%</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


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

  // Indexer les séances par date YYYY-MM-DD
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

    const headers = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay.getDay() + 6) % 7; // lun=0 ... dim=6

    let html = "";
    html += `<div class="cal-row cal-head">${
      headers.map(h => `<div class="cal-cell cal-headcell">${h}</div>`).join("")
    }</div>`;

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

    elGrid.querySelectorAll("button[data-date]").forEach(btn => {
      btn.addEventListener("click", () => showDetails(btn.getAttribute("data-date")));
    });

    // Afficher automatiquement la première séance du mois si elle existe
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
      elDetails.innerHTML = `<p>Aucune séance le ${escapeHtml(key)}.</p>`;
      return;
    }

    const meta = ev.meta || {};
    const levels = Array.isArray(meta.levels) ? meta.levels : [];
    const intensity = meta.intensity || null;
    const mercredi = meta.mercredi || {};
    const supplementaires = meta.supplementaires || {};
    const conseil = meta.conseil || "";

    const intensityHtml =
      intensity && (intensity.I || intensity.percent)
        ? `<div class="badge-row">
             <span class="badge">Semaine ${escapeHtml(ev.week)}</span>
             <span class="badge badge-soft">Intensité: ${
               [intensity.I ? `I ${escapeHtml(intensity.I)}` : "", intensity.percent ? escapeHtml(intensity.percent) : ""]
                 .filter(Boolean).join(" — ")
             }</span>
           </div>`
        : `<div class="badge-row"><span class="badge">Semaine ${escapeHtml(ev.week)}</span></div>`;

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

    const conseilHtml = conseil
      ? `
        <div class="advice">
          <div class="advice-title">Conseil</div>
          <div class="advice-body">${formatMultiline(conseil)}</div>
        </div>
      `
      : "";

    const fallbackDescription = (!levels.length && ev.description)
      ? `<div class="block">
           <div class="block-title">Détails</div>
           <div class="block-body">${formatMultiline(ev.description)}</div>
         </div>`
      : "";

    elDetails.innerHTML = `
      <h2>${escapeHtml(ev.title || "Séance")}</h2>

      ${intensityHtml}

      <div class="details-meta">
        <div><strong>${escapeHtml(ev.date_human || "")}</strong></div>
        <div>${escapeHtml(ev.time || "")} (${escapeHtml(String(ev.duration_minutes || ""))} min)</div>
        <div>${escapeHtml(ev.location || "")}</div>
      </div>

      ${levelCards ? `<div class="levels-grid">${levelCards}</div>` : ""}
      ${conseilHtml}
      ${fallbackDescription}
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
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function formatMultiline(text) {
    return escapeHtml(String(text)).replace(/\r?\n/g, "<br/>");
  }

  render();
})();
</script>

