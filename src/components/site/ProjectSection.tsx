import { Eyebrow } from "./Eyebrow";
import styles from "./ProjectSection.module.css";

type ProjectSectionProps = {
  index: string;
  label: string;
  children: React.ReactNode;
};

/** Sous-section de la page projet : sur-titre à gauche, contenu à droite. */
export function ProjectSection({ index, label, children }: ProjectSectionProps) {
  return (
    <section className={styles.section} aria-label={label}>
      <div className={styles.side}>
        <Eyebrow index={index} as="h2">
          {label}
        </Eyebrow>
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

/** Liste « Ce que j'ai construit » avec flèches →. */
export function FeatureList({ items }: { items: { title: string; description: string }[] }) {
  return (
    <ul className={styles.features}>
      {items.map((item) => (
        <li key={item.title} className={styles.feature}>
          <span aria-hidden="true" className={styles.arrow}>
            →
          </span>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>{item.title}</span>
            {item.description && <span className={styles.featureDesc}>{item.description}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
