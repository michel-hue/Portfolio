import type { Metadata } from "next";
import { deleteExperience } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/FormParts";
import { PageHeader } from "@/components/admin/PageHeader";
import { ExperienceForm } from "@/components/admin/SimpleForms";
import styles from "@/components/admin/admin.module.css";
import forms from "@/components/admin/SimpleForms.module.css";
import { getAdminExperiences } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Parcours" };

export default async function AdminExperiencesPage() {
  const experiences = await getAdminExperiences();

  return (
    <>
      <PageHeader
        title="Parcours"
        subtitle="Lignes de la frise « B — Parcours » de la page À propos, triées par ordre croissant."
      />

      <div className={styles.stack}>
        {experiences.length === 0 && <p className={styles.empty}>Aucune ligne pour l’instant.</p>}

        {experiences.map((item) => (
          <section key={item.id} className={forms.block} aria-label={item.title}>
            <div className={forms.blockHead}>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowMeta}>
                  {item.period} · {item.kind === "education" ? "Formation" : "Expérience"} · ordre {item.order}
                </span>
              </div>
              <DeleteButton action={deleteExperience} id={item.id} itemName={item.title} />
            </div>
            <details className={forms.details}>
              <summary>Modifier</summary>
              <ExperienceForm experience={item} />
            </details>
          </section>
        ))}

        <section className={forms.block} aria-labelledby="nouvelle-ligne">
          <h2 id="nouvelle-ligne" className={styles.sectionTitle}>
            Nouvelle ligne
          </h2>
          <ExperienceForm />
        </section>
      </div>
    </>
  );
}
