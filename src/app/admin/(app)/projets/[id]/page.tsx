import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { deleteProject } from "@/actions/admin/projects";
import { DeleteButton } from "@/components/admin/FormParts";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import styles from "@/components/admin/admin.module.css";
import { getProjectById } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<"/admin/projets/[id]">) {
  const { id } = await params;
  const { cree } = await searchParams;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) notFound();
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        back={{ href: "/admin/projets", label: "Projets" }}
        subtitle={cree ? "Projet créé. Tu peux compléter les autres champs." : undefined}
        actions={
          <>
            {project.published && (
              <Link href={`/projets/${project.slug}`} target="_blank" className={styles.btn}>
                <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
                Voir sur le site
              </Link>
            )}
            <DeleteButton action={deleteProject} id={project.id} itemName={project.title} />
          </>
        }
      />
      <ProjectForm project={project} />
    </>
  );
}
