"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { ACCEPT, uploadToCloudinary } from "./upload";
import styles from "./inputs.module.css";
import admin from "./admin.module.css";

/** Captures secondaires du projet (plusieurs images, réordonnables). */
export function GalleryEditor({
  name,
  defaultValue = [],
  error,
}: {
  name: string;
  defaultValue?: string[];
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setUploadError(null);
    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file, "image");
        setUrls((current) => [...current, url]);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Échec de l’envoi.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, delta: number) {
    setUrls((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  return (
    <div className={admin.field}>
      <span className={admin.label}>Captures secondaires</span>
      {urls.length > 0 ? (
        <ul className={styles.gallery}>
          {urls.map((url, index) => (
            <li key={url} className={styles.galleryItem}>
              <div className={styles.preview} style={{ aspectRatio: "16 / 10" }}>
                <Image src={url} alt={`Capture ${index + 1}`} fill sizes="200px" className={styles.previewImage} />
              </div>
              <div className={admin.rowActions}>
                <button
                  type="button"
                  className={`${admin.btn} ${admin.btnGhost} ${admin.btnIcon}`}
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Déplacer la capture ${index + 1} vers la gauche`}
                >
                  <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${admin.btn} ${admin.btnGhost} ${admin.btnIcon}`}
                  onClick={() => move(index, 1)}
                  disabled={index === urls.length - 1}
                  aria-label={`Déplacer la capture ${index + 1} vers la droite`}
                >
                  <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${admin.btn} ${admin.btnGhost}`}
                  onClick={() => setUrls((current) => current.filter((u) => u !== url))}
                >
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={admin.hint}>Aucune capture secondaire.</p>
      )}
      <div>
        <button type="button" className={admin.btn} onClick={() => inputRef.current?.click()} disabled={busy}>
          <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
          {busy ? "Envoi…" : "Ajouter des captures"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.image}
        multiple
        onChange={onFiles}
        hidden
        aria-label="Ajouter des captures"
      />
      <p className={admin.hint}>JPG, PNG ou WebP, 5 Mo maximum chacune. Deux captures dans la maquette.</p>
      {(uploadError ?? error) && (
        <p className={admin.error} role="alert">
          {uploadError ?? error}
        </p>
      )}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
    </div>
  );
}
