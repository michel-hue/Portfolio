"use client";

import styles from "./ProjectFilters.module.css";

export const ALL = "Tous";

type ProjectFiltersProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Pastilles de filtre (Tous, Web, Mobile, API) — `aria-pressed`. */
export function ProjectFilters({ options, value, onChange, className }: ProjectFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filtrer les projets"
      className={[styles.chips, className].filter(Boolean).join(" ")}
    >
      {[ALL, ...options].map((option) => (
        <button
          key={option}
          type="button"
          className={styles.chip}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** Catégories qui ont au moins un projet, dans l'ordre demandé. */
export function availableCategories(order: readonly string[], projects: { category: string }[]) {
  return order.filter((category) => projects.some((p) => p.category === category));
}
