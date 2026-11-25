"use server";

import { eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { db, schema } from "@/db";
import {
  certificationSchema,
  experienceSchema,
  idSchema,
  invalid,
  profileSchema,
  readForm,
  skillGroupSchema,
  skillSchema,
  zodErrors,
  type FormState,
} from "@/lib/admin-form";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";

const saved = (message: string): FormState => ({ ok: true, message, errors: {} });

function optionalId(formData: FormData) {
  const raw = formData.get("id");
  if (!raw) return { id: undefined, error: false };
  const parsed = idSchema.safeParse(raw);
  return { id: parsed.data, error: !parsed.success };
}

/* ---------- Compétences : groupes ---------- */

export async function saveSkillGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { id, error } = optionalId(formData);
  if (error) return { ok: false, message: "Groupe introuvable.", errors: {} };
  const parsed = skillGroupSchema.safeParse(readForm(formData));
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  if (id) await db.update(schema.skillGroups).set(parsed.data).where(eq(schema.skillGroups.id, id));
  else await db.insert(schema.skillGroups).values(parsed.data);

  updateTag(CACHE_TAGS.skills);
  refresh();
  return saved(id ? "Groupe enregistré." : "Groupe ajouté.");
}

export async function deleteSkillGroup(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  // Les étiquettes du groupe sont supprimées avec lui (ON DELETE CASCADE).
  await db.delete(schema.skillGroups).where(eq(schema.skillGroups.id, id));
  updateTag(CACHE_TAGS.skills);
  refresh();
}

/* ---------- Compétences : étiquettes ---------- */

export async function saveSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { id, error } = optionalId(formData);
  if (error) return { ok: false, message: "Compétence introuvable.", errors: {} };
  const parsed = skillSchema.safeParse(readForm(formData, { booleans: ["showInStack"] }));
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  if (id) await db.update(schema.skills).set(parsed.data).where(eq(schema.skills.id, id));
  else await db.insert(schema.skills).values(parsed.data);

  updateTag(CACHE_TAGS.skills);
  refresh();
  return saved(id ? "Compétence enregistrée." : "Compétence ajoutée.");
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(schema.skills).where(eq(schema.skills.id, id));
  updateTag(CACHE_TAGS.skills);
  refresh();
}

/* ---------- Parcours ---------- */

export async function saveExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { id, error } = optionalId(formData);
  if (error) return { ok: false, message: "Ligne introuvable.", errors: {} };
  const parsed = experienceSchema.safeParse(readForm(formData));
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  if (id) await db.update(schema.experiences).set(parsed.data).where(eq(schema.experiences.id, id));
  else await db.insert(schema.experiences).values(parsed.data);

  updateTag(CACHE_TAGS.experiences);
  refresh();
  return saved(id ? "Ligne enregistrée." : "Ligne ajoutée.");
}

export async function deleteExperience(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
  updateTag(CACHE_TAGS.experiences);
  refresh();
}

/* ---------- Certifications ---------- */

export async function saveCertification(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { id, error } = optionalId(formData);
  if (error) return { ok: false, message: "Certification introuvable.", errors: {} };
  const parsed = certificationSchema.safeParse(readForm(formData));
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  if (id) await db.update(schema.certifications).set(parsed.data).where(eq(schema.certifications.id, id));
  else await db.insert(schema.certifications).values(parsed.data);

  updateTag(CACHE_TAGS.certifications);
  refresh();
  return saved(id ? "Certification enregistrée." : "Certification ajoutée.");
}

export async function deleteCertification(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(schema.certifications).where(eq(schema.certifications.id, id));
  updateTag(CACHE_TAGS.certifications);
  refresh();
}

/* ---------- Profil ---------- */

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(readForm(formData, { booleans: ["available"] }));
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  const [existing] = await db.select({ id: schema.profile.id }).from(schema.profile).limit(1);
  if (existing) {
    await db.update(schema.profile).set(parsed.data).where(eq(schema.profile.id, existing.id));
  } else {
    await db.insert(schema.profile).values(parsed.data);
  }

  updateTag(CACHE_TAGS.profile);
  refresh();
  return saved("Profil enregistré.");
}

/* ---------- Messages (non publics : pas de cache à invalider) ---------- */

export async function setMessageRead(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const read = formData.get("read") === "true";
  await db.update(schema.messages).set({ read }).where(eq(schema.messages.id, id));
  refresh();
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(schema.messages).where(eq(schema.messages.id, id));
  refresh();
}
