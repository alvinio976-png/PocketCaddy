# Pocket Caddy Web (Starter Zip)

Un mini site **PWA** prêt pour Vercel + GitHub, optimisé iPhone.
- Ajout rapide d'URL & de Notes
- Auto-classement (YouTube, images, sites, AI, 3D/Creative, SFX/VFX, Code)
- Miniatures (YouTube / favicon), recherche, export/import JSON
- Mode "app" (Ajouter à l'écran d'accueil), offline (via service worker sur HTTPS)

## Utilisation locale (Windows)
- Double-clique **`Ouvrir_localement_sans_serveur.cmd`** ➜ ouvre `index.html` (le service worker **ne fonctionne pas** en file://, mais tout le reste oui).
- Si tu as **Python 3**, lance **`Lancer_serveur_local.cmd`** ➜ http://localhost:8080 (SW actif).

## Déploiement sur Vercel
1. Crée un repo sur GitHub.
2. Uploade tout le contenu du dossier.
3. Sur vercel.com ➜ **Add New Project** ➜ importe ton repo.
   - Build Command: (vide)
   - Output directory: `.`
4. Ouvre l'URL `https://…vercel.app` sur Safari (iPhone) ➜ Partager ➜ **Ajouter à l'écran d'accueil**.

## Capture depuis iOS (feuille Partager ➜ Raccourcis)
Tu peux créer un **Raccourci iOS** qui prend l'URL en entrée et ouvre :
```
https://ton-domaine.vercel.app/?url=URL_ENTREE
```
L'app ajoutera automatiquement l'élément à l'ouverture.

---
Bon build !
