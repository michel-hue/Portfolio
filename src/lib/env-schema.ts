// Sans « server-only » : ce module est aussi chargé par instrumentation.ts.
// Les composants doivent passer par env.ts.
import { z } from "zod";

/*
 * Variables d'environnement serveur, validées au premier import.
 * Aucune valeur par défaut pour les secrets : si une variable manque,
 * l'application refuse de démarrer avec un message clair (voir instrumentation.ts).
 */

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

const coreSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL doit être une URL PostgreSQL (chaîne de connexion Neon)."),
  IP_HASH_SECRET: z
    .string()
    .min(32, "IP_HASH_SECRET doit faire au moins 32 caractères aléatoires."),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET doit faire au moins 32 caractères aléatoires."),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL doit être l'adresse du site (https://…).")
    .transform((url) => url.replace(/\/+$/, "")),
});

/**
 * Variables de l'admin. Hash bcrypt du mot de passe admin, encodé en base64
 * (les « $ » du hash brut sont mal lus dans les fichiers .env). Généré par `npm run hash-password`.
 */
const adminSchema = z.object({
  ADMIN_PASSWORD_HASH: z
    .string({ error: "ADMIN_PASSWORD_HASH manquante : lance `npm run hash-password`." })
    .transform((value) => Buffer.from(value, "base64").toString("utf8"))
    .refine((hash) => BCRYPT_RE.test(hash), {
      message: "ADMIN_PASSWORD_HASH invalide : relance `npm run hash-password`.",
    }),
  CLOUDINARY_CLOUD_NAME: z.string({ error: "CLOUDINARY_CLOUD_NAME manquante." }).min(1),
  CLOUDINARY_API_KEY: z.string({ error: "CLOUDINARY_API_KEY manquante." }).regex(/^\d+$/,"CLOUDINARY_API_KEY doit être numérique."),
  CLOUDINARY_API_SECRET: z.string({ error: "CLOUDINARY_API_SECRET manquante." }).min(10),
});

function parse<T extends z.ZodType>(schema: T): z.infer<T> {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")} : ${issue.message}`)
      .join("\n");
    throw new Error(`Variables d'environnement invalides ou manquantes :\n${details}`);
  }
  return parsed.data;
}

export const env = parse(coreSchema);

let adminEnvCache: z.infer<typeof adminSchema> | undefined;

/**
 * Variables de l'admin, validées à la demande : le site public peut être
 * construit avant que le mot de passe soit défini. Le serveur, lui, vérifie
 * tout au démarrage (instrumentation.ts).
 */
export function getAdminEnv() {
  adminEnvCache ??= parse(adminSchema);
  return adminEnvCache;
}
