# Maintenance et gestion des branches

## Réinstaller proprement les dépendances

Si vous rencontrez des erreurs liées aux dépendances ou au compilateur SWC de Next.js, il est recommandé de supprimer les fichiers générés et de réinstaller le projet.

### Sous Windows (PowerShell)

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json
```

### Puis réinstallez les dépendances

```bash
npm install
```

ou avec pnpm :

```bash
pnpm install
```

Cette opération permet de :

* supprimer toutes les dépendances installées (`node_modules`) ;
* supprimer le cache de compilation de Next.js (`.next`) ;
* supprimer le fichier de verrouillage (`package-lock.json`) afin de le régénérer ;
* réinstaller toutes les dépendances avec une installation propre.

---

# Créer une branche orpheline (Orphan Branch)

Une branche orpheline est une branche totalement indépendante qui ne partage aucun historique avec les autres branches du dépôt.

Cette approche est particulièrement utile pour proposer plusieurs variantes d'un même template (par exemple : `auth/local`, `auth/nextauth`, `starter`, etc.) sans conserver l'historique des autres versions.

## 1. Créer une nouvelle branche orpheline

```bash
git checkout --orphan auth/local
```

## 2. Supprimer tous les fichiers de l'index Git

```bash
git rm -rf .
```

Cette commande supprime tous les fichiers suivis par Git afin de repartir d'un dépôt vierge.

## 3. Ajouter les fichiers de votre nouvelle variante

Copiez ensuite les fichiers correspondant à cette version du template dans votre projet.

## 4. Créer le premier commit

```bash
git add .
git commit -m "feat: initial auth/local template"
```

## 5. Publier la branche sur le dépôt distant

```bash
git push -u origin auth/local
```

L'option `-u` configure automatiquement le suivi entre votre branche locale et la branche distante.

---

## Exemple d'organisation des branches

```text
main
auth/local
auth/nextauth
```

* **main** : template de base ;
* **auth/local** : authentification avec Local Storage ;
* **auth/nextauth** : authentification avec NextAuth.

Cette organisation permet de maintenir plusieurs variantes du template dans un même dépôt tout en gardant chaque branche complètement indépendante.
