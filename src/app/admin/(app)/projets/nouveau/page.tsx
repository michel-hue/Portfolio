import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "Nouveau projet" };

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="Nouveau projet" back={{ href: "/admin/projets", label: "Projets" }} />
      <ProjectForm />
    </>
  );
}
