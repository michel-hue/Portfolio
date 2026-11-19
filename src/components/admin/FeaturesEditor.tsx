"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import type { ProjectFeature } from "@/db/schema";
import styles from "./inputs.module.css";
import admin from "./admin.module.css";

type Row = ProjectFeature & { key: number };

/** Liste éditable « Ce que j'ai construit » : titre + description, réordonnable. */
export function FeaturesEditor({
  name,
  defaultValue = [],
  error,
}: {
  name: string;
  defaultValue?: ProjectFeature[];
  error?: string;
}) {
  const id = useId();
  const [rows, setRows] = useState<Row[]>(() => defaultValue.map((f, key) => ({ ...f, key })));
  const [nextKey, setNextKey] = useState(defaultValue.length);

  function update(key: number, patch: Partial<ProjectFeature>) {
    setRows((current) => current.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function move(index: number, delta: number) {
    setRows((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  const value = rows
    .filter((r) => r.title.trim() !== "" || r.description.trim() !== "")
    .map(({ title, description }) => ({ title, description }));

  return (
    <div className={admin.field}>
      <span className={admin.label} id={`${id}-label`}>
        Fonctionnalités
      </span>
      <ol className={styles.featureList} aria-labelledby={`${id}-label`}>
        {rows.map((row, index) => (
          <li key={row.key} className={styles.featureRow}>
            <div className={styles.featureFields}>
              <input
                className={admin.input}
                value={row.title}
                onChange={(e) => update(row.key, { title: e.target.value })}
                placeholder="Titre (ex. Authentification)"
                aria-label={`Titre de la fonctionnalité ${index + 1}`}
              />
              <textarea
                className={admin.input}
                rows={2}
                value={row.description}
                onChange={(e) => update(row.key, { description: e.target.value })}
                placeholder="Une phrase."
                aria-label={`Description de la fonctionnalité ${index + 1}`}
              />
            </div>
            <div className={styles.featureTools}>
              <button
                type="button"
                className={`${admin.btn} ${admin.btnGhost} ${admin.btnIcon}`}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Monter la fonctionnalité ${index + 1}`}
              >
                <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${admin.btn} ${admin.btnGhost} ${admin.btnIcon}`}
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label={`Descendre la fonctionnalité ${index + 1}`}
              >
                <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${admin.btn} ${admin.btnGhost}`}
                onClick={() => setRows((current) => current.filter((r) => r.key !== row.key))}
              >
                Retirer
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div>
        <button
          type="button"
          className={admin.btn}
          onClick={() => {
            setRows((current) => [...current, { key: nextKey, title: "", description: "" }]);
            setNextKey((k) => k + 1);
          }}
        >
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
          Ajouter une fonctionnalité
        </button>
      </div>
      {error && <p className={admin.error}>{error}</p>}
      <input type="hidden" name={name} value={JSON.stringify(value)} />
    </div>
  );
}
