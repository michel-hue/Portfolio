import type { Metadata } from "next";
import { deleteCertification } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/FormParts";
import { PageHeader } from "@/components/admin/PageHeader";
import { CertificationForm } from "@/components/admin/SimpleForms";
import styles from "@/components/admin/admin.module.css";
import forms from "@/components/admin/SimpleForms.module.css";
import { getAdminCertifications } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Certifications" };

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();

  return (
    <>
      <PageHeader
        title="Certifications"
        subtitle="Section « C — Certifications » de la page À propos, triée par ordre croissant. Elle reste masquée tant qu’il n’y a aucune certification."
      />

      <div className={styles.stack}>
        {certifications.length === 0 && <p className={styles.empty}>Aucune certification pour l’instant.</p>}

        {certifications.map((item) => (
          <section key={item.id} className={forms.block} aria-label={item.name}>
            <div className={forms.blockHead}>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{item.name}</span>
                <span className={styles.rowMeta}>
                  {[item.issuer, item.issuedAt, `ordre ${item.order}`].filter(Boolean).join(" · ")}
                </span>
              </div>
              <DeleteButton action={deleteCertification} id={item.id} itemName={item.name} />
            </div>
            <details className={forms.details}>
              <summary>Modifier</summary>
              <CertificationForm certification={item} />
            </details>
          </section>
        ))}

        <section className={forms.block} aria-labelledby="nouvelle-certification">
          <h2 id="nouvelle-certification" className={styles.sectionTitle}>
            Nouvelle certification
          </h2>
          <CertificationForm />
        </section>
      </div>
    </>
  );
}
