---
layout: default
title: Photos
permalink: /photos/
---

# Photos

<nav id="photo-menu"></nav>

<div id="photo-status" style="margin: 1rem 0;"></div>

<div id="photo-gallery" class="gallery"></div>

<style>
  #photo-menu a {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    text-decoration: none;
  }
  #photo-menu a.active {
    font-weight: 600;
    border-color: #999;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  .gallery img {
    width: 100%;
    height: auto;
    border-radius: 6px;
    background: #f3f3f3;
  }
</style>

<script>
  // Base URL de votre Worker (à garder tel quel)
  const R2_BASE = "https://weathered-math-a354.jeremieschouwey.workers.dev";

  const menuEl = document.getElementById("photo-menu");
  const statusEl = document.getElementById("photo-status");
  const galleryEl = document.getElementById("photo-gallery");

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function setActive(id) {
    for (const a of menuEl.querySelectorAll("a")) {
      a.classList.toggle("active", a.dataset.id === id);
    }
  }

  function renderGallery(files) {
    galleryEl.innerHTML = "";
    for (const f of files) {
      const img = document.createElement("img");
      img.src = encodeURI(`${R2_BASE}/${f.key}`);
      img.loading = "lazy";
      img.alt = f.key.split("/").pop();
      galleryEl.appendChild(img);
    }
  }

  async function fetchJson(path) {
    const res = await fetch(`${R2_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path}`);
    return res.json();
  }

  async function loadFolders() {
    return fetchJson("/api/folders");
  }

  async function loadFiles(prefix) {
    return fetchJson(`/api/list?prefix=${encodeURIComponent(prefix)}`);
  }

  async function showFolder(folder) {
    setActive(folder.id);
    setStatus(`Chargement: ${folder.label}…`);

    const data = await loadFiles(folder.prefix);
    setStatus(`${data.files.length} photo(s)`);
    renderGallery(data.files);
  }

  function updateHash(id) {
    location.hash = `#${id}`;
  }

  async function init() {
    try {
      const data = await loadFolders();
      const folders = data.folders || [];

      if (!folders.length) {
        setStatus("Aucun dossier trouvé dans le stockage.");
        return;
      }

      // Construit le sous-menu
      menuEl.innerHTML = "";
      for (const f of folders) {
        const a = document.createElement("a");
        a.href = `#${f.id}`;
        a.dataset.id = f.id;
        a.textContent = f.label;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          updateHash(f.id);
          showFolder(f);
        });
        menuEl.appendChild(a);
      }

      // Album initial = hash (#xxx) sinon le premier
      const currentId = (location.hash || "").replace("#", "");
      const initial = folders.find(x => x.id === currentId) || folders[0];
      updateHash(initial.id);
      await showFolder(initial);

    } catch (err) {
      console.error(err);
      setStatus("Erreur: impossible de charger les albums/photos.");
    }
  }

  window.addEventListener("hashchange", init);
  init();
</script>
