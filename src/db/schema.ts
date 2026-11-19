import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
// Chemin relatif : ce fichier est aussi lu par drizzle-kit et le script de seed.
import { EXPERIENCE_KINDS, MESSAGE_TOPICS, PROJECT_CATEGORIES } from "../lib/constants";

/* Chaque champ correspond à un emplacement visible dans les maquettes (REFONTE.md §5). */

export { EXPERIENCE_KINDS, MESSAGE_TOPICS, PROJECT_CATEGORIES };
export type { ExperienceKind, MessageTopic, ProjectCategory } from "../lib/constants";

export type ProjectFeature = { title: string; description: string };

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Profil — une seule ligne. */
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  shortName: text("short_name").notNull(),
  role: text("role").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone"),
  /** Le point final est ajouté par le composant. */
  heroTitle: text("hero_title").notNull(),
  heroIntro: text("hero_intro").notNull(),
  aboutTitle: text("about_title").notNull(),
  aboutShort: text("about_short").notNull(),
  aboutLong: text("about_long").notNull(),
  email: text("email").notNull(),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  portraitUrl: text("portrait_url"),
  resumeUrl: text("resume_url"),
  available: boolean("available").notNull().default(true),
  /** Affiché après « Disponible · ». */
  availableFrom: text("available_from"),
  responseTime: text("response_time").notNull().default("48 h"),
  updatedAt: timestamps.updatedAt,
});

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category", { enum: PROJECT_CATEGORIES }).notNull(),
    /** Cadre du projet : « Chez Syabe Technologies », « Projet d'école », « Projet personnel ». */
    context: text("context"),
    summary: text("summary").notNull(),
    intro: text("intro"),
    coverUrl: text("cover_url"),
    gallery: text("gallery").array().notNull().default([]),
    technologies: text("technologies").array().notNull().default([]),
    role: text("role"),
    year: integer("year"),
    duration: text("duration"),
    contextTitle: text("context_title"),
    contextBody: text("context_body"),
    features: jsonb("features").$type<ProjectFeature[]>().notNull().default([]),
    result: text("result"),
    appUrl: text("app_url"),
    docsUrl: text("docs_url"),
    sourceUrl: text("source_url"),
    published: boolean("published").notNull().default(false),
    /** Sert aussi au numéro affiché « 01 », « 02 »… */
    order: integer("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("projects_published_order_idx").on(t.published, t.order),
  ],
);

/** Les 3 cartes « Ce que je fais ». */
export const skillGroups = pgTable("skill_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
});

/** Étiquettes de chaque groupe ; `showInStack` = liste « Stack » de l'accueil. */
export const skills = pgTable(
  "skills",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => skillGroups.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    showInStack: boolean("show_in_stack").notNull().default(false),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("skills_group_idx").on(t.groupId)],
);

/** Page À propos, « B — Parcours ». */
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(),
  /** « Poste · Entreprise » ou « Diplôme · École ». */
  title: text("title").notNull(),
  description: text("description"),
  kind: text("kind", { enum: EXPERIENCE_KINDS }).notNull().default("work"),
  order: integer("order").notNull().default(0),
});

/** Formulaire de contact. */
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    topic: text("topic", { enum: MESSAGE_TOPICS }).notNull(),
    body: text("body").notNull(),
    read: boolean("read").notNull().default(false),
    ipHash: text("ip_hash"),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("messages_ip_created_idx").on(t.ipHash, t.createdAt)],
);

export type Profile = typeof profile.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type SkillGroup = typeof skillGroups.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Message = typeof messages.$inferSelect;

/** Essais de connexion admin ratés (blocage 10 min après 5 échecs par IP). */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("login_attempts_ip_created_idx").on(t.ipHash, t.createdAt)],
);
