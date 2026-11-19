"use client";

import { saveProfile } from "@/actions/admin/content";
import type { Profile } from "@/db/schema";
import { Checkbox, Field } from "./Field";
import { FormNotice, SubmitButton, useAdminForm } from "./FormParts";
import { UploadField } from "./UploadField";
import styles from "./admin.module.css";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const { state, onSubmit, pending } = useAdminForm(saveProfile);
  const e = state.errors;
  const p = profile;

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Identité</legend>
        <div className={styles.grid2}>
          <Field label="Nom complet" name="fullName" defaultValue={p?.fullName} error={e.fullName} />
          <Field label="Logo texte" name="shortName" defaultValue={p?.shortName} error={e.shortName} hint="« archange » : le point est ajouté automatiquement." />
          <Field label="Rôle" name="role" defaultValue={p?.role} error={e.role} />
          <Field label="Email public" name="email" type="email" defaultValue={p?.email} error={e.email} />
          <Field label="Ville" name="city" defaultValue={p?.city} error={e.city} />
          <Field label="Pays" name="country" defaultValue={p?.country} error={e.country} />
          <Field label="Fuseau horaire" name="timezone" defaultValue={p?.timezone ?? ""} error={e.timezone} optional placeholder="GMT" />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Accueil</legend>
        <Field label="Titre principal" name="heroTitle" defaultValue={p?.heroTitle} error={e.heroTitle} hint="Sans point final : il est ajouté et animé automatiquement." />
        <Field as="textarea" rows={2} label="Introduction" name="heroIntro" defaultValue={p?.heroIntro} error={e.heroIntro} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>À propos</legend>
        <Field label="Titre du bloc de l’accueil" name="aboutTitle" defaultValue={p?.aboutTitle} error={e.aboutTitle} />
        <Field as="textarea" rows={3} label="Texte court (accueil)" name="aboutShort" defaultValue={p?.aboutShort} error={e.aboutShort} hint="Deux ou trois phrases." />
        <Field
          as="textarea"
          rows={6}
          label="Texte long (page À propos)"
          name="aboutLong"
          defaultValue={p?.aboutLong}
          error={e.aboutLong}
          hint="Affiché après « {Rôle} basé à {Ville}. »"
        />
        <div className={styles.grid2}>
          <UploadField name="portraitUrl" label="Portrait (4:5)" aspect="4 / 5" defaultValue={p?.portraitUrl} error={e.portraitUrl} />
          <UploadField name="resumeUrl" label="CV (PDF)" kind="pdf" defaultValue={p?.resumeUrl} error={e.resumeUrl} hint="Active les boutons « Télécharger le CV ». PDF, 5 Mo maximum." />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Disponibilité et contact</legend>
        <Checkbox name="available" label="Disponible" hint="Affiche le point accent et « Disponible » sur la page À propos." defaultChecked={p?.available ?? true} />
        <div className={styles.grid2}>
          <Field label="Disponible à partir de" name="availableFrom" defaultValue={p?.availableFrom ?? ""} error={e.availableFrom} optional placeholder="à partir de janvier" />
          <Field label="Délai de réponse" name="responseTime" defaultValue={p?.responseTime ?? "48 h"} error={e.responseTime} />
          <Field label="GitHub" name="githubUrl" type="url" defaultValue={p?.githubUrl ?? ""} error={e.githubUrl} optional placeholder="https://github.com/…" />
          <Field label="LinkedIn" name="linkedinUrl" type="url" defaultValue={p?.linkedinUrl ?? ""} error={e.linkedinUrl} optional placeholder="https://www.linkedin.com/in/…" />
        </div>
      </fieldset>

      <div className={styles.formFooter}>
        <SubmitButton pending={pending}>Enregistrer le profil</SubmitButton>
        <FormNotice state={state} />
      </div>
    </form>
  );
}
