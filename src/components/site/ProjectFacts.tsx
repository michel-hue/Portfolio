import { TagList } from "./Tag";
import styles from "./ProjectFacts.module.css";

type ProjectFactsProps = {
  role: string | null;
  year: number | null;
  duration: string | null;
  technologies: string[];
};

/** Fiche du projet : Rôle, Année, Durée, Stack (colonnes vides masquées). */
export function ProjectFacts({ role, year, duration, technologies }: ProjectFactsProps) {
  const facts = [
    role && { label: "Rôle", value: role },
    year && { label: "Année", value: String(year) },
    duration && { label: "Durée", value: duration },
  ].filter(Boolean) as { label: string; value: string }[];

  if (facts.length === 0 && technologies.length === 0) return null;

  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.fact}>
          <dt className={styles.label}>{fact.label}</dt>
          <dd className={styles.value}>{fact.value}</dd>
        </div>
      ))}
      {technologies.length > 0 && (
        <div className={styles.fact}>
          <dt className={styles.label}>Stack</dt>
          <dd className={styles.value}>
            <TagList items={technologies} variant="outlined" className={styles.tags} />
          </dd>
        </div>
      )}
    </dl>
  );
}
