"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import styles from "./inputs.module.css";
import admin from "./admin.module.css";

/**
 * Saisie d'étiquettes (technologies) : Entrée ou virgule pour ajouter,
 * Retour arrière pour retirer la dernière. Valeur envoyée en JSON dans `name`.
 */
export function TagInput({
  name,
  label,
  defaultValue = [],
  error,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  error?: string;
  hint?: string;
}) {
  const id = useId();
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const value = raw.trim().replace(/,$/, "").trim();
    if (!value) return;
    setTags((current) =>
      current.some((t) => t.toLowerCase() === value.toLowerCase()) ? current : [...current, value],
    );
    setDraft("");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  }

  return (
    <div className={admin.field}>
      <label htmlFor={id} className={admin.label}>
        {label}
      </label>
      <div className={styles.tagBox} data-invalid={error ? "true" : undefined}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => setTags((current) => current.filter((t) => t !== tag))}
              aria-label={`Retirer ${tag}`}
            >
              <X size={12} strokeWidth={2} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={tags.length === 0 ? "React, NestJS…" : ""}
          className={styles.tagField}
          aria-describedby={`${id}-hint`}
        />
      </div>
      <p id={`${id}-hint`} className={admin.hint}>
        {hint ?? "Entrée ou virgule pour ajouter."}
      </p>
      {error && <p className={admin.error}>{error}</p>}
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
    </div>
  );
}
