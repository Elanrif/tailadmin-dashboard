# Blueprint Next.js — Installation & Réutilisation

Ce blueprint est basé sur notre architecture Next.js et s'inspire du template UI suivant pour la partie interface :

**Next.js Templates — Dashboard**
https://nextjstemplates.com/dashboard

Le template a principalement servi de référence pour la partie **UI, design et organisation visuelle**.

La partie **architecture et métier** reste indépendante du template.

---

## 1. Démarrage rapide

Les composants présents dans `src/lib/users/components` utilisent plusieurs librairies runtime.

Si tu souhaites installer uniquement les dépendances nécessaires aux composants, exécute :

### Dépendances de production

```bash
# Git Bash — Production
npm install \
  flatpickr \
  next-themes \
  @hookform/resolvers \
  zod \
  sonner \
  react-hook-form \
  axios \
  cloudinary \
  next-cloudinary \
  nodemailer \
  clsx \
  tailwind-merge \
  pino \
  server-only \
  rimraf \
  react-dropzone \
  moment \
  react-apexcharts \
  @react-jvectormap/core \
  @react-jvectormap/world \
  @fullcalendar/core \
  @fullcalendar/daygrid \
  @fullcalendar/interaction \
  @fullcalendar/list \
  @fullcalendar/react@6.1.20 \
  @fullcalendar/timegrid
```

---

## 2. Shadcn UI

Installation recommandée pour un projet vierge :

```bash
npx shadcn@latest init
npx shadcn@latest add button
```

Les composants shadcn peuvent ensuite être ajoutés selon les besoins du projet.

---

## 3. Dépendances de développement

```bash
# Git Bash — Development
npm install -D \
  @svgr/webpack \
  @types/nodemailer \
  pino-pretty \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  prettier-plugin-classnames \
  prettier-plugin-merge \
  prettier-plugin-tailwindcss \
  @eslint/css \
  eslint-plugin-import \
  eslint-plugin-unicorn \
  eslint-plugin-unused-imports \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional \
  shx \
  tailwind-csstree
```

---

# 4. Configuration SVG — Next.js

## ❌ Erreur

Lors de `npm run build`, l'erreur suivante peut apparaître :

```text
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
    at ignore-listed frames {
  digest: '3859844196'
}

Export encountered an error on /(website)/dashboard/page: /dashboard, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```

## Solution

Ajouter la configuration suivante dans `next.config.ts` :

```ts
webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });

  return config;
},

turbopack: {
  rules: {
    "*.svg": {
      loaders: ["@svgr/webpack"],
      as: "*.js",
    },
  },
},
```

---

# 5. Fichiers / dossiers à copier pour un nouveau projet

Pour réutiliser ce blueprint sans copier l'intégralité du projet, prendre au minimum :

* `src/config/` — configuration Axios, API, environment, logger
* `src/lib/` — logique commune, composants UI, hooks et modules métier
* `src/utils/` — helpers réutilisables
* `env/` — exemples de fichiers `.env.*`

Dans `.gitignore`, utiliser :

```gitignore
.env*.local
```

---

# 6. Configuration `package.json`

Scripts principaux :

```bash
npm run env:local    # configure l'environnement local
npm run dev          # démarre Next.js en développement
npm run build        # build de production
npm run start        # démarre l'application
npm run lint         # ESLint
npm run format       # Prettier
```

---

# 7. Alias TypeScript

Vérifier que `tsconfig.json` contient les `paths` suivants :

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@lib/*": ["./src/lib/*"],
    "@config/*": ["./src/config/*"],
    "@/components/*": ["./src/lib/_/components/*"]
  }
}
```

---

# 8. Configuration ESLint

Dans `eslint.config.mjs`, la règle suivante a été ajoutée :

```ts
{
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
}
```

---

# 9. Réutilisation du blueprint

## Nouveau projet

Pour un projet vierge, tu peux utiliser l'ensemble du blueprint :

* architecture ;
* configuration ;
* dépendances ;
* UI ;
* composants ;
* hooks ;
* outils de développement.

## Projet avec un template existant

Si le projet possède déjà un template, il n'est pas nécessaire de reprendre toute la partie UI.

Les éléments prioritaires sont :

* `src/config/`
* `src/lib/`
* `src/utils/`
* `env/`
* configurations nécessaires
* logique métier

La partie UI peut rester basée sur le template existant.
