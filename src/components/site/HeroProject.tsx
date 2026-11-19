import { ExternalLink } from "lucide-react";
import type { CardProject } from "@/lib/types";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { ProjectCover } from "./ProjectCover";
import { TagList } from "./Tag";
import styles from "./HeroProject.module.css";

/** Grande carte du premier projet de la liste (hero de l'accueil). */
export function HeroProject({ project }: { project: CardProject }) {
  return (
    <article className={`card ${styles.card}`} aria-labelledby="projet-principal">
      <ProjectCover
        title={project.title}
        coverUrl={project.coverUrl}
        size="hero"
        priority
        sizes="(max-width: 960px) 100vw, 540px"
      />
      <div className={styles.body}>
        <Eyebrow index={project.number}>{project.category}</Eyebrow>
        <h2 id="projet-principal" className={`h2 ${styles.title}`}>
          {project.title}
        </h2>
        <p className="muted">{project.summary}</p>
        <TagList items={project.technologies} label="Technologies" className={styles.tags} />
        <div className={styles.actions}>
          {project.appUrl && (
            <Button href={project.appUrl} variant="outline-accent" size="sm" iconEnd={ExternalLink}>
              Ouvrir l&apos;app
            </Button>
          )}
          <Button href={`/projets/${project.slug}`} variant="outline" size="sm">
            Voir le projet<span className="visually-hidden"> {project.title}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
