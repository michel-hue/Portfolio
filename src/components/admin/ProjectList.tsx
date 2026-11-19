"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { deleteProject, reorderProjects, togglePublished } from "@/actions/admin/projects";
import { DeleteButton } from "./FormParts";
import styles from "./admin.module.css";
import list from "./ProjectList.module.css";

export type AdminProjectRow = {
  id: number;
  title: string;
  slug: string;
  category: string;
  published: boolean;
};

/**
 * Liste des projets : glisser-déposer (souris) ou flèches (clavier) pour réordonner.
 * L'ordre est enregistré tout de suite et sert aux numéros « 01 », « 02 »… du site ;
 * le projet 01 est affiché en grand sur l'accueil.
 */
export function ProjectList({ projects }: { projects: AdminProjectRow[] }) {
  const [rows, setOptimisticRows] = useOptimistic(projects);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const [, startTransition] = useTransition();

  function commit(next: AdminProjectRow[], message: string) {
    startTransition(async () => {
      setOptimisticRows(next);
      setAnnounce(message);
      await reorderProjects(next.map((r) => r.id));
    });
  }

  function moveTo(fromId: number, toIndex: number) {
    const from = rows.findIndex((r) => r.id === fromId);
    if (from === -1 || toIndex < 0 || toIndex >= rows.length || from === toIndex) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(toIndex, 0, item);
    commit(next, `${item.title} déplacé en position ${toIndex + 1}.`);
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>Aucun projet pour l’instant.</p>;
  }

  return (
    <>
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>
      <ol className={styles.rows}>
        {rows.map((project, index) => (
          <li
            key={project.id}
            className={`${styles.row} ${list.row}`}
            data-dragging={dragId === project.id || undefined}
            data-over={overId === project.id && dragId !== project.id ? true : undefined}
            draggable
            onDragStart={(e) => {
              setDragId(project.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverId(project.id);
            }}
            onDragLeave={() => setOverId((id) => (id === project.id ? null : id))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId !== null) moveTo(dragId, index);
              setDragId(null);
              setOverId(null);
            }}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
          >
            <span className={list.handle} aria-hidden="true">
              <GripVertical size={18} strokeWidth={1.75} />
            </span>
            <span className={list.number}>{String(index + 1).padStart(2, "0")}</span>

            <div className={styles.rowMain}>
              <Link href={`/admin/projets/${project.id}`} className={styles.rowTitle}>
                {project.title}
              </Link>
              <div className={styles.rowMeta}>
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>/projets/{project.slug}</span>
                {project.published ? (
                  <span className={`${styles.status} ${styles.statusOk}`}>Publié</span>
                ) : (
                  <span className={`${styles.status} ${styles.statusWarning}`}>Brouillon</span>
                )}
              </div>
            </div>

            <div className={styles.rowActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnIcon}`}
                onClick={() => moveTo(project.id, index - 1)}
                disabled={index === 0}
                aria-label={`Monter ${project.title}`}
              >
                <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnIcon}`}
                onClick={() => moveTo(project.id, index + 1)}
                disabled={index === rows.length - 1}
                aria-label={`Descendre ${project.title}`}
              >
                <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <form action={togglePublished}>
                <input type="hidden" name="id" value={project.id} />
                <button type="submit" className={styles.btn}>
                  {project.published ? "Dépublier" : "Publier"}
                </button>
              </form>
              <Link href={`/admin/projets/${project.id}`} className={styles.btn}>
                Modifier
              </Link>
              <DeleteButton action={deleteProject} id={project.id} itemName={project.title} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
