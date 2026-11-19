import { z } from "zod";
import { EXPERIENCE_KINDS, PROJECT_CATEGORIES } from "./constants";

/** Résultat renvoyé par les Server Actions de formulaire de l'admin. */
export type FormState = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string>;
};

export const EMPTY_FORM_STATE: FormState = { ok: false, message: null, errors: {} };

/* ---------- Lecture du FormData ---------- */

/** Objet simple depuis FormData : chaînes « trimées », cases à cocher → booléens, JSON décodé. */
export function readForm(formData: FormData, options: { booleans?: string[]; json?: string[] } = {}) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) continue;
    if (typeof value === "string") out[key] = value.trim();
  }
  for (const key of options.booleans ?? []) out[key] = formData.get(key) === "on";
  for (const key of options.json ?? []) {
    const raw = formData.get(key);
    try {
      out[key] = typeof raw === "string" && raw !== "" ? JSON.parse(raw) : [];
    } catch {
      out[key] = undefined; // fera échouer la validation Zod
    }
  }
  return out;
}

export function zodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

export function invalid(errors: Record<string, string>): FormState {
  return { ok: false, message: "Corrige les champs signalés.", errors };
}

/* ---------- Briques Zod ---------- */

/** Texte facultatif : chaîne vide → null. */
const optionalText = (max: number) =>
  z
    .string()
    .max(max, `${max} caractères maximum.`)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null);

const requiredText = (label: string, max: number) =>
  z.string({ error: `${label} obligatoire.` }).min(1, `${label} obligatoire.`).max(max, `${max} caractères maximum.`);

/** URL http(s) facultative. */
const optionalUrl = z
  .string()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null)
  .refine((v) => v === null || /^https?:\/\/\S+$/.test(v), "Adresse web invalide (https://…).");

const cloudinaryUrl = z
  .string()
  .regex(/^https:\/\/res\.cloudinary\.com\/\S+$/, "Fichier Cloudinary attendu.");

const optionalCloudinaryUrl = z
  .string()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null)
  .refine((v) => v === null || cloudinaryUrl.safeParse(v).success, "Fichier Cloudinary attendu.");

const orderField = z.coerce.number().int("Nombre entier attendu.").min(0).max(9999).default(0);

/** « Mon Projet Été » → « mon-projet-ete ». */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ---------- Schémas ---------- */

export const projectSchema = z.object({
  title: requiredText("Titre", 120),
  slug: z
    .string()
    .max(80)
    .regex(/^[a-z0-9-]*$/, "Minuscules, chiffres et tirets uniquement.")
    .default(""),
  category: z.enum(PROJECT_CATEGORIES, { error: "Choisis une catégorie." }),
  context: optionalText(80),
  summary: requiredText("Résumé", 300),
  intro: optionalText(400),
  coverUrl: optionalCloudinaryUrl,
  gallery: z.array(cloudinaryUrl, { error: "Galerie invalide." }).max(12, "12 captures maximum."),
  technologies: z
    .array(z.string().trim().min(1).max(40), { error: "Technologies invalides." })
    .max(20, "20 technologies maximum."),
  role: optionalText(120),
  year: z
    .string()
    .transform((v) => (v === "" ? null : Number(v)))
    .nullable()
    .default(null)
    .refine((v) => v === null || (Number.isInteger(v) && v >= 2000 && v <= 2100), "Année invalide."),
  duration: optionalText(60),
  contextTitle: optionalText(200),
  contextBody: optionalText(1500),
  features: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Chaque fonctionnalité a besoin d’un titre.").max(120),
        description: z.string().trim().max(400).default(""),
      }),
      { error: "Fonctionnalités invalides." },
    )
    .max(20, "20 fonctionnalités maximum."),
  result: optionalText(1500),
  appUrl: optionalUrl,
  docsUrl: optionalUrl,
  sourceUrl: optionalUrl,
  published: z.boolean(),
});

export const skillGroupSchema = z.object({
  name: requiredText("Nom", 60),
  description: requiredText("Description", 300),
  order: orderField,
});

export const skillSchema = z.object({
  groupId: z.coerce.number().int().positive("Groupe invalide."),
  name: requiredText("Nom", 40),
  showInStack: z.boolean(),
  order: orderField,
});

export const experienceSchema = z.object({
  period: requiredText("Période", 40),
  title: requiredText("Titre", 200),
  description: optionalText(400),
  kind: z.enum(EXPERIENCE_KINDS, { error: "Type invalide." }),
  order: orderField,
});

export const profileSchema = z.object({
  fullName: requiredText("Nom complet", 80),
  shortName: requiredText("Logo texte", 30),
  role: requiredText("Rôle", 80),
  city: requiredText("Ville", 60),
  country: requiredText("Pays", 60),
  timezone: optionalText(20),
  heroTitle: requiredText("Titre d’accueil", 120),
  heroIntro: requiredText("Introduction", 300),
  aboutTitle: requiredText("Titre « À propos »", 120),
  aboutShort: requiredText("Texte court", 600),
  aboutLong: requiredText("Texte long", 2000),
  email: z.string().email("Adresse email invalide."),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  portraitUrl: optionalCloudinaryUrl,
  resumeUrl: optionalCloudinaryUrl,
  available: z.boolean(),
  availableFrom: optionalText(60),
  responseTime: requiredText("Délai de réponse", 20),
});

export const idSchema = z.coerce.number().int().positive();
