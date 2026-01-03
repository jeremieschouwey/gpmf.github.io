---
layout: default
title: Photos
permalink: /photos/
---

# Photos

<nav id="photo-menu"></nav>

<div id="photo-status" style="margin: 1rem 0;"></div>

<div id="photo-gallery" class="gallery"></div>

<!-- Lightbox -->
<div id="lightbox" class="lb" aria-hidden="true">
  <button id="lb-close" class="lb-close" aria-label="Fermer">×</button>
  <button id="lb-download" class="lb-download" aria-label="Télécharger">
  ⬇ Télécharger
  </button>

  <button id="lb-prev" class="lb-nav lb-prev" aria-label="Photo précédente">‹</button>
  <img id="lb-img" class="lb-img" alt="">
  <button id="lb-next" class="lb-nav lb-next" aria-label="Photo suivante">›</button>
  <div id="lb-caption" class="lb-caption"></div>
</div>

<style>
  .lb {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0,0,0,0.85);
    z-index: 9999;
  }
  .lb.open { display: flex; }

  .lb-img {
    max-width: min(1200px, 95vw);
    max-height: 85vh;
    width: auto;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    background: #111;
  }

  .lb-close {
    position: absolute;
    top: 14px;
    right: 18px;
    font-size: 34px;
    line-height: 1;
    border: 0;
    background: transparent;
    color: #fff;
    cursor: pointer;
    padding: 6px 10px;
  }

  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 48px;
    line-height: 1;
    border: 0;
    background: rgba(0,0,0,0.25);
    color: #fff;
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 10px;
  }
  .lb-prev { left: 14px; }
  .lb-next { right: 14px; }

  .lb-caption {
    position: absolute;
    bottom: 14px;
    left: 0;
    right: 0;
    text-align: center;
    color: rgba(255,255,255,0.9);
    font-size: 14px;
    padding: 0 18px;
    word-break: break-word;
  }
  .lb-download {
  position: absolute;
  top: 16px;
  right: 70px; /* à côté du bouton fermer */
  font-size: 14px;
  border: 1px solid rgba(255,255,255,0.4);
  background: rgba(0,0,0,0.4);
  color: #fff;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
}

.lb-download:hover {
  background: rgba(255,255,255,0.15);
}

</style>


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
  const lbDownload = document.getElementById("lb-download");


  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function setActive(id) {
    for (const a of menuEl.querySelectorAll("a")) {
      a.classList.toggle("active", a.dataset.id === id);
    }
  }

  // Lightbox state
  let currentFiles = [];
  let currentIndex = 0;

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");

  function openLightbox(index) {
  currentIndex = index;
  const file = currentFiles[currentIndex];
  const filename = file.key.split("/").pop();

  const imgUrl = encodeURI(`${R2_BASE}/${file.key}`);

  lbImg.src = imgUrl;
  lbImg.alt = filename;
  lbCaption.textContent = filename;

  // Prépare le lien de téléchargement
  lbDownload.onclick = () => {
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = filename; // force le téléchargement
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}


  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = ""; // libère mémoire
    document.body.style.overflow = "";
  }

  function prevLightbox() {
    if (!currentFiles.length) return;
    const nextIndex = (currentIndex - 1 + currentFiles.length) % currentFiles.length;
    openLightbox(nextIndex);
  }

  function nextLightbox() {
    if (!currentFiles.length) return;
    const nextIndex = (currentIndex + 1) % currentFiles.length;
    openLightbox(nextIndex);
  }

  function renderGallery(files) {
    currentFiles = files || [];
    galleryEl.innerHTML = "";

    currentFiles.forEach((f, idx) => {
      const img = document.createElement("img");
      img.src = encodeURI(`${R2_BASE}/${f.key}`);
      img.loading = "lazy";
      img.alt = f.key.split("/").pop();
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(idx));
      galleryEl.appendChild(img);
    });
  }

  // Lightbox events
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", prevLightbox);
  lbNext.addEventListener("click", nextLightbox);

  // clic sur fond noir pour fermer (mais pas sur l’image)
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  // clavier
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
    if (e.key === "ArrowRight") nextLightbox();
  });


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
