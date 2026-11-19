"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { FileText, Upload } from "lucide-react";
import { ACCEPT, uploadToCloudinary, type UploadKind } from "./upload";
import styles from "./inputs.module.css";
import admin from "./admin.module.css";

/**
 * Un fichier (couverture, portrait, CV) envoyé sur Cloudinary.
 * L'URL obtenue est envoyée avec le formulaire dans le champ caché `name`.
 */
export function UploadField({
  name,
  label,
  kind = "image",
  defaultValue = null,
  hint,
  error,
  aspect = "16 / 9",
}: {
  name: string;
  label: string;
  kind?: UploadKind;
  defaultValue?: string | null;
  hint?: string;
  error?: string;
  aspect?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      setUrl(await uploadToCloudinary(file, kind));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Échec de l’envoi.");
    } finally {
      setBusy(false);
    }
  }

  const shownError = uploadError ?? error;

  return (
    <div className={admin.field}>
      <span className={admin.label} id={`${id}-label`}>
        {label}
      </span>

      {url ? (
        kind === "pdf" ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
            <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
            Voir le fichier actuel
          </a>
        ) : (
          <div className={styles.preview} style={{ aspectRatio: aspect }}>
            <Image src={url} alt="" fill sizes="320px" className={styles.previewImage} />
          </div>
        )
      ) : (
        <p className={admin.hint}>Aucun fichier.</p>
      )}

      <div className={admin.rowActions}>
        <button
          type="button"
          className={admin.btn}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-describedby={`${id}-label`}
        >
          <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
          {busy ? "Envoi…" : url ? "Remplacer" : "Choisir un fichier"}
        </button>
        {url && !busy && (
          <button type="button" className={`${admin.btn} ${admin.btnGhost}`} onClick={() => setUrl(null)}>
            Retirer
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        onChange={onFile}
        hidden
        aria-labelledby={`${id}-label`}
      />
      <p className={admin.hint}>
        {hint ?? (kind === "pdf" ? "PDF, 5 Mo maximum." : "JPG, PNG ou WebP, 5 Mo maximum.")}
      </p>
      {shownError && (
        <p className={admin.error} role="alert">
          {shownError}
        </p>
      )}
      <input type="hidden" name={name} value={url ?? ""} />
    </div>
  );
}
