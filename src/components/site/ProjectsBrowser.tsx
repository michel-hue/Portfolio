"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { projectCountLabel } from "@/lib/format";
import type { CardProject } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ALL, ProjectFilters, availableCategories } from "./ProjectFilters";
import cardStyles from "./ProjectCard.module.css";
import styles from "./ProjectsBrowser.module.css";

const ORDER = ["Web", "Mobile", "API"] as const;
const PARAM = "categorie";

type ViewProps = {
  projects: CardProject[];
  filter: string;
  onChange?: (value: string) => void;
};

function BrowserView({ projects, filter, onChange }: ViewProps) {
  const categories = availableCategories(ORDER, projects);
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className={styles.toolbar}>
        <ProjectFilters options={categories} value={filter} onChange={onChange ?? (() => {})} />
        <p className={styles.count} aria-live="polite">
          {projectCountLabel(visible.length)}
        </p>
      </div>
      <ul className={cardStyles.grid}>
        {visible.map((project) => (
          <li key={project.slug} className={styles.item}>
            <ProjectCard project={project} variant="list" />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Filtre lu dans l'URL (`?categorie=Web`) et mis à jour sans rechargement. */
function BrowserWithUrl({ projects }: { projects: CardProject[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get(PARAM);
  const filter = requested && projects.some((p) => p.category === requested) ? requested : ALL;

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) params.delete(PARAM);
    else params.set(PARAM, value);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  }

  return <BrowserView projects={projects} filter={filter} onChange={onChange} />;
}

export function ProjectsBrowser({ projects }: { projects: CardProject[] }) {
  return (
    // Le HTML statique montre tous les projets ; le filtre de l'URL s'applique à l'hydratation.
    <Suspense fallback={<BrowserView projects={projects} filter={ALL} />}>
      <BrowserWithUrl projects={projects} />
    </Suspense>
  );
}
