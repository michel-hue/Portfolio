import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectList } from "@/components/admin/ProjectList";
import styles from "@/components/admin/admin.module.css";
import { getAllProjects } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Projets" };

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <PageHeader
        title="Projets"
        subtitle="Glisse une ligne (ou utilise les flèches) pour changer l’ordre et la numérotation du site. Le projet 01 est affiché en grand sur l’accueil."
        actions={
          <Link href="/admin/projets/nouveau" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
            Nouveau projet
          </Link>
        }
      />
      <ProjectList
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          published: p.published,
        }))}
      />
    </>
  );
}
