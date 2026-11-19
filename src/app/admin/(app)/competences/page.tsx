import type { Metadata } from "next";
import { deleteSkill, deleteSkillGroup } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/FormParts";
import { PageHeader } from "@/components/admin/PageHeader";
import { SkillForm, SkillGroupForm } from "@/components/admin/SimpleForms";
import styles from "@/components/admin/admin.module.css";
import forms from "@/components/admin/SimpleForms.module.css";
import { getAdminSkillGroups } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Compétences" };

export default async function AdminSkillsPage() {
  const groups = await getAdminSkillGroups();

  return (
    <>
      <PageHeader
        title="Compétences"
        subtitle="Les groupes forment les cartes « Ce que je fais ». Les compétences cochées « Stack » apparaissent sur l’accueil."
      />

      <div className={styles.stack}>
        {groups.length === 0 && <p className={styles.empty}>Aucun groupe pour l’instant.</p>}

        {groups.map((group) => (
          <section key={group.id} className={forms.block} aria-labelledby={`groupe-${group.id}`}>
            <div className={forms.blockHead}>
              <h2 id={`groupe-${group.id}`} className={styles.sectionTitle}>
                {group.name}
              </h2>
              <DeleteButton
                action={deleteSkillGroup}
                id={group.id}
                label="Supprimer le groupe"
                itemName={`${group.name} et ses ${group.skills.length} compétences`}
              />
            </div>

            <details className={forms.details}>
              <summary>Modifier le groupe (nom, description, ordre)</summary>
              <SkillGroupForm group={group} />
            </details>

            <ul className={forms.skills} aria-label={`Compétences ${group.name}`}>
              {group.skills.map((skill) => (
                <li key={skill.id} className={forms.skillRow}>
                  <SkillForm skill={skill} groupId={group.id} />
                  <div className={forms.skillDelete}>
                    <DeleteButton action={deleteSkill} id={skill.id} itemName={skill.name} />
                  </div>
                </li>
              ))}
              <li className={forms.skillRow}>
                <SkillForm groupId={group.id} />
              </li>
            </ul>
          </section>
        ))}

        <section className={forms.block} aria-labelledby="nouveau-groupe">
          <h2 id="nouveau-groupe" className={styles.sectionTitle}>
            Nouveau groupe
          </h2>
          <SkillGroupForm />
        </section>
      </div>
    </>
  );
}
