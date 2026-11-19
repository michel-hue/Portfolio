"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { CardProject } from "@/lib/types";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { ProjectCard } from "./ProjectCard";
import { ALL, ProjectFilters, availableCategories } from "./ProjectFilters";
import cardStyles from "./ProjectCard.module.css";
import styles from "./HomeProjects.module.css";

const MAX = 4;
const ORDER = ["Web", "API", "Mobile"] as const;

/** Accueil, « 02 — Projets / Autres projets » : filtre sans rechargement, 4 cartes max. */
export function HomeProjects({ projects }: { projects: CardProject[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const categories = availableCategories(ORDER, projects);
  const visible = (filter === ALL ? projects : projects.filter((p) => p.category === filter)).slice(
    0,
    MAX,
  );

  return (
    <section id="projets" aria-labelledby="autres-projets" className={`container ${styles.section}`}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <Eyebrow index="02">Projets</Eyebrow>
          <h2 id="autres-projets" className="h1">
            Autres projets
          </h2>
        </div>
        {categories.length > 1 && (
          <ProjectFilters options={categories} value={filter} onChange={setFilter} />
        )}
      </div>

      <ul className={cardStyles.grid}>
        {visible.map((project) => (
          <li key={project.slug} className={styles.item}>
            <ProjectCard project={project} variant="home" headingLevel="h3" />
          </li>
        ))}
      </ul>

      <div className={styles.more}>
        <Button href="/projets" variant="outline" iconEnd={ArrowRight}>
          Voir tous les projets
        </Button>
      </div>
    </section>
  );
}
