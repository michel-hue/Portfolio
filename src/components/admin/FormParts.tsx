"use client";

import { startTransition, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { EMPTY_FORM_STATE, type FormState } from "@/lib/admin-form";
import styles from "./admin.module.css";

/**
 * Formulaire relié à une Server Action SANS la remise à zéro automatique de React 19
 * (qui viderait la saisie même quand la validation échoue).
 */
export function useAdminForm(serverAction: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(serverAction, EMPTY_FORM_STATE);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }
  return { state, onSubmit, pending };
}

/** Bouton d'envoi : désactivé et libellé « … » pendant l'envoi. */
export function SubmitButton({
  children,
  pending,
  pendingLabel = "Enregistrement…",
  variant = "primary",
}: {
  children: React.ReactNode;
  pending: boolean;
  pendingLabel?: string;
  variant?: "primary" | "default";
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${styles.btn} ${variant === "primary" ? styles.btnPrimary : ""}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Message de retour d'un formulaire (succès discret ou erreur). */
export function FormNotice({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      className={`${styles.notice} ${state.ok ? styles.noticeOk : styles.noticeError}`}
      role={state.ok ? "status" : "alert"}
    >
      {state.message}
    </p>
  );
}

/**
 * Suppression en deux temps : « Supprimer » puis « Confirmer la suppression ».
 * `action` est une Server Action qui reçoit l'id dans le FormData.
 */
export function DeleteButton({
  action,
  id,
  label = "Supprimer",
  itemName,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  label?: string;
  itemName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={() => setConfirming(true)}
        aria-label={`${label} « ${itemName} »`}
      >
        {label}
      </button>
    );
  }

  return (
    <form action={action} className={styles.rowActions}>
      <input type="hidden" name="id" value={id} />
      <DangerSubmit itemName={itemName} />
      <button
        type="button"
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={() => setConfirming(false)}
      >
        Annuler
      </button>
    </form>
  );
}

function DangerSubmit({ itemName }: { itemName: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${styles.btn} ${styles.btnDanger}`}
      aria-label={`Confirmer la suppression de « ${itemName} »`}
      autoFocus
    >
      {pending ? "Suppression…" : "Confirmer la suppression"}
    </button>
  );
}
