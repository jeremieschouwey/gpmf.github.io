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

<div class="cal-lang" style="display:flex; gap:10px; justify-content:flex-end; margin: 8px 0 12px;">
  <button id="langFR" class="btn" type="button">FR</button>
  <button id="langDE" class="btn" type="button">DE</button>
</div>

<div style="margin:10px 0 18px 0; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
  <button id="calDownloadIcs" class="btn" type="button">Télécharger le programme (.ics)</button>
  <span class="muted">Importable dans Google Calendar, Apple Calendar, Outlook, etc.</span>
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
  // --- Sources ---
  const API_FR = "{{ '/assets/programme2026.fr.json' | relative_url }}";
  const API_DE = "{{ '/assets/programme2026.de.json' | relative_url }}";

  // --- DOM ---
  const elTitle = document.getElementById("calTitle");
  const elGrid = document.getElementById("calGrid");
  const elDetails = document.getElementById("calDetails");

  const btnPrev = document.getElementById("calPrev");
  const btnNext = document.getElementById("calNext");
  const btnIcs  = document.getElementById("calDownloadIcs");

  const btnFR = document.getElementById("langFR");
  const btnDE = document.getElementById("langDE");

  // --- i18n minimal (UI) ---
  const UI = {
    fr: {
      monthNames: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
      headers: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
      noProgram: "Impossible de charger le programme.",
      pickDate: "Sélectionne une date dans le calendrier.",
      noneThisMonth: "Aucune séance planifiée sur ce mois.",
      noneOnDate: (k) => `Aucune séance le ${k}.`,
      week: "Semaine",
      intensity: "Intensité",
      timeLabel: "Heure",
      durationLabel: "Durée",
      advice: "Conseil",
      wedSession: "Séance du mercredi",
      extraSessions: "Séances supplémentaires",
      details: "Détails",
      toDefine: "À définir",
      icsFilename: "gpmf-programme-2026-fr.ics",
      icsProdid: "-//GPMF//Programme 2026//FR"
    },
    de: {
      monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
      headers: ["Mo","Di","Mi","Do","Fr","Sa","So"],
      noProgram: "Das Programm konnte nicht geladen werden.",
      pickDate: "Wähle ein Datum im Kalender.",
      noneThisMonth: "In diesem Monat ist kein Training geplant.",
      noneOnDate: (k) => `Kein Training am ${k}.`,
      week: "Woche",
      intensity: "Intensität",
      timeLabel: "Uhrzeit",
      durationLabel: "Dauer",
      advice: "Tipp",
      wedSession: "Training am Mittwoch",
      extraSessions: "Zusätzliche Trainings",
      details: "Details",
      toDefine: "Noch festzulegen",
      icsFilename: "gpmf-programme-2026-de.ics",
      icsProdid: "-//GPMF//Programme 2026//DE"
    }
  };

  // --- State ---
  let currentLang = getLangFromUrlOrStorage();
  let data = null;
  let byDate = new Map();

  // --- Init UI ---
  setLangButtonsActive(currentLang);
  setPickDateText();

  // --- Load initial data ---
  try {
  data = await loadDataForLang(currentLang);
} catch (e) {
  elGrid.innerHTML = `<p>${escapeHtml(UI[currentLang].noProgram)}<br/><small>${escapeHtml(e.message || String(e))}</small></p>`;
  return;
}

  rebuildIndex();
  console.log("[programme] indexed dates =", byDate.size, "sample keys =", [...byDate.keys()].slice(0, 5));
console.log("[programme] first week object =", (data.weeks || [])[0]);
  

  // Mois courant affiché (par défaut : mois de la prochaine séance si elle existe, sinon mois actuel)
 const now = new Date();
const todayKey = ymdLocal(now);

// On trie les semaines par date_iso (string YYYY-MM-DD)
const sorted = [...(data.weeks || [])]
  .map(w => ({ w, iso: (w?.date_iso || "").toString().slice(0, 10) }))
  .filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.iso))
  .sort((a, b) => a.iso.localeCompare(b.iso));

const nextObj = sorted.find(x => x.iso >= todayKey);
const baseIso = (nextObj ? nextObj.iso : (sorted[0] ? sorted[0].iso : todayKey));

const y = parseInt(baseIso.slice(0, 4), 10);
const m = parseInt(baseIso.slice(5, 7), 10) - 1;

let currentMonth = new Date(y, m, 1);

  // --- Nav month ---
  btnPrev.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    render();
  });
  btnNext.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    render();
  });

  // --- Language buttons ---
  if (btnFR) btnFR.addEventListener("click", async () => {
    if (currentLang === "fr") return;
    await switchLang("fr");
  });
  if (btnDE) btnDE.addEventListener("click", async () => {
    if (currentLang === "de") return;
    await switchLang("de");
  });

  // --- ICS download ---
  if (btnIcs) {
    btnIcs.addEventListener("click", () => {
      const ics = buildIcsCalendar(data, currentLang);
      downloadTextFile(ics, UI[currentLang].icsFilename, "text/calendar;charset=utf-8");
    });
  }

  async function switchLang(lang) {
    currentLang = lang;
    setLang(lang);
    setLangButtonsActive(lang);

    try {
      data = await loadDataForLang(lang);
    } catch (e) {
      elGrid.innerHTML = `<p>${escapeHtml(UI[lang].noProgram)}</p>`;
      return;
    }

    rebuildIndex();
    setPickDateText();
    render();
  }

  function setPickDateText() {
    elDetails.innerHTML = `<p>${escapeHtml(UI[currentLang].pickDate)}</p>`;
  }

  function rebuildIndex() {
  byDate = new Map();

  for (const w of (data.weeks || [])) {
    if (!w) continue;

    // Accepte "YYYY-MM-DD" ou ISO complet, on normalise en "YYYY-MM-DD"
    const iso = (w.date_iso || "").toString().slice(0, 10);

    // On ignore les entrées invalides (évite NaN-NaN-NaN)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) continue;

    byDate.set(iso, w);
  }
}

  // --- Render calendar + details ---
  function render() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0..11

    elTitle.textContent = UI[currentLang].monthNames[month] + " " + year;

    const headers = UI[currentLang].headers;
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay.getDay() + 6) % 7; // lun=0 ... dim=6 (structure identique même en DE)

    let html = "";
    html += `<div class="cal-row cal-head">${
      headers.map(h => `<div class="cal-cell cal-headcell">${escapeHtml(h)}</div>`).join("")
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
            ${hasEvent ? `<div class="cal-dot" aria-label="Event"></div>` : ``}
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
    else elDetails.innerHTML = `<p>${escapeHtml(UI[currentLang].noneThisMonth)}</p>`;
  }

  function showDetails(key) {
    const ev = byDate.get(key);
    if (!ev) {
      elDetails.innerHTML = `<p>${escapeHtml(UI[currentLang].noneOnDate(escapeHtml(key)))}</p>`;
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
             <span class="badge">${escapeHtml(UI[currentLang].week)} ${escapeHtml(ev.week)}</span>
             <span class="badge badge-soft">${escapeHtml(UI[currentLang].intensity)}: ${
               [intensity.I ? `I ${escapeHtml(intensity.I)}` : "", intensity.percent ? escapeHtml(intensity.percent) : ""]
                 .filter(Boolean).join(" — ")
             }</span>
           </div>`
        : `<div class="badge-row"><span class="badge">${escapeHtml(UI[currentLang].week)} ${escapeHtml(ev.week)}</span></div>`;

    const levelCards = levels.length
      ? levels.map(lvl => {
          const wTxt = typeof mercredi[lvl.id] === "string" ? mercredi[lvl.id] : "";
          const sTxt = typeof supplementaires[lvl.id] === "string" ? supplementaires[lvl.id] : "";

          return `
            <div class="level-card">
              <div class="level-title">${escapeHtml(lvl.label)}</div>

              <div class="block">
                <div class="block-title">${escapeHtml(UI[currentLang].wedSession)}</div>
                <div class="block-body">${formatMultiline(wTxt || UI[currentLang].toDefine)}</div>
              </div>

              <div class="block">
                <div class="block-title">${escapeHtml(UI[currentLang].extraSessions)}</div>
                <div class="block-body">${formatMultiline(sTxt || UI[currentLang].toDefine)}</div>
              </div>
            </div>
          `;
        }).join("")
      : "";

    const conseilHtml = conseil
      ? `
        <div class="advice">
          <div class="advice-title">${escapeHtml(UI[currentLang].advice)}</div>
          <div class="advice-body">${formatMultiline(conseil)}</div>
        </div>
      `
      : "";

    const fallbackDescription = (!levels.length && ev.description)
      ? `<div class="block">
           <div class="block-title">${escapeHtml(UI[currentLang].details)}</div>
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

  // --- Load per language ---
  async function loadDataForLang(lang) {
  const url = (lang === "de") ? API_DE : API_FR;

  console.log("[programme] loading lang =", lang, "url =", url);

  const res = await fetch(url, { cache: "no-store" });
  console.log("[programme] fetch status =", res.status);

  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText} for ${url}`);

  const txt = await res.text();
  console.log("[programme] first chars =", txt.slice(0, 60));

  let obj;
  try {
    obj = JSON.parse(txt);
  } catch (err) {
    throw new Error(`Invalid JSON: ${err.message}`);
  }

  console.log("[programme] data OK, weeks =", (obj.weeks || []).length);
  return obj;
}

  // --- Helpers ---
  function ymdLocal(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function formatMultiline(text) {
    return escapeHtml(String(text)).replace(/\r?\n/g, "<br/>");
  }

  // --- ICS ---
  function buildIcsCalendar(data, lang) {
    const weeks = Array.isArray(data.weeks) ? data.weeks : [];
    const nowUtc = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:" + UI[lang].icsProdid);
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");
    lines.push(...vtzEuropeZurich());

    for (const w of weeks) {
      if (!w || !w.date_iso) continue;

      const { hh, mm } = parseTimeToHHMM(w.time);
      const startLocal = formatLocalDateTime(w.date_iso, hh, mm);
      const dur = Number.isFinite(+w.duration_minutes) ? Math.max(1, +w.duration_minutes) : 60;
      const endLocal = addMinutesToLocalDateTime(w.date_iso, hh, mm, dur);

      const title = w.title || `GPMF — ${UI[lang].week} ${w.week ?? ""}`.trim();
      const location = w.location || "";
      const description = buildDescription(w, lang);

      const uid = `gpmf-${(w.date_iso || "").slice(0,10)}-w${w.week ?? "x"}@gpmf.ch`;

      lines.push("BEGIN:VEVENT");
      lines.push(foldLine("UID:" + uid));
      lines.push(foldLine("DTSTAMP:" + nowUtc));
      lines.push(foldLine("SUMMARY:" + icsEscapeText(title)));
      lines.push(foldLine("DTSTART;TZID=Europe/Zurich:" + startLocal));
      lines.push(foldLine("DTEND;TZID=Europe/Zurich:" + endLocal));
      if (location) lines.push(foldLine("LOCATION:" + icsEscapeText(location)));
      if (description) lines.push(foldLine("DESCRIPTION:" + icsEscapeText(description)));
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
  }

  function buildDescription(ev, lang) {
    const meta = ev.meta || {};
    const intensity = meta.intensity || {};
    const levels = Array.isArray(meta.levels) ? meta.levels : [];
    const mercredi = meta.mercredi || {};
    const supplementaires = meta.supplementaires || {};
    const conseil = meta.conseil || "";

    const parts = [];
    if (ev.date_human) parts.push(ev.date_human);
    if (ev.time) parts.push(`${UI[lang].timeLabel}: ${ev.time}`);
    if (ev.duration_minutes) parts.push(`${UI[lang].durationLabel}: ${ev.duration_minutes} min`);
    if (intensity && (intensity.I || intensity.percent)) {
      const i = intensity.I ? `I ${intensity.I}` : "";
      const p = intensity.percent ? `${intensity.percent}` : "";
      parts.push(`${UI[lang].intensity}: ${[i,p].filter(Boolean).join(" — ")}`);
    }

    if (levels.length) {
      parts.push("");
      for (const lvl of levels) {
        const wTxt = typeof mercredi[lvl.id] === "string" ? mercredi[lvl.id] : "";
        const sTxt = typeof supplementaires[lvl.id] === "string" ? supplementaires[lvl.id] : "";
        parts.push(`${lvl.label}:`);
        parts.push(`- ${UI[lang].wedSession}: ${oneLine(wTxt || UI[lang].toDefine)}`);
        parts.push(`- ${UI[lang].extraSessions}: ${oneLine(sTxt || UI[lang].toDefine)}`);
        parts.push("");
      }
    } else if (ev.description) {
      parts.push("");
      parts.push(oneLine(ev.description));
    }

    if (conseil) {
      parts.push("");
      parts.push(`${UI[lang].advice}:`);
      parts.push(oneLine(conseil));
    }

    return parts.join("\n").trim();
  }

  function oneLine(s) {
    return String(s).replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
  }

  function parseTimeToHHMM(timeStr) {
    const s = (timeStr || "").toString().trim();
    const m = s.match(/(\d{1,2})\s*(?:h|:|\.|\s)\s*(\d{2})/i) || s.match(/^(\d{1,2})$/);
    if (!m) return { hh: 18, mm: 15 };
    const hh = Math.min(23, Math.max(0, parseInt(m[1], 10)));
    const mm = m[2] ? Math.min(59, Math.max(0, parseInt(m[2], 10))) : 0;
    return { hh, mm };
  }

  function formatLocalDateTime(dateIso, hh, mm) {
    const d = String(dateIso).slice(0, 10);
    const y = d.slice(0, 4);
    const mo = d.slice(5, 7);
    const da = d.slice(8, 10);
    const pad = (n) => String(n).padStart(2, "0");
    return `${y}${mo}${da}T${pad(hh)}${pad(mm)}00`;
  }

  function addMinutesToLocalDateTime(dateIso, hh, mm, addMin) {
    const d = String(dateIso).slice(0, 10);
    const dt = new Date(`${d}T00:00:00`);
    dt.setHours(hh, mm, 0, 0);
    dt.setMinutes(dt.getMinutes() + addMin);

    const pad = (n) => String(n).padStart(2, "0");
    const y = dt.getFullYear();
    const mo = pad(dt.getMonth() + 1);
    const da = pad(dt.getDate());
    const H = pad(dt.getHours());
    const M = pad(dt.getMinutes());
    return `${y}${mo}${da}T${H}${M}00`;
  }

  function icsEscapeText(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  function foldLine(line) {
    const max = 74;
    if (line.length <= max) return line;
    let out = "";
    let i = 0;
    while (i < line.length) {
      out += (i === 0 ? "" : "\r\n ") + line.slice(i, i + max);
      i += max;
    }
    return out;
  }

  function downloadTextFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function vtzEuropeZurich() {
    return [
      "BEGIN:VTIMEZONE",
      "TZID:Europe/Zurich",
      "BEGIN:DAYLIGHT",
      "TZOFFSETFROM:+0100",
      "TZOFFSETTO:+0200",
      "TZNAME:CEST",
      "DTSTART:19700329T020000",
      "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
      "END:DAYLIGHT",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0200",
      "TZOFFSETTO:+0100",
      "TZNAME:CET",
      "DTSTART:19701025T030000",
      "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
      "END:STANDARD",
      "END:VTIMEZONE"
    ];
  }

  // --- Lang state helpers ---
  function getLangFromUrlOrStorage() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang === "fr" || urlLang === "de") return urlLang;
    const saved = localStorage.getItem("gpmf_lang");
    return (saved === "de" || saved === "fr") ? saved : "fr";
  }

  function setLang(lang) {
    localStorage.setItem("gpmf_lang", lang);
    const u = new URL(location.href);
    u.searchParams.set("lang", lang);
    history.replaceState({}, "", u.toString());
  }

  function setLangButtonsActive(lang) {
    if (!btnFR || !btnDE) return;
    btnFR.classList.toggle("is-active", lang === "fr");
    btnDE.classList.toggle("is-active", lang === "de");
  }

  // first paint
  render();
})();
</script>
