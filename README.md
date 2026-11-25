# archange. — portfolio

Portfolio d’**Archange YEBOUET**, développeur web et mobile à Abidjan.

Une seule application Next.js contient :

- le **site public** : accueil, projets, page de chaque projet, à propos, contact ;
- un **espace admin** sur `/admin` pour gérer projets, compétences, parcours, profil et messages ;
- la **logique serveur** (Server Actions) : pas d’API séparée.

Hébergement prévu à **0 €** : Vercel (Hobby), Neon (PostgreSQL gratuit), Cloudinary (gratuit).

---

## Stack

| Besoin | Choix |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict, Cache Components) |
| Base de données | Neon — PostgreSQL serverless |
| ORM | Drizzle ORM + `@neondatabase/serverless`, migrations SQL versionnées (`drizzle/`) |
| Images et CV | Cloudinary, upload signé depuis l’admin |
| Validation | Zod |
| Auth admin | Mot de passe unique (bcrypt) + session en cookie signé (`jose`, JWT HS256, 7 jours) |
| Styles | CSS natif : variables de la charte (`src/styles/tokens.css`) + CSS Modules |
| Polices | Geist et Geist Mono (paquet `geist`) |
| Icônes | `lucide-react` |

## Structure

```
├── charte/                 charte graphique (référence, ne pas modifier)
├── design/                 maquettes des 5 écrans (référence, ne pas modifier)
├── drizzle/                migrations SQL générées
├── assets/og-fonts/        polices TTF des images de partage
├── scripts/hash-password.mjs
└── src/
    ├── app/
    │   ├── (site)/         pages publiques (/, /projets, /projets/[slug], /a-propos, /contact)
    │   ├── admin/          /admin/login + espace protégé (app)/…
    │   ├── api/upload/     signature d’upload Cloudinary (admin uniquement)
    │   ├── opengraph-image.tsx · sitemap.ts · robots.ts · not-found.tsx
    │   └── layout.tsx      <html>, polices, thème, métadonnées
    ├── actions/            Server Actions (contact, connexion, admin)
    ├── components/site/    composants du site
    ├── components/admin/   composants de l’admin
    ├── db/                 schéma Drizzle, client, seed
    ├── lib/                auth, validation, requêtes, env, Cloudinary…
    ├── proxy.ts            redirige /admin/* vers /admin/login sans session
    └── styles/             tokens.css (charte) + globals.css
```

## Installation locale

Prérequis : **Node.js 20.9 ou plus**, un compte **Neon** et un compte **Cloudinary** (gratuits).

```bash
npm install
cp .env.example .env.local      # puis remplis les valeurs (voir ci-dessous)
npm run hash-password           # choisis le mot de passe admin (écrit dans .env.local)
npm run db:migrate              # crée les tables dans Neon
npm run db:seed                 # contenu initial (profil, projets, compétences, parcours)
npm run dev                     # http://localhost:3000 — admin : http://localhost:3000/admin
```

> ⚠️ `npm run db:seed` **vide** le profil, les projets, les compétences et le parcours avant de les remplir.
> À lancer une seule fois, sur une base neuve. Les messages de contact ne sont jamais touchés.

## Variables d’environnement

Toutes sont obligatoires. Si l’une manque ou est invalide, le serveur affiche un message clair au démarrage
et refuse de servir les pages (validation Zod dans `src/lib/env-schema.ts`). Aucun secret n’a de valeur par défaut.

| Variable | Rôle | Comment l’obtenir |
|---|---|---|
| `DATABASE_URL` | Connexion PostgreSQL | Neon → projet → *Connection string* (version **pooled**) |
| `SESSION_SECRET` | Signature du cookie de session admin | 32+ caractères aléatoires (voir ci-dessous) |
| `IP_HASH_SECRET` | Empreinte des IP (anti-spam, blocage des connexions) | 32+ caractères aléatoires |
| `ADMIN_PASSWORD_HASH` | Mot de passe admin, haché | `npm run hash-password` |
| `CLOUDINARY_CLOUD_NAME` | Compte Cloudinary | Cloudinary → *Dashboard* |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | Cloudinary → *Settings → API Keys* |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | idem |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site (sitemap, partage, liens canoniques) | `http://localhost:3000` en local, l’adresse Vercel en production |

Générer un secret aléatoire :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

**À propos de `ADMIN_PASSWORD_HASH`** : c’est un hash bcrypt **encodé en base64**. Un hash bcrypt brut contient
des `$` que Next.js interprète dans les fichiers `.env` (le hash serait abîmé). Utilise toujours
`npm run hash-password` : il écrit la valeur dans `.env.local` et l’affiche pour la copier sur Vercel.

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build de production / serveur de production |
| `npm run lint` | ESLint |
| `npm run db:generate` | Génère une migration SQL après une modification de `src/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations en attente sur la base de `DATABASE_URL` |
| `npm run db:seed` | Contenu initial (⚠️ écrase le contenu, voir plus haut) |
| `npm run db:studio` | Explorateur de la base (Drizzle Studio) |
| `npm run hash-password` | Définit ou change le mot de passe admin |

Les tables ne sont **jamais** synchronisées automatiquement : toute modification du schéma passe par
`db:generate` (fichier SQL versionné dans `drizzle/`) puis `db:migrate`.

## Espace admin

- **Connexion** : `/admin/login`. Après 5 essais ratés depuis la même adresse IP, il faut attendre 10 minutes.
- **Projets** : création et modification de tous les champs, captures (Cloudinary), réordonnancement par
  glisser-déposer ou flèches (l’ordre donne les numéros « 01 », « 02 »… du site ; les 4 premiers apparaissent
  sur l’accueil), publication.
- **Compétences**, **Parcours**, **Certifications** (intitulé, organisme, date, n°, lien de vérification ; section
  « C — Certifications » de la page À propos, masquée tant qu’elle est vide), **Profil** (textes, liens, portrait,
  CV en PDF), **Messages** du formulaire de contact.
- Chaque modification met le site à jour **sans redéploiement**.

Fichiers acceptés : JPG, PNG, WebP (images) et PDF (CV), 5 Mo maximum. Ils sont rangés dans le dossier
`portfolio/` de Cloudinary.

## Déploiement (Vercel + Neon + Cloudinary)

1. **Neon** — crée un compte sur [neon.tech](https://neon.tech) (plan *Free*, sans carte), puis un projet
   (région proche de tes visiteurs, ex. Europe). Copie la *connection string* **pooled** : c’est `DATABASE_URL`.
2. **Cloudinary** — crée un compte sur [cloudinary.com](https://cloudinary.com) (plan *Free*). Note le
   *cloud name*, l’*API key* et l’*API secret*.
3. **Base de données** — depuis ton poste, avec la `DATABASE_URL` de production dans `.env.local` :
   ```bash
   npm run db:migrate     # obligatoire avant le premier déploiement
   npm run db:seed        # seulement si la base est neuve
   ```
4. **Vercel** — sur [vercel.com](https://vercel.com) (plan *Hobby*) : *Add New → Project*, importe le dépôt
   GitHub `michel-hue/Portfolio`. Framework : Next.js (détecté), commandes par défaut.
5. **Variables d’environnement** — dans *Settings → Environment Variables*, ajoute les 8 variables du tableau
   ci-dessus. `NEXT_PUBLIC_SITE_URL` = l’adresse définitive (ex. `https://archange.vercel.app`, sans `/` final).
   `ADMIN_PASSWORD_HASH` = la valeur affichée par `npm run hash-password`.
6. **Déployer**, puis vérifier : le site, `/admin/login`, l’envoi d’un message de contact, l’upload d’une image.

Pour chaque nouvelle migration : `npm run db:migrate` sur la base de production **avant** de déployer le code
qui en dépend.

## Références

- `REFONTE.md` — cahier des charges de la refonte.
- `design/` — maquettes (la maquette prime en cas de doute).
- `charte/` — charte graphique, variables CSS, polices et logos.
