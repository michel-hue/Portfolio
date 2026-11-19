import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "./cache-tags";
import { projectNumber } from "./format";

/*
 * Lectures publiques, mises en cache et étiquetées.
 * L'admin invalide l'étiquette concernée après chaque modification
 * (revalidateTag), ce qui met le site à jour sans redéploiement.
 */

export async function getProfile() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.profile);

  const [row] = await db.select().from(schema.profile).limit(1);
  if (!row) {
    throw new Error("Profil introuvable en base : lance `npm run db:seed`.");
  }
  return row;
}

/** Projets publiés, triés, avec leur numéro affiché (« 01 », « 02 »…). */
export async function getPublishedProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.projects);

  const rows = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.published, true))
    .orderBy(asc(schema.projects.order), asc(schema.projects.id));

  return rows.map((project, index) => ({ ...project, number: projectNumber(index) }));
}

export type PublishedProject = Awaited<ReturnType<typeof getPublishedProjects>>[number];

/** Un projet publié et le suivant (pour « Projet suivant », en boucle). */
export async function getProjectWithNext(slug: string) {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  return { project: projects[index], next };
}

export async function getSkillGroups() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.skills);

  const [groups, skills] = await Promise.all([
    db.select().from(schema.skillGroups).orderBy(asc(schema.skillGroups.order), asc(schema.skillGroups.id)),
    db.select().from(schema.skills).orderBy(asc(schema.skills.order), asc(schema.skills.id)),
  ]);

  return groups.map((group) => ({
    ...group,
    skills: skills.filter((skill) => skill.groupId === group.id),
  }));
}

/** Compétences de la liste « Stack » (teaser de l'accueil). */
export async function getStackSkills() {
  const groups = await getSkillGroups();
  return groups.flatMap((group) => group.skills.filter((s) => s.showInStack).map((s) => s.name));
}

export async function getExperiences() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.experiences);

  return db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.order), asc(schema.experiences.id));
}
