# gpmf.github.io

Site Jekyll de l'association **GPMF**, hébergé sur GitHub Pages.

---

## Architecture

### Backends (Cloudflare Workers)

Définis dans `_config.yml` et injectés dans toutes les pages via `window.GPMF`:

| Variable          | Worker                                            | Rôle                                 |
| ----------------- | ------------------------------------------------- | ------------------------------------ |
| `worker_base_url` | `weathered-math-a354.jeremieschouwey.workers.dev` | Photos (R2) — liste dossiers, images |
| `admin_url`       | `gpmf-admin.jeremieschouwey.workers.dev`          | Statistiques (`/api/stats`)          |

### Sources de données par page

| Page             | Source                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Statistiques     | API: `GPMF.adminUrl + '/api/stats'`                                              |
| Programme        | Fichiers locaux: `assets/programme2026.fr.json` / `assets/programme2026.de.json` |
| Photos / Accueil | API: `GPMF.workerBase + '/api/folders'` + `/api/list`                            |
| Traces hivernaux | Fichiers locaux: `assets/gpx/` + `_data/gpx_traces.yml`                          |
| Actualités       | Fichiers locaux: `_posts/`                                                       |

### Données statiques

| Fichier / Dossier              | Contenu                                 |
| ------------------------------ | --------------------------------------- |
| `_config.yml`                  | URLs des Workers, dates clés, Strava    |
| `_data/navigation.yml`         | Menus de navigation                     |
| `_data/sponsors.yml`           | Liste des sponsors                      |
| `_data/gpx_traces.yml`         | Métadonnées des tracés GPX hivernaux    |
| `_data/programme_events.yml`   | Evénements supplémentaires du programme |
| `assets/gpx/`                  | Fichiers GPX des tracés                 |
| `assets/documents/`            | Documents divers                        |
| `assets/programme2026.fr.json` | Programme 20 semaines (FR)              |
| `assets/programme2026.de.json` | Programme 20 semaines (DE)              |

---

## Tâches courantes

### Ajouter les statistiques après une séance

Les statistiques sont gérées par le Worker `admin_url` (`/api/stats`). Le fichier [`assets/stats-gpmf.json`](assets/stats-gpmf.json) est la source de données importée dans ce Worker.

Après chaque entraînement:

1. Aller sur `https://gpmf-admin.jeremieschouwey.workers.dev/login`
2. S'authentifier avec le mot de passe
3. TODO

(DEPRECATED - TO UPDATE):

1. Ouvrir `assets/stats-gpmf.json`
2. Trouver la saison en cours
3. Ajouter la nouvelle séance dans `sessions`
4. Recalculer les champs de la saison:

- `session_count`
- `season_total`
- `average_per_session`
- `peak_total`
- `peak_date`

8. Recalculer la section `overview`
9. Sauvegarder, committer et publier (le Worker doit ensuite être mis à jour avec le nouveau fichier)

---

### Modifier le programme

- Les données proviennent des fichiers locaux: `assets/programme2026.fr.json` / `assets/programme2026.de.json`
- La date de début de saison est dans `_config.yml` → `programme_start_date_iso`
- Les événements supplémentaires (non issus de l'API) restent dans `_data/programme_events.yml`

### Ajouter une trace hivernal

1. Copier le fichier GPX dans `assets/gpx/NOM.gpx`
2. Ajouter une entrée dans `_data/gpx_traces.yml`:
   ```yaml
   - title: "Nom de la trace"
     file: "NOM.gpx"
     difficulty: "facile"
     description: "..."
   ```
3. Commit / push → c'est live

### Ajouter des photos

Se connecter sur **Cloudflare R2** et ajouter un dossier avec les nouvelles photos:

> Dashboard → R2 → `gpmf-photos`

### Ajouter une actualité

1. Créer un fichier dans `_posts/`: `YYYY-MM-DD-titre.md`
2. S'inspirer d'un fichier existant pour le front matter
3. Commit / push → c'est live

### Modifier les dates / URLs

Tout est centralisé dans `_config.yml` — pas besoin de toucher au code des pages.

---

## Lancer le site en local

```bash
brew install chruby ruby-install
ruby-install ruby 3.4.1
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
echo "chruby ruby-3.4.1" >> ~/.zshrc
source ~/.zshrc
ruby -v # should show ruby 3.4.1
gem install jekyll bundler
bundle install
bundle exec jekyll serve
```

Ouvrir **http://localhost:4000** dans le navigateur.
Le site se recharge automatiquement à chaque sauvegarde. Arrêter avec `Ctrl + C`.
