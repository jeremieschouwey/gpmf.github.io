# gpmf.github.io

Site Jekyll de l'association **GPMF**, hébergé sur GitHub Pages.

---

## Contenu du site

| Section          | Dossier / Fichier                      |
| ---------------- | -------------------------------------- |
| Actualités       | `_posts/`                              |
| Programme        | `assets/programme2026.json`            |
| Statistiques     | `assets/stats-gpmf.json`               |
| Traces hivernaux | `assets/gpx/` + `_data/gpx_traces.yml` |
| Photos           | Cloudflare R2                          |
| Navigation       | `_data/navigation.yml`                 |
| Style            | `assets/style.css`                     |

---

## Tâches courantes

### Ajouter les statistiques après une séance

Les statistiques sont stockées dans [`assets/stats-gpmf.json`](assets/stats-gpmf.json).

Après chaque entraînement :

1. Ouvrir `assets/stats-gpmf.json`
2. Trouver la saison en cours
3. Ajouter la nouvelle séance dans `sessions`
4. Recalculer les champs de la saison :
   - `session_count`
   - `season_total`
   - `average_per_session`
   - `peak_total`
   - `peak_date`
5. Recalculer la section `overview`
6. Sauvegarder, committer et publier

---

### Ajouter des photos

Se connecter sur **Cloudflare R2** et ajouter un dossier avec les nouvelles photos :

> Dashboard → R2 → `gpmf-photos`

---

### Ajouter une actualité

1. Créer un fichier dans `_posts/` en suivant la convention : `YYYY-MM-DD-titre.md`
2. Cloner un fichier existant comme point de départ si besoin
3. Committer et publier

---

### Modifier le programme

- Le contenu du programme est dans [`assets/programme2026.json`](assets/programme2026.json)
- Pour un changement d'année → modifier la constante `START_DATE` avec la date du premier entraînement

---

### Ajouter une trace pour les hivernaux

1. Copier le fichier GPX : `assets/gpx/NOM.gpx`
2. Ajouter une entrée dans [`_data/gpx_traces.yml`](_data/gpx_traces.yml) :
   ```yaml
   - file: "NOM.gpx"
   ```
3. Commit / push → c'est live

---

## Lancer le site en local

**Dans un terminal (Mac)**

```bash
brew install chruby ruby-install
ruby-install ruby 3.4.1
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
echo "chruby ruby-3.4.1" >> ~/.zshrc # run 'chruby' to see actual version
source  ~/.zshrc
ruby -v # should show ruby 3.4.1
gem install jekyll bundler
bundle install
bundle exec jekyll serve
```

Ouvrir **http://localhost:4000** dans le navigateur.  
Le site se recharge automatiquement à chaque sauvegarde. Arrêter avec `Ctrl + C`.

---
