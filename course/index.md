---
layout: default
title: La course
permalink: /course/
---

# Morat–Fribourg (Murtenlauf)

<p class="muted">
  Toutes les infos utiles sur la course Morat–Fribourg : lien officiel, date, et parcours.
</p>

<div class="hr"></div>

<div class="grid" style="margin-top:16px; gap:16px;">
  <div class="col-6">
    <div class="card">
      <div class="card-title">
        <h3>Site officiel</h3>
      </div>
      <p>
        Retrouvez les informations officielles (inscriptions, horaires, règlement, infos pratiques) sur le site de la course.
      </p>
      <p style="margin: 0;">
        <a class="btn btn-primary" href="https://www.morat-fribourg.ch" target="_blank" rel="noopener noreferrer">
          Ouvrir le site officiel
        </a>
      </p>
    </div>
  </div>

  <div class="col-6">
    <div class="card">
      <div class="card-title">
        <h3>Date de la course</h3>
      </div>

      <!-- ✅ Mets à jour ici chaque année -->
      <p style="font-size:1.05rem; margin: 0 0 8px;">
        <strong>Dimanche 5 octobre 2026</strong>
      </p>

      <p class="muted" style="margin:0;">
        Astuce : la course a généralement lieu début octobre (souvent le 1er dimanche).
      </p>
    </div>
  </div>
</div>

<div class="hr"></div>

## Parcours (Strava)

<p class="muted">
  Carte interactive du parcours via Strava.  
  Si l’embed ne s’affiche pas, vérifie que le parcours est public et remplace l’ID ci-dessous.
</p>

<!-- ✅ Remplace 1234567890 par l’ID du parcours Strava (route) -->
<div class="card" style="margin-top:12px;">
  <div class="card-title">
    <h3>Parcours Morat–Fribourg</h3>
  </div>

  <div class="strava-embed">
    <iframe
      title="Parcours Morat–Fribourg (Strava)"
      src="https://www.strava.com/segments/8283816/embed"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen>
    </iframe>
  </div>

  <p class="muted" style="margin-top:12px;">
    Si tu n’as pas encore l’ID : ouvre le parcours dans Strava → “Partager” → récupère l’URL
    <code>https://www.strava.com/routes/XXXXXXXXXX</code> et remplace <code>1234567890</code>.
  </p>
</div>

<div class="hr"></div>

## Infos pratiques (à compléter)

<ul class="list">
  <li><strong>Distance :</strong> ~17,17 km</li>
  <li><strong>Départ :</strong> Morat (Murten)</li>
  <li><strong>Arrivée :</strong> Fribourg</li>
</ul>

<p class="muted">
  Tu peux compléter cette section avec : retrait des dossards, horaires, accès transports, consignes, ravitaillements, etc.
</p>

<!-- Styles spécifiques à cette page -->
<style>
  .strava-embed{
    position: relative;
    padding-bottom: 56.25%; /* 16:9 responsive */
    height: 0;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--card);
  }
  .strava-embed iframe{
    position: absolute;
    top:0; left:0;
    width:100%;
    height:100%;
    border:0;
  }
  .list{
    margin: 10px 0 0;
    padding-left: 18px;
  }
</style>
