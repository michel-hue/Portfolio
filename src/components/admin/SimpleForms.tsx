"use client";

import { useEffect, useRef } from "react";
import { saveExperience, saveSkill, saveSkillGroup } from "@/actions/admin/content";
import type { Experience, Skill, SkillGroup } from "@/db/schema";
import type { FormState } from "@/lib/admin-form";
import { Checkbox, Field } from "./Field";
import { FormNotice, SubmitButton, useAdminForm } from "./FormParts";
import styles from "./admin.module.css";
import forms from "./SimpleForms.module.css";

/** Vide le formulaire d'ajout après un succès. */
function useResetOnSuccess(state: FormState, isNew: boolean) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (isNew && state.ok) ref.current?.reset();
  }, [state, isNew]);
  return ref;
}

/* ---------- Groupe de compétences ---------- */

export function SkillGroupForm({ group }: { group?: SkillGroup }) {
  const { state, onSubmit, pending } = useAdminForm(saveSkillGroup);
  const ref = useResetOnSuccess(state, !group);
  const e = state.errors;
  return (
    <form ref={ref} onSubmit={onSubmit} className={forms.form} noValidate>
      {group && <input type="hidden" name="id" value={group.id} />}
      <div className={forms.line}>
        <Field label="Nom" name="name" defaultValue={group?.name} error={e.name} className={forms.narrow} />
        <Field label="Ordre" name="order" type="number" min={0} defaultValue={group?.order ?? 0} error={e.order} className={forms.tiny} />
      </div>
      <Field as="textarea" rows={2} label="Description" name="description" defaultValue={group?.description} error={e.description} />
      <div className={styles.rowActions}>
        <SubmitButton pending={pending} variant={group ? "default" : "primary"}>{group ? "Enregistrer le groupe" : "Ajouter le groupe"}</SubmitButton>
        <FormNotice state={state} />
      </div>
    </form>
  );
}

/* ---------- Compétence (étiquette) ---------- */

export function SkillForm({ skill, groupId }: { skill?: Skill; groupId: number }) {
  const { state, onSubmit, pending } = useAdminForm(saveSkill);
  const ref = useResetOnSuccess(state, !skill);
  const e = state.errors;
  return (
    <form ref={ref} onSubmit={onSubmit} className={forms.inline} noValidate>
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <input type="hidden" name="groupId" value={groupId} />
      <Field
        label={skill ? "Compétence" : "Nouvelle compétence"}
        name="name"
        defaultValue={skill?.name}
        error={e.name}
        className={forms.narrow}
      />
      <Field label="Ordre" name="order" type="number" min={0} defaultValue={skill?.order ?? 0} error={e.order} className={forms.tiny} />
      <Checkbox name="showInStack" label="Dans « Stack »" defaultChecked={skill?.showInStack ?? false} />
      <div className={forms.submit}>
        <SubmitButton pending={pending} variant="default">{skill ? "Enregistrer" : "Ajouter"}</SubmitButton>
        <FormNotice state={state} />
      </div>
    </form>
  );
}

/* ---------- Parcours ---------- */

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const { state, onSubmit, pending } = useAdminForm(saveExperience);
  const ref = useResetOnSuccess(state, !experience);
  const e = state.errors;
  return (
    <form ref={ref} onSubmit={onSubmit} className={forms.form} noValidate>
      {experience && <input type="hidden" name="id" value={experience.id} />}
      <div className={forms.line}>
        <Field label="Période" name="period" defaultValue={experience?.period} error={e.period} placeholder="2025 — auj." className={forms.small} />
        <Field label="Titre" name="title" defaultValue={experience?.title} error={e.title} placeholder="Poste · Entreprise" className={forms.wide} />
      </div>
      <Field as="textarea" rows={2} label="Description" name="description" defaultValue={experience?.description ?? ""} error={e.description} optional />
      <div className={forms.line}>
        <Field as="select" label="Type" name="kind" defaultValue={experience?.kind ?? "work"} error={e.kind} className={forms.small}>
          <option value="work">Expérience</option>
          <option value="education">Formation</option>
        </Field>
        <Field label="Ordre" name="order" type="number" min={0} defaultValue={experience?.order ?? 0} error={e.order} className={forms.tiny} />
      </div>
      <div className={styles.rowActions}>
        <SubmitButton pending={pending} variant={experience ? "default" : "primary"}>
          {experience ? "Enregistrer" : "Ajouter la ligne"}
        </SubmitButton>
        <FormNotice state={state} />
      </div>
    </form>
  );
}
