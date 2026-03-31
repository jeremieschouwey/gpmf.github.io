---
layout: default
title: Les groupes
permalink: /groupes/
---

# Les groupes

<p class="muted">Clique sur un groupe pour afficher les détails.</p>

<div class="groups-accordion">

  {% for groupe in site.data.groupes %}
  <details class="group-item">
    <summary>
      {% if groupe.allure %}
      <span class="group-left">
        <span class="group-title">{{ groupe.title | escape }}</span>
        <span class="group-allure">{{ groupe.allure | escape }}</span>
      </span>
      {% else %}
      <span class="group-title">{{ groupe.title | escape }}</span>
      {% endif %}
      <span class="group-chip">{{ groupe.chip | escape }}</span>
    </summary>
    {% if groupe.meta_time or groupe.meta_pace %}
    <div class="group-meta">
      <ul>
        {% if groupe.meta_time %}<li>Objectif de temps au Morat–Fribourg : {{ groupe.meta_time | escape }}</li>{% endif %}
        {% if groupe.meta_pace %}<li>Allure compétition: {{ groupe.meta_pace | escape }}</li>{% endif %}
      </ul>
    </div>
    {% endif %}
    <div class="group-content">
      {% if groupe.description %}<p>{{ groupe.description | escape }}</p>{% endif %}
      <ul>
        {% for moniteur in groupe.moniteurs %}
        <li>{{ moniteur | escape }}</li>
        {% endfor %}
      </ul>
    </div>
  </details>
  {% endfor %}

</div>
