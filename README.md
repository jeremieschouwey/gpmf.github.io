# gpmf.github.io

Ajouter les statistiques après chaque séance : 

  Les statistiques sont stockés dans le fichier assets/stats-gpmf.json

  Après chaque entraînement :
  
  ouvrir assets/stats-gpmf.json
  
  trouver la saison en cours
  
  ajouter la nouvelle séance dans sessions
  
  recalculer :
  
  session_count
  
  season_total
  
  average_per_session
  
  peak_total
  
  peak_date
  
  recalculer overview
  
  sauvegarder, committer et publier
 

Ajouter des photos : 
  Se connecter sur cloudflare R2 et ajouter un dossier et les nouvelles photos https://dash.cloudflare.com/afe90d4ff6c77567ea885860c29cd2e6/r2/default/buckets/gpmf-photos


Ajouter des actualités : 
  ajouter un fichier dans _posts (possible de cloner)
  

Modifier le programme :
  Le contenu du programme se trouve dans la hiérarchie du site sous assets/programme2026.json
  Pour le changement d'année --> modifier constante START_DATE avec la date du premier entrainement

Ajouter un tracée pour les hivernaux : 
  Tu copies le fichier : assets/gpx/NOM.gpx
  Tu ajoutes une entrée dans _data/gpx_traces.yml avec file: "NOM.gpx"
  Commit / push → c’est live.
