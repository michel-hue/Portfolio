import "server-only";
import { asc, count, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "./auth";

/*
 * Lectures de l'admin : jamais mises en cache, toujours après requireAdmin().
 */

export async function getDashboardStats() {
  await requireAdmin();
  const [projects, messages] = await Promise.all([
    db
      .select({ published: schema.projects.published, total: count() })
      .from(schema.projects)
      .groupBy(schema.projects.published),
    db
      .select({ read: schema.messages.read, total: count() })
      .from(schema.messages)
      .groupBy(schema.messages.read),
  ]);
  const pick = <T extends { total: number }>(rows: T[], test: (r: T) => boolean) =>
    rows.find(test)?.total ?? 0;
  return {
    published: pick(projects, (r) => r.published),
    drafts: pick(projects, (r) => !r.published),
    unread: pick(messages, (r) => !r.read),
    totalMessages: messages.reduce((sum, r) => sum + r.total, 0),
  };
}

export async function getAllProjects() {
  await requireAdmin();
  return db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.order), asc(schema.projects.id));
}

export async function getProjectById(id: number) {
  await requireAdmin();
  const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  return row ?? null;
}

export async function getAdminSkillGroups() {
  await requireAdmin();
  const [groups, skills] = await Promise.all([
    db.select().from(schema.skillGroups).orderBy(asc(schema.skillGroups.order), asc(schema.skillGroups.id)),
    db.select().from(schema.skills).orderBy(asc(schema.skills.order), asc(schema.skills.id)),
  ]);
  return groups.map((g) => ({ ...g, skills: skills.filter((s) => s.groupId === g.id) }));
}

export async function getAdminExperiences() {
  await requireAdmin();
  return db
    .select()
    .from(schema.experiences)
    .orderBy(asc(schema.experiences.order), asc(schema.experiences.id));
}

export async function getAdminCertifications() {
  await requireAdmin();
  return db
    .select()
    .from(schema.certifications)
    .orderBy(asc(schema.certifications.order), asc(schema.certifications.id));
}

export async function getAdminProfile() {
  await requireAdmin();
  const [row] = await db.select().from(schema.profile).limit(1);
  return row ?? null;
}

/** Non lus en premier, puis du plus récent au plus ancien. */
export async function getMessages() {
  await requireAdmin();
  return db
    .select()
    .from(schema.messages)
    .orderBy(asc(schema.messages.read), desc(schema.messages.createdAt));
}
