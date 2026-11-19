"use client";

import { saveProject } from "@/actions/admin/projects";
import type { Project } from "@/db/schema";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { FeaturesEditor } from "./FeaturesEditor";
import { Checkbox, Field } from "./Field";
import { FormNotice, SubmitButton, useAdminForm } from "./FormParts";
import { GalleryEditor } from "./GalleryEditor";
import { TagInput } from "./TagInput";
import { UploadField } from "./UploadField";
import styles from "./admin.module.css";

const CONTEXTS = ["Chez Syabe Technologies", "Projet personnel", "Projet d'école"];

/** Formulaire complet d'un projet (création si `project` est absent). */
export function ProjectForm({ project }: { project?: Project }) {
  const { state, onSubmit, pending } = useAdminForm(saveProject);
  const e = state.errors;

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {project && <input type="hidden" name="id" value={project.id} />}

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>L’essentiel</legend>
        <div className={styles.grid2}>
          <Field label="Titre" name="title" defaultValue={project?.title} error={e.title} required />
          <Field
            label="Adresse (slug)"
            name="slug"
            defaultValue={project?.slug}
            error={e.slug}
            optional
            hint="Laisse vide pour la créer depuis le titre. Ex. : welly → /projets/welly"
          />
          <Field as="select" label="Catégorie" name="category" defaultValue={project?.category ?? "Web"} error={e.category}>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Field>
          <Field
            label="Cadre"
            name="context"
            defaultValue={project?.context ?? ""}
            error={e.context}
            optional
            list="project-contexts"
            hint="Affiché en étiquette sur la page du projet."
          />
          <datalist id="project-contexts">
            {CONTEXTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <Field
          as="textarea"
          rows={2}
          label="Résumé"
          name="summary"
          defaultValue={project?.summary}
          error={e.summary}
          hint="Une phrase concrète : cartes et chapeau de la page projet."
        />
        <Field
          as="textarea"
          rows={2}
          label="Phrase complémentaire"
          name="intro"
          defaultValue={project?.intro ?? ""}
          error={e.intro}
          optional
          hint="Qui l’utilise et pourquoi. Ajoutée après le résumé sur la page projet."
        />
        <TagInput name="technologies" label="Technologies" defaultValue={project?.technologies} error={e.technologies} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Visuels</legend>
        <UploadField
          name="coverUrl"
          label="Capture principale (16:9)"
          defaultValue={project?.coverUrl}
          error={e.coverUrl}
          hint="Sans capture, une couverture aux couleurs de la charte est générée. JPG, PNG ou WebP, 5 Mo maximum."
        />
        <GalleryEditor name="gallery" defaultValue={project?.gallery} error={e.gallery} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Fiche</legend>
        <div className={styles.grid2}>
          <Field label="Rôle" name="role" defaultValue={project?.role ?? ""} error={e.role} optional />
          <Field
            label="Année"
            name="year"
            inputMode="numeric"
            defaultValue={project?.year ?? ""}
            error={e.year}
            optional
          />
          <Field
            label="Durée"
            name="duration"
            defaultValue={project?.duration ?? ""}
            error={e.duration}
            optional
            hint="Ex. : 6 semaines"
          />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Contenu de la page</legend>
        <Field
          label="A — Le contexte : titre"
          name="contextTitle"
          defaultValue={project?.contextTitle ?? ""}
          error={e.contextTitle}
          optional
          hint="Le problème de départ, en une phrase."
        />
        <Field
          as="textarea"
          label="A — Le contexte : texte"
          name="contextBody"
          defaultValue={project?.contextBody ?? ""}
          error={e.contextBody}
          optional
          hint="Deux ou trois phrases : pour qui, quelle situation, ce qui ne fonctionnait pas avant."
        />
        <FeaturesEditor name="features" defaultValue={project?.features} error={e.features} />
        <Field
          as="textarea"
          label="C — Résultat"
          name="result"
          defaultValue={project?.result ?? ""}
          error={e.result}
          optional
        />
        <p className={styles.hint}>Les sections vides ne s’affichent pas sur le site.</p>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Liens</legend>
        <div className={styles.grid2}>
          <Field label="Ouvrir l’app" name="appUrl" type="url" defaultValue={project?.appUrl ?? ""} error={e.appUrl} optional placeholder="https://…" />
          <Field label="Documentation" name="docsUrl" type="url" defaultValue={project?.docsUrl ?? ""} error={e.docsUrl} optional placeholder="https://…" />
          <Field label="Code source" name="sourceUrl" type="url" defaultValue={project?.sourceUrl ?? ""} error={e.sourceUrl} optional placeholder="https://github.com/…" />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Publication</legend>
        <Checkbox
          name="published"
          label="Publié"
          hint="Visible sur le site. Décoché : brouillon."
          defaultChecked={project?.published ?? false}
        />
      </fieldset>

      <div className={styles.formFooter}>
        <SubmitButton pending={pending}>{project ? "Enregistrer" : "Créer le projet"}</SubmitButton>
        <FormNotice state={state} />
      </div>
    </form>
  );
}
