import { z } from "zod";
import { MESSAGE_TOPICS } from "./constants";

/**
 * Messages d'erreur du formulaire de contact — mot pour mot ceux de la maquette.
 * Partagés par la validation client (affichage immédiat) et serveur (Zod).
 */
export const CONTACT_ERRORS = {
  name: "Indique ton nom.",
  email: "Adresse email incomplète.",
  message: "Écris quelques mots sur ton projet.",
} as const;

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  messageMin: 5,
  messageMax: 2000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.nameMin, CONTACT_ERRORS.name)
    .max(CONTACT_LIMITS.nameMax, CONTACT_ERRORS.name),
  email: z.string().trim().toLowerCase().email(CONTACT_ERRORS.email).max(254, CONTACT_ERRORS.email),
  topic: z.enum(MESSAGE_TOPICS),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, CONTACT_ERRORS.message)
    .max(CONTACT_LIMITS.messageMax, CONTACT_ERRORS.message),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Validation côté client, alignée sur le schéma serveur. Renvoie les champs en erreur. */
export function contactClientErrors(fields: Record<ContactField, string>) {
  const name = fields.name.trim();
  const message = fields.message.trim();
  return {
    name: name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax,
    email: !EMAIL_RE.test(fields.email.trim()),
    message: message.length < CONTACT_LIMITS.messageMin || message.length > CONTACT_LIMITS.messageMax,
  };
}
