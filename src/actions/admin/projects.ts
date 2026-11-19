"use server";

import { and, eq, max, ne, sql } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import {
  idSchema,
  invalid,
  projectSchema,
  readForm,
  slugify,
  zodErrors,
  type FormState,
} from "@/lib/admin-form";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";

/** Met à jour le site public et l'écran admin courant. */
function refreshSite() {
  updateTag(CACHE_TAGS.projects);
  refresh();
}

/** Création (sans id) ou modification (avec id) d'un projet. */
export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const id = idRaw ? idSchema.safeParse(idRaw).data : undefined;
  if (idRaw && !id) return { ok: false, message: "Projet introuvable.", errors: {} };

  const parsed = projectSchema.safeParse(
    readForm(formData, {
      booleans: ["published"],
      json: ["technologies", "features", "gallery"],
    }),
  );
  if (!parsed.success) return invalid(zodErrors(parsed.error));

  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  if (!data.slug) return invalid({ slug: "Indique une adresse (slug)." });

  // Adresse déjà prise par un autre projet ?
  const [taken] = await db
    .select({ id: schema.projects.id })
    .from(schema.projects)
    .where(id ? and(eq(schema.projects.slug, data.slug), ne(schema.projects.id, id)) : eq(schema.projects.slug, data.slug))
    .limit(1);
  if (taken) return invalid({ slug: "Cette adresse est déjà utilisée par un autre projet." });

  let savedId = id;
  if (id) {
    await db.update(schema.projects).set(data).where(eq(schema.projects.id, id));
  } else {
    const [{ maxOrder }] = await db.select({ maxOrder: max(schema.projects.order) }).from(schema.projects);
    const [inserted] = await db
      .insert(schema.projects)
      .values({ ...data, order: (maxOrder ?? 0) + 1 })
      .returning({ id: schema.projects.id });
    savedId = inserted.id;
  }

  refreshSite();
  if (!id) redirect(`/admin/projets/${savedId}?cree=1`);
  return { ok: true, message: "Projet enregistré.", errors: {} };
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  refreshSite();
  redirect("/admin/projets");
}

export async function togglePublished(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  await db
    .update(schema.projects)
    .set({ published: sql`not ${schema.projects.published}` })
    .where(eq(schema.projects.id, id));
  refreshSite();
}

/** Nouvel ordre après glisser-déposer : ids dans l'ordre affiché. */
export async function reorderProjects(ids: number[]) {
  await requireAdmin();
  const clean = ids.map((id) => idSchema.parse(id));
  if (clean.length === 0) return;
  const [first, ...rest] = clean.map((id, index) =>
    db.update(schema.projects).set({ order: index + 1 }).where(eq(schema.projects.id, id)),
  );
  await db.batch([first, ...rest]);
  refreshSite();
}
