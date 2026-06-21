# Portfolio S6 — Baran Deniz

Application web présentant mon profil professionnel, mes compétences **Développer** et **Entreprendre** au niveau 3 du BUT MMI, ainsi qu’une sélection d’études de cas documentées.

Le portfolio conserve une identité sombre et immersive tout en privilégiant la lisibilité, l’accessibilité et les preuves de compétences.

## Fonctionnalités

- accueil et profil professionnel ;
- correspondance entre apprentissages critiques et projets ;
- slideshow spatial accessible des quatre projets principaux ;
- pages d’études de cas générées depuis des données structurées ;
- galerie de projets secondaires ;
- article sur le workflow avec l’IA générative ;
- formulaire validé préparant un e-mail sans stockage de données ;
- adaptation mobile et prise en charge de `prefers-reduced-motion`.

## Stack

Next.js 14, React 18, Sass, Framer Motion et Vercel Analytics. Les données éditoriales sont centralisées dans `database/projects.js` et `database/competencies.js`.

## Installation

```bash
npm install
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

## Vérifications

```bash
npm run lint
npm run build
npm run start
```

Les vérifications manuelles couvrent les formats desktop et mobile, la navigation clavier, la réduction des animations, les liens externes et les pages dynamiques.

## Structure éditoriale

- `database/projects.js` : contenu des études de cas et de l’archive ;
- `database/competencies.js` : référentiel Développer/Entreprendre et preuves associées ;
- `components/PF6/` : accueil, carrousel et formulaire ;
- `app/projets/[slug]/` : pages projets ;
- `app/journal/workflow-ia/` : article sur la démarche IA.

## Contact

Baran Deniz — Strasbourg
[LinkedIn](https://www.linkedin.com/in/baran-deniz-973ba923a/) · [GitHub](https://github.com/brndnz7)
