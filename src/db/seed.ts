/*
 * Contenu initial du portfolio : `npm run db:seed`.
 * Source : CV d'Archange YEBOUET + textes fixes des maquettes.
 *
 * Règles de contenu :
 * - aucun nom de client n'est publié ; les projets réalisés chez Syabe
 *   Technologies sont décrits de façon neutre ;
 * - seules les contributions d'Archange sont présentées ;
 * - pas de téléphone ni de quartier.
 *
 * ATTENTION : le script VIDE les tables de contenu (profil, projets, compétences,
 * parcours) avant de les remplir. Les messages de contact ne sont jamais touchés.
 */
import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import type { NewProject } from "./schema";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL manquante (.env.local).");

const db = drizzle(neon(url), { schema });

const SYABE = "Chez Syabe Technologies";
const SCHOOL = "Projet d'école";
const PERSONAL = "Projet personnel";

const profileData: typeof schema.profile.$inferInsert = {
  fullName: "Archange YEBOUET",
  shortName: "archange",
  role: "Développeur web et mobile",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  timezone: "GMT",
  heroTitle: "Je construis des produits web nets",
  heroIntro:
    "De la base de données à l'interface, je livre des applications simples à utiliser et simples à maintenir.",
  aboutTitle: "Basé à Abidjan, je travaille partout.",
  aboutShort:
    "Je développe des applications web et mobiles chez Syabe Technologies depuis 2025, en parallèle d'une licence en E-Administration et Transformation Digitale. J'aime les interfaces claires et le code facile à reprendre. En équipe, je pose des questions tôt et je livre par petites étapes.",
  aboutLong:
    "Je suis étudiant à l'Université Virtuelle de Côte d'Ivoire, en licence E-Administration et Transformation Digitale. Depuis 2025, je développe chez Syabe Technologies les interfaces Angular et les applications Flutter de plateformes métier, et je contribue aux API NestJS qui les servent. À côté, je construis mes propres projets avec Nuxt.js et Flutter. Ce qui m'intéresse : des formulaires qui guident au lieu de bloquer, des données cohérentes, du code testé.",
  email: "archangeyebouet5@gmail.com",
  githubUrl: "https://github.com/michel-hue",
  linkedinUrl: null,
  portraitUrl: null,
  resumeUrl: null,
  available: true,
  availableFrom: null,
  responseTime: "48 h",
};

const projectData: NewProject[] = [
  {
    slug: "welly",
    title: "Welly",
    category: "Web",
    context: PERSONAL,
    summary: "Application web de location de maisons : recherche de logements et réservation.",
    technologies: ["Nuxt.js", "Sass"],
    role: "Conception et développement front",
    features: [
      {
        title: "Recherche de logements",
        description: "Interface de recherche pour trouver une maison à louer.",
      },
      {
        title: "Réservation",
        description: "Parcours de réservation d'un logement depuis sa fiche.",
      },
    ],
    published: true,
    order: 1,
  },
  {
    slug: "portail-manifestes",
    title: "Portail de dépôt des manifestes",
    category: "Web",
    context: SYABE,
    summary:
      "Plateforme où les consignataires déposent leurs manifestes maritimes et aériens, pour une administration publique.",
    technologies: ["Angular", "NestJS", "PostgreSQL"],
    role: "Développeur front-end",
    year: 2025,
    features: [
      {
        title: "Formulaires réactifs",
        description: "Saisie des manifestes avec validation au fil de la frappe.",
      },
      {
        title: "Dépôt de fichiers",
        description: "Téléversement par glisser-déposer.",
      },
      {
        title: "Sécurité côté client",
        description: "Intercepteurs JWT et routage protégé.",
      },
      {
        title: "API et tests",
        description: "Contributions à l'API NestJS et écriture de tests.",
      },
    ],
    published: true,
    order: 2,
  },
  {
    slug: "gestion-visites",
    title: "Gestion des dossiers et des visites",
    category: "Web",
    context: SYABE,
    summary:
      "Deux plateformes, pour les agents et pour les opérateurs économiques, qui gèrent dossiers et rendez-vous de visite.",
    technologies: ["Angular", "NestJS"],
    role: "Développeur front-end",
    year: 2025,
    features: [
      {
        title: "Deux interfaces",
        description: "Front Angular de la plateforme agents et de la plateforme opérateurs.",
      },
      {
        title: "Validation hiérarchique",
        description: "Suivi des dossiers à chaque étape du circuit de validation.",
      },
      {
        title: "API et tests",
        description: "Contributions à l'API NestJS et écriture de tests.",
      },
    ],
    published: true,
    order: 3,
  },
  {
    slug: "pointage-agents",
    title: "Pointage des agents",
    category: "Mobile",
    context: SYABE,
    summary:
      "Application mobile de pointage par sessions pour des agents de terrain, avec sélection des coéquipiers.",
    technologies: ["Flutter", "Angular", "NestJS"],
    role: "Développeur mobile",
    year: 2025,
    features: [
      {
        title: "Application mobile",
        description: "Développement de l'application Flutter de pointage.",
      },
      {
        title: "Spécifications",
        description: "Rédaction des user stories et des spécifications fonctionnelles du pointage.",
      },
      {
        title: "Plateforme web",
        description: "Développement de plusieurs modules de la plateforme Angular.",
      },
    ],
    published: true,
    order: 4,
  },
  {
    slug: "alfalq",
    title: "ALFALQ",
    category: "Mobile",
    context: SYABE,
    summary: "Application mobile de lecture du Coran avec les heures de prière.",
    technologies: ["Flutter"],
    role: "Développeur mobile",
    published: true,
    order: 5,
  },
  {
    slug: "suivi-elevage",
    title: "Suivi d'élevage",
    category: "Web",
    context: SYABE,
    summary: "Module de production bovine d'une plateforme de suivi d'élevage : sujets et déclarations de maladie.",
    technologies: ["Angular", "NestJS"],
    role: "Développeur front-end",
    year: 2025,
    features: [
      {
        title: "Déclaration de maladie",
        description: "Fenêtre de déclaration depuis la fiche de l'animal.",
      },
      {
        title: "Contrôles de saisie",
        description: "Cohérence entre date de naissance et date de déclaration.",
      },
    ],
    published: true,
    order: 6,
  },
  {
    slug: "nettoci",
    title: "NETTOCI",
    category: "Mobile",
    context: SCHOOL,
    summary: "Application citoyenne de signalement de la propreté urbaine à Abobo (Abidjan).",
    technologies: ["Flutter", "React"],
    role: "Développeur front mobile et web",
    features: [
      {
        title: "Application mobile",
        description: "Front Flutter pour signaler un problème de propreté.",
      },
      {
        title: "Tableau de bord web",
        description: "Front React avec graphiques de suivi des signalements.",
      },
    ],
    result: "Le back-end a été réalisé par d'autres membres du projet.",
    published: true,
    order: 7,
  },
  {
    slug: "qrpaypro",
    title: "QRPayPro",
    category: "Mobile",
    context: PERSONAL,
    summary: "Application de paiement mobile, avec Mobile Money et carte.",
    technologies: ["Flutter"],
    role: "Collaboration sur la partie mobile",
    features: [
      {
        title: "Intégration FlexPay",
        description: "Paiement par Mobile Money et par carte via l'API FlexPay.",
      },
      {
        title: "Ajout d'argent",
        description: "Nouveaux moyens de paiement sur la page d'ajout d'argent.",
      },
    ],
    published: true,
    order: 8,
  },
  {
    slug: "workstore",
    title: "Workstore",
    category: "Web",
    context: PERSONAL,
    summary:
      "Boutique en ligne de fournitures de bureau, fonctionnelle, avec sa propre API et sa base de données.",
    technologies: ["React", "NestJS", "Supabase"],
    published: true,
    order: 9,
  },
  {
    slug: "etal",
    title: "Etal",
    category: "Web",
    context: PERSONAL,
    summary: "Boutique en ligne de démonstration, figée, alimentée par une API publique gratuite.",
    technologies: ["Nuxt.js", "Tailwind CSS"],
    features: [
      {
        title: "Catalogue dynamique",
        description: "Produits chargés depuis une API publique gratuite.",
      },
    ],
    published: true,
    order: 10,
  },
];

const skillData: { name: string; description: string; skills: [string, boolean][] }[] = [
  {
    name: "Web",
    description: "Sites et applications web rapides, accessibles et faciles à maintenir.",
    skills: [
      ["Angular", true],
      ["React", true],
      ["Nuxt.js", true],
      ["Vue.js", false],
      ["HTML / CSS", false],
      ["Tailwind CSS", false],
      ["Sass", false],
    ],
  },
  {
    name: "Mobile",
    description: "Applications iOS et Android à partir d'une seule base de code.",
    skills: [["Flutter", true]],
  },
  {
    name: "Back-end",
    description: "API documentées, données bien modélisées, code testé.",
    skills: [
      ["NestJS", true],
      ["API REST", false],
      ["JWT", false],
      ["PostgreSQL", true],
      ["Git", false],
      ["Tests automatisés", false],
    ],
  },
];

const experienceData: (typeof schema.experiences.$inferInsert)[] = [
  {
    period: "2025 — auj.",
    title: "Développeur web et mobile · Syabe Technologies",
    description:
      "Fronts Angular, application mobile Flutter et contributions aux API NestJS de plateformes métier.",
    kind: "work",
    order: 1,
  },
  {
    period: "2023 — auj.",
    title: "Licence E-Administration et Transformation Digitale · Université Virtuelle de Côte d'Ivoire",
    description: "Informatique appliquée à l'administration et à la transformation digitale.",
    kind: "education",
    order: 2,
  },
  {
    period: "2023",
    title: "Baccalauréat série G1 · Lycée Technique d'Abidjan",
    description: null,
    kind: "education",
    order: 3,
  },
];

async function main() {
  console.log("Nettoyage des tables de contenu…");
  await db.delete(schema.skills);
  await db.delete(schema.skillGroups);
  await db.delete(schema.experiences);
  await db.delete(schema.projects);
  await db.delete(schema.profile);

  await db.insert(schema.profile).values(profileData);
  console.log("✓ profil");

  await db.insert(schema.projects).values(projectData);
  console.log(`✓ ${projectData.length} projets`);

  for (const [i, group] of skillData.entries()) {
    const [inserted] = await db
      .insert(schema.skillGroups)
      .values({ name: group.name, description: group.description, order: i + 1 })
      .returning({ id: schema.skillGroups.id });
    await db.insert(schema.skills).values(
      group.skills.map(([name, showInStack], j) => ({
        groupId: inserted.id,
        name,
        showInStack,
        order: j + 1,
      })),
    );
  }
  console.log(`✓ ${skillData.length} groupes de compétences`);

  await db.insert(schema.experiences).values(experienceData);
  console.log(`✓ ${experienceData.length} lignes de parcours`);
}

main()
  .then(() => {
    console.log("Seed terminé.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Échec du seed :", error);
    process.exit(1);
  });
