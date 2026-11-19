import { ExternalLink } from "lucide-react";
import type { CardProject } from "@/lib/types";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { ProjectCover } from "./ProjectCover";
import { TagList } from "./Tag";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: CardProject;
  /** home : grille de l'accueil (capture 220px) ; list : page Projets (200px). */
  variant?: "home" | "list";
  /** Niveau du titre (h3 sous un h2 de section, h2 sur la page Projets). */
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, variant = "list", headingLevel = "h2" }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <article className={`card ${styles.card} ${styles[variant]}`}>
      <ProjectCover
        title={project.title}
        coverUrl={project.coverUrl}
        size={variant}
        sizes="(max-width: 760px) 100vw, 360px"
      />
      <div className={styles.body}>
        <Eyebrow index={project.number}>{project.category}</Eyebrow>
        <Heading className={`h3 ${styles.title}`}>{project.title}</Heading>
        <p className="muted">{project.summary}</p>
        <TagList items={project.technologies} label="Technologies" />
      </div>
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
    </article>
  );
}
