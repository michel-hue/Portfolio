# Refonte complète du portfolio — brief pour Claude Code

> Lis ce document en entier avant de commencer. Il décrit l'état actuel du dépôt, ce qu'il faut construire à la place et l'ordre des étapes.
>
> **Deux références visuelles sont fournies à côté de ce fichier :**
> 1. `design/` — **les maquettes des 5 écrans** (HTML + captures PNG). **C'est la référence principale** : mise en page, contenus, composants et textes viennent d'ici. Lis `design/README.md` en premier.
> 2. `charte/` — **la charte graphique** (PDF, variables CSS, polices, logos). Elle donne les noms des couleurs, la typographie et les règles d'animation à utiliser dans le code.
>
> En cas de doute, **la maquette l'emporte** sur ce document et sur la charte.

---

## 1. Objectif

Remplacer les trois applications actuelles (API NestJS + site React + admin React) par **une seule application Next.js** qui contient :

- le **site public** du portfolio d'**Archange YEBOUET**, développeur web et mobile à Abidjan (Côte d'Ivoire) — 5 écrans définis par les maquettes ;
- un **espace admin** protégé sur `/admin` pour ajouter et modifier projets, compétences, parcours et profil, et lire les messages de contact ;
- la **logique serveur** (lecture/écriture en base) directement dans Next.js — **pas d'API séparée**.

Contraintes du propriétaire :

- **0 € d'hébergement** : base de données gratuite, hébergement gratuit.
- **Pas de Supabase** (ni Turso, racheté par Supabase).
- **Nouveau design** : celui des maquettes `design/`, construit avec la charte `charte/`.

---

## 2. État actuel du dépôt (à remplacer)

```
Portfolio/
├── portfolio-api/        NestJS 11 + TypeORM + PostgreSQL + JWT (port 3000)
├── portfolio-frontend/   React 18 + Vite (site public)
├── portfolio-admin/      React 18 + Vite + react-router (admin)
├── README.md             vide, encodé en UTF-16
└── README.mdgit          contient en fait des commandes git
```

Problèmes connus de l'existant (à ne pas reproduire) :

- Le site lit `techStack` alors que l'API renvoie `technologies` → les technos ne s'affichent jamais.
- Le site attend `socialLinks[]` alors que l'API renvoie `github`, `linkedin`, `twitter` → les liens sociaux ne s'affichent jamais.
- Pas de `ValidationPipe` → les DTO `class-validator` ne sont jamais appliqués.
- Secret JWT par défaut codé en dur, `synchronize: true`, CORS ouvert, formulaire de contact sans anti-spam.
- Images stockées sur le disque du serveur (`/uploads`) → incompatible avec un hébergement gratuit.

**Contenu** : l'ancien `portfolio-api/src/seed.ts` contient des données de démonstration au nom de « Manuel ». **Ne les reprends pas telles quelles.** Le nouveau seed utilise l'identité et les textes des maquettes (Archange YEBOUET, Abidjan, projet « API de réservation de terrains », compétences Web / Mobile / Back-end). Tu peux t'inspirer de l'ancien seed pour la structure des projets.

---

## 3. Stack technique retenue

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js** (dernière version stable, App Router, TypeScript strict) | Site + admin + serveur dans une seule app |
| Base de données | **Neon** (PostgreSQL serverless, plan gratuit) | Gratuit et permanent, sans carte, 1 Go par projet, mise en veille automatique ; on reste sur PostgreSQL |
| ORM | **Drizzle ORM** + `@neondatabase/serverless` | Léger, typé, migrations SQL versionnées (`drizzle-kit`) |
| Images et CV | **Cloudinary** (plan gratuit, 25 crédits/mois) | Stockage + redimensionnement + CDN ; upload signé depuis l'admin |
| Validation | **Zod** | Valide toutes les entrées serveur (formulaires, actions admin) |
| Auth admin | Mot de passe unique (hash bcrypt en variable d'environnement) + session en cookie signé (`jose`, JWT HS256) | Un seul admin : pas besoin de table utilisateurs ni de fournisseur externe |
| Styles | CSS natif : `charte/code/tokens.css` + CSS Modules par composant | Les variables de la charte sont la source unique ; **pas de Tailwind** |
| Polices | Paquet npm `geist` (`geist/font/sans`, `geist/font/mono`) | Polices des maquettes, optimisées par Next.js |
| Icônes | `lucide-react` (trait 1,75) | Ce sont les icônes des maquettes (flèche, lien externe, téléchargement, fichier, GitHub, courrier, épingle, coche) |
| Animations | CSS + `IntersectionObserver` (petit composant client) | Pas besoin de librairie d'animation |
| Hébergement | **Vercel** (plan Hobby gratuit) | Déploiement natif de Next.js |

---

## 4. Nouvelle structure

Crée le projet **à la racine du dépôt** (dans `Portfolio/`), puis supprime les anciens dossiers une fois tout fonctionnel (étape 10). Ne modifie pas `design/` ni `charte/`.

```
Portfolio/
├── design/                     # fourni — maquettes (référence, ne pas modifier)
├── charte/                     # fourni — charte graphique (ne pas modifier)
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── layout.tsx            # Header flottant + Footer
│   │   │   ├── page.tsx              # Accueil            ← design/maquettes/Main.dc.html
│   │   │   ├── projets/page.tsx      # Tous les projets   ← Projets.dc.html
│   │   │   ├── projets/[slug]/page.tsx  # Détail projet   ← Projet.dc.html
│   │   │   ├── a-propos/page.tsx     # À propos           ← APropos.dc.html
│   │   │   └── contact/page.tsx      # Contact            ← Contact.dc.html
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── layout.tsx            # barre latérale admin, vérifie la session
│   │   │   ├── page.tsx              # tableau de bord
│   │   │   ├── projets/…             # liste, nouveau, [id]
│   │   │   ├── competences/…
│   │   │   ├── parcours/…
│   │   │   ├── profil/page.tsx
│   │   │   └── messages/page.tsx
│   │   ├── api/upload/route.ts       # signature d'upload Cloudinary (admin uniquement)
│   │   ├── sitemap.ts · robots.ts · opengraph-image.tsx · not-found.tsx
│   │   ├── icon.svg                  # = charte/logos/svg/app-icon.svg
│   │   └── layout.tsx                # <html data-theme>, polices, metadata
│   ├── components/
│   │   ├── site/      # Header, Footer, Logo, Button, Tag, Eyebrow, ProjectCard, FeaturedProject,
│   │   │              # ProjectFilters, ProjectFacts, ProjectSection, SkillGroupCard, Timeline,
│   │   │              # ContactForm, CtaBand, Reveal, AnimatedDot, ThemeToggle
│   │   └── admin/     # Sidebar, DataTable, ProjectForm, ImageUpload, ListEditor, …
│   ├── db/ (schema.ts, index.ts, seed.ts)
│   ├── lib/ (auth.ts, validation.ts, cloudinary.ts, env.ts)
│   ├── actions/                       # Server Actions (admin + contact)
│   ├── middleware.ts                  # protège /admin/* sauf /admin/login
│   └── styles/ (tokens.css = copie de charte/code/tokens.css, globals.css)
├── drizzle/ · drizzle.config.ts · .env.example
└── README.md                          # réécrit en UTF-8
```

---

## 5. Modèle de données (Drizzle / PostgreSQL)

Chaque champ correspond à un emplacement visible dans les maquettes.

```ts
// profile — une seule ligne
profile {
  id               serial PK
  fullName         text not null      // "Archange YEBOUET"
  shortName        text not null      // "archange" (logo texte)
  role             text not null      // "Développeur web et mobile"
  city             text not null      // "Abidjan"
  country          text not null      // "Côte d'Ivoire"
  timezone         text               // "GMT"
  heroTitle        text not null      // "Je construis des produits web nets" (le point est ajouté par le composant)
  heroIntro        text not null      // "De la base de données à l'interface, …"
  aboutTitle       text not null      // "Basé à Abidjan, je travaille partout." (teaser accueil)
  aboutShort       text not null      // 2–3 phrases (teaser accueil)
  aboutLong        text not null      // texte de la page À propos
  email            text not null
  githubUrl        text
  linkedinUrl      text
  portraitUrl      text               // Cloudinary, ratio 4:5
  resumeUrl        text               // CV PDF (Cloudinary)
  available        boolean default true
  availableFrom    text               // "à partir de janvier" (affiché après "Disponible ·")
  responseTime     text default '48 h'
  updatedAt        timestamp default now()
}

// projects
projects {
  id               serial PK
  slug             text unique not null
  title            text not null
  category         text not null      // 'Web' | 'Mobile' | 'API'  (filtres de la page Projets)
  summary          text not null      // une phrase, cartes + chapeau de la page projet
  intro            text               // phrase complémentaire du chapeau ("qui l'utilise et pourquoi")
  coverUrl         text               // capture principale 16:9 (cartes et page projet)
  gallery          text[] default '{}'// captures secondaires (2 en maquette)
  technologies     text[] not null default '{}'
  role             text               // "Développeur back-end"
  year             integer
  duration         text               // "6 semaines"
  contextTitle     text               // A — Le contexte : titre (une phrase)
  contextBody      text               // A — Le contexte : 2–3 phrases
  features         jsonb default '[]' // B — Ce que j'ai construit : [{ title, description }]
  result           text               // C — Résultat
  appUrl           text               // bouton "Ouvrir l'app" (principal sur la page projet)
  docsUrl          text               // bouton "Documentation" (ex. Swagger) — facultatif
  sourceUrl        text               // bouton "Code source" — facultatif
  featured         boolean default false   // badge "En vedette" + grand bloc du hero (un seul à la fois)
  published        boolean default false
  order            integer default 0       // sert aussi au numéro affiché "01", "02"…
  createdAt / updatedAt  timestamp
}

// skill_groups — les 3 cartes "Ce que je fais"
skill_groups { id serial PK, name text not null /* Web | Mobile | Back-end */, description text not null, order integer default 0 }

// skills — étiquettes dans chaque groupe ; `showInStack` = liste "Stack" du teaser de l'accueil
skills { id serial PK, groupId integer FK → skill_groups, name text not null, showInStack boolean default false, order integer default 0 }

// experiences — page À propos, "B — Parcours"
experiences { id serial PK, period text not null /* "2023 — 2025" */, title text not null /* "Poste · Entreprise" ou "Diplôme · École" */, description text, kind text /* 'work' | 'education' */, order integer default 0 }

// messages — formulaire de contact
messages {
  id serial PK, name text not null, email text not null,
  topic text not null      // 'Projet web' | 'App mobile' | 'Poste / mission' | 'Autre'
  body text not null, read boolean default false, ipHash text, createdAt timestamp default now()
}
```

- Le site utilise **exactement** ces noms (fini le décalage `techStack`/`technologies`).
- Migrations via `drizzle-kit generate` + `drizzle-kit migrate`. Jamais de synchronisation automatique en production.

---

## 6. Site public — écran par écran

Toutes les pages publiques sont des **Server Components** rendus statiquement et **revalidés** après chaque modification dans l'admin (`revalidatePath`). Reproduis la maquette correspondante : mesures, textes fixes, ordre des blocs.

### Commun à toutes les pages
- **Header flottant** : barre arrondie (`radius-lg`) sur `surface-raised` avec filet `line`, centrée dans le conteneur 1120px, 24px sous le haut. Logo texte `archange.` (22px, 600, point `accent`) ; liens Accueil / Projets / À propos (page active : `ink` + point `accent` de 6px, `aria-current="page"`) ; bouton contour « Me contacter ». Sous 640px : menu plein écran.
- **Footer** : logo, liens (Accueil, Projets, À propos, Contact, GitHub, LinkedIn), « © 2026 Archange YEBOUET · Fait à Abidjan » (année dynamique).
- **Bande d'appel** (`CtaBand`) en bas de Projets et À propos : fond `surface`, titre `h1` 44px à gauche, bouton à droite.
- Sur-titres numérotés en Geist Mono capitales : `01 —`, `02 — Projets`, `03 — À propos`, `04 — Contact` ; dans les pages, sous-sections `A —`, `B —`, `C —`.
- Le **point final animé** (`AnimatedDot`) termine le titre principal de chaque page.

### Accueil `/` — `Main.dc.html`
1. **Hero** en deux colonnes : à gauche, tuile « a. » (56px, `accent`) + nom + « rôle · ville », titre 64px, intro, boutons « Voir les projets » (principal) et « Télécharger le CV » (lien avec icône) ; à droite, le **projet en vedette** dans une grande carte (capture, badge « En vedette », numéro + catégorie, titre 30px, résumé, technos, « Ouvrir l'app » + « Voir le projet »).
2. **02 — Projets / Autres projets** : filtres en pastilles (Tous, Web, API, Mobile — composant client, filtre sans rechargement), grille des 4 projets publiés suivants, bouton « Voir tous les projets ».
3. **03 — À propos** (fond `surface`) : portrait 4:5, titre, texte court, lien « En savoir plus sur moi », liste « Stack » (compétences `showInStack`).
4. **04 — Contact** : titre centré 64px « Un projet en tête ? », phrase, boutons « Écrire un message » (→ `/contact`), GitHub, LinkedIn.

### Projets `/projets` — `Projets.dc.html`
En-tête (sur-titre, « Tous mes projets. », phrase) ; barre de filtres + compteur « N projets » (`aria-live="polite"`) ; grille de toutes les cartes projet ; bande d'appel « Un projet en tête ? ». Le filtre est reflété dans l'URL (`?categorie=Web`) pour être partageable.

### Détail projet `/projets/[slug]` — `Projet.dc.html`
Lien retour « Tous les projets » ; sur-titre + badge ; titre 64px + point ; chapeau ; boutons « Ouvrir l'app » (principal), « Documentation », « Code source » (affichés seulement si l'URL existe) ; **fiche** en 4 colonnes (Rôle, Année, Durée, Stack) ; capture principale ; sections **A — Le contexte**, **B — Ce que j'ai construit** (liste avec flèches `→`), **C — Résultat** ; captures secondaires ; navigation « Tous les projets » / « Projet suivant ». `generateStaticParams` + `generateMetadata` (image OG = couverture).

### À propos `/a-propos` — `APropos.dc.html`
Portrait + « Je suis Archange YEBOUET. », texte long, localisation et disponibilité (point `accent` + « Disponible · à partir de… », masqué si `available` est faux), boutons « Télécharger le CV » et « Me contacter » ; **A — Compétences / Ce que je fais** : 3 cartes (groupes + étiquettes) ; **B — Parcours** : frise en 2 colonnes (période en mono, titre, description) ; bande « On travaille ensemble ? ».

### Contact `/contact` — `Contact.dc.html`
À gauche : sur-titre, « Parlons de ton projet. », phrase, liste Email / Réseaux / Basé à. À droite, dans une carte : choix du sujet en pastilles (« C'est pour… » : Projet web, App mobile, Poste / mission, Autre — `aria-pressed`), champs Nom, Email, Message, bouton « Envoyer le message » + « Réponse sous 48 h ». Erreurs **exactement** comme la maquette (« Indique ton nom. », « Adresse email incomplète. », « Écris quelques mots sur ton projet. »), affichées après la première tentative. Succès : écran « Message envoyé. Merci {prénom}. Je te réponds sous 48 h à {email}. » avec « Voir les projets » et « Écrire un autre message ».
- Server Action + Zod (nom 2–80, email valide, message 5–2000, sujet dans la liste).
- Anti-spam : champ caché « pot de miel » + **5 messages max par heure et par IP** (via `messages.ipHash`).

### Thème
- **Le site s'ouvre en thème sombre** (`data-theme="dark"`), comme les maquettes. Le thème clair de la charte (fond lin) est disponible via un petit bouton de bascule dans le header ; le choix est mémorisé dans un cookie `theme` et appliqué côté serveur (pas de flash). Sans cookie : sombre.

---

## 7. Espace admin (`/admin`)

- **Connexion** `/admin/login` : un champ mot de passe comparé à `ADMIN_PASSWORD_HASH` (bcrypt). Succès → cookie `session` httpOnly, `Secure`, `SameSite=Lax`, signé avec `SESSION_SECRET`, 7 jours. 5 essais ratés → attente de 10 minutes.
- **`middleware.ts`** : toute route `/admin/*` (sauf `/admin/login`) sans session valide redirige vers `/admin/login`. Chaque Server Action admin **revérifie** la session.
- **Tableau de bord** : projets publiés / brouillons, messages non lus, raccourci « Nouveau projet ».
- **Projets** : liste (titre, catégorie, statut, vedette), réordonner par glisser-déposer, créer, modifier, publier/dépublier, supprimer (avec confirmation). Formulaire couvrant **tous** les champs de la table : catégorie, résumé, intro, couverture + galerie (upload), technos (saisie en étiquettes), rôle, année, durée, contexte, fonctionnalités (liste éditable titre + description), résultat, URL app / docs / code, vedette (cocher un projet décoche l'ancien), publié.
- **Compétences** : groupes (nom, description, ordre) et étiquettes (groupe, « afficher dans Stack », ordre).
- **Parcours** : lignes de la frise (période, titre, description, type, ordre).
- **Profil** : tous les champs de `profile`, portrait et CV en upload.
- **Messages** : non lus en premier, sujet en étiquette, marquer lu/non lu, supprimer, « Répondre » (`mailto:`).
- Design admin : mêmes variables et polices que le site, mise en page sobre avec barre latérale, lignes bordées plutôt que cartes. `warning` pour brouillons et non-lus, `danger` pour les suppressions — toujours avec un libellé.

### Upload
`/api/upload` (admin uniquement) renvoie une **signature Cloudinary** ; le navigateur envoie le fichier directement à Cloudinary (dossier `portfolio/`), puis l'URL est enregistrée. jpg, png, webp, pdf (CV) ; 5 Mo max. Affichage via `next/image` avec le loader Cloudinary (`f_auto,q_auto`).

---

## 8. Charte graphique — règles à appliquer

Source : `charte/charte-graphique.pdf` et `charte/code/`. Les maquettes l'appliquent déjà ; voici les règles à garder en codant :

- **Variables** : copie `charte/code/tokens.css` dans `src/styles/`. **Aucune couleur, taille ou durée en dur** : toujours `var(--…)`. Correspondance hex → variable dans `design/README.md`. `charte/code/components.css` sert d'exemple de styles (boutons, étiquettes, champs) ; la maquette prime s'il y a une différence.
- **Couleurs** (sombre par défaut / clair) : `bg` #1f1c19 / #f8f5f0 · `surface` #26221e / #f2ede5 · `surface-raised` #2d2924 / #fffdfa · `line` #3a352f / #e7e0d6 · `line-strong` #7f766c / #8c8277 · `ink` #efe9e1 / #26221d · `ink-muted` #b7aea3 / #655c53 · `ink-subtle` #9e958a / #73695f · `accent` (terracotta) #e3997e / #a24b2b · `accent-soft` #3d2b22 / #f5e3da · `on-accent` #2a150c / #ffffff · `danger` #f2a39b / #9e2a2b. Une seule couleur de marque : la terracotta.
- **Typographie** : Geist (texte) et Geist Mono (sur-titres, étiquettes, périodes). Tailles des maquettes : 64/68 (titres de page), 44/50, 30/38, 20/28, 18/30 (chapeaux), 16/26 (texte), 14/22, 12/16 mono capitales espacées 0,08em. Titres en 600 avec interlettrage négatif.
- **Espace** : conteneur 1120px, marges latérales `clamp(16px, 5vw, 64px)`, 96–128px entre sections, rayons 6 / 10 / 16px, zones cliquables d'au moins 44px de haut.
- **Logo** : texte réel `archange` + point `accent` (jamais une image dans le header). Tuile « a. » du hero et favicon = `charte/logos/svg/app-icon.svg`.
- **Animations** (valeurs des maquettes) : survol couleurs 150ms ; cartes −4px + ombre 300ms ; apparition `.rise` (fondu + 16px, 700ms) au défilement, une seule fois, décalée de 80ms entre éléments ; point final `.dot` (échelle 0 → 1,25 → 1, 500ms, délai 600ms) ; courbe `cubic-bezier(.22,1,.36,1)`. **Interdits** : rebonds, parallaxe, effets qui suivent la souris, boucles. Tout est coupé avec `prefers-reduced-motion`.
- **Ton** : première personne, tutoiement, phrases courtes, pas de superlatifs, pas d'emoji. Garder les textes fixes des maquettes mot pour mot.
- **Accessibilité** : contrastes déjà validés — n'introduis pas d'autres couleurs. Focus visible (`outline` 2px `accent`, décalage 2px), navigation clavier complète, `alt` sur toutes les images, libellés sur tous les champs, `lang="fr"`.

---

## 9. Variables d'environnement (`.env.example`)

```bash
DATABASE_URL=            # chaîne de connexion Neon (pooled)
SESSION_SECRET=          # 32+ caractères aléatoires
ADMIN_PASSWORD_HASH=     # bcrypt du mot de passe admin (script fourni : npm run hash-password)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
IP_HASH_SECRET=          # pour hasher les IP du formulaire de contact
NEXT_PUBLIC_SITE_URL=    # https://… (sitemap, OG)
```

L'application **refuse de démarrer** si une variable obligatoire manque (validation Zod dans `lib/env.ts`). Aucun secret par défaut dans le code.

---

## 10. Étapes, dans l'ordre

1. **Lire** `design/README.md`, ouvrir les 5 captures et les maquettes ; lister les composants communs.
2. **Initialiser** Next.js (TypeScript, App Router, ESLint, `src/`) à la racine ; `.gitignore` (inclure `.idea/`, `.env*.local`).
3. **Styles et composants de base** : variables de la charte, polices `geist`, thème sombre par défaut + bascule, Header, Footer, Button, Tag, Eyebrow, Reveal, AnimatedDot.
4. **Base de données** : schéma Drizzle, première migration, client Neon, `npm run db:seed` avec le contenu des maquettes.
5. **Pages publiques** dans l'ordre : Accueil, Projets, Détail projet, À propos, Contact — comparer chaque page à sa capture à 1440px et vérifier le rendu à 375px.
6. **Formulaire de contact** : Server Action, validation, anti-spam, stockage, écran de succès.
7. **Auth admin** : login, session, middleware, script de hash du mot de passe.
8. **Admin** : tableau de bord, projets (upload, galerie, fonctionnalités, réordonnancement), compétences, parcours, profil, messages ; revalidation du site après chaque modification.
9. **SEO et finitions** : `metadata` par page, image Open Graph aux couleurs de la charte, `sitemap.ts`, `robots.ts`, favicon, page 404 dans le style du site.
10. **Nettoyage** : une fois tout vérifié, **supprimer** `portfolio-api/`, `portfolio-frontend/`, `portfolio-admin/` et `README.mdgit` ; réécrire `README.md` en UTF-8 (présentation, installation locale, variables, déploiement).
11. **Déploiement** : documenter dans le README la création du projet Neon, du compte Cloudinary et l'import sur Vercel (variables d'environnement, `drizzle-kit migrate` avant le premier déploiement).

---

## 11. Critères d'acceptation

- [ ] `npm run build` passe sans erreur ; `npm run lint` est propre.
- [ ] Les 5 pages correspondent visuellement à leurs captures (`design/captures/`) à 1440px, et restent lisibles à 375px.
- [ ] Toutes les données affichées (profil, projets, compétences, parcours) viennent de Neon ; aucun texte entre crochets ne reste à l'écran.
- [ ] Les filtres Web / Mobile / API fonctionnent sur l'accueil et sur `/projets`, avec le compteur à jour.
- [ ] Ajouter ou modifier un projet dans l'admin le fait apparaître sur le site sans redéploiement.
- [ ] `/admin` est inaccessible sans connexion, y compris les Server Actions appelées directement.
- [ ] Le formulaire de contact enregistre le message avec son sujet, affiche les erreurs de la maquette et bloque au-delà de 5 envois/heure.
- [ ] Thème sombre par défaut, bascule claire sans flash, choix mémorisé.
- [ ] Aucune couleur hors variables de la charte ; animations conformes ; `prefers-reduced-motion` respecté.
- [ ] Lighthouse mobile ≥ 95 en Performance, Accessibilité, Bonnes pratiques et SEO.
- [ ] Les anciens dossiers sont supprimés et le README explique comment lancer et déployer le projet.
