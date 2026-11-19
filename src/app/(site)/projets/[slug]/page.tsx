import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { Button } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GithubIcon } from "@/components/site/icons";
import { ProjectCover } from "@/components/site/ProjectCover";
import { ProjectFacts } from "@/components/site/ProjectFacts";
import { FeatureList, ProjectSection } from "@/components/site/ProjectSection";
import { Reveal } from "@/components/site/Reveal";
import { Tag } from "@/components/site/Tag";
import { getProjectWithNext, getPublishedProjects } from "@/lib/queries";
import styles from "./page.module.css";

/*
 * Les projets créés après le build n'ont pas de page pré-générée : elle est rendue
 * à la première visite (puis mise en cache). Ce rendu lit l'URL (params, header) :
 * on l'autorise à bloquer côté serveur plutôt que d'échouer.
 */
export const instant = false;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectWithNext(slug);
  if (!data) return {};
  const { project } = data;
  // Image de partage : opengraph-image.tsx du même dossier (capture ou carte générée).
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { type: "article", title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const data = await getProjectWithNext(slug);
  if (!data) notFound();
  const { project, next } = data;

  // Les sections sont numérotées A, B, C… selon celles qui existent.
  const sections: { label: string; content: React.ReactNode }[] = [];
  if (project.contextTitle || project.contextBody) {
    sections.push({
      label: "Le contexte",
      content: (
        <>
          {project.contextTitle && <h3 className="h2">{project.contextTitle}</h3>}
          {project.contextBody && <p className="muted">{project.contextBody}</p>}
        </>
      ),
    });
  }
  if (project.features.length > 0) {
    sections.push({ label: "Ce que j’ai construit", content: <FeatureList items={project.features} /> });
  }
  if (project.result) {
    sections.push({ label: "Résultat", content: <p className="body-lg">{project.result}</p> });
  }

  return (
    <>
      <section className={`container ${styles.intro}`}>
        <Link href="/projets" className={styles.back}>
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          Tous les projets
        </Link>
        <Reveal immediate className={styles.meta}>
          <Eyebrow index={project.number}>{project.category}</Eyebrow>
          {project.context && <Tag>{project.context}</Tag>}
        </Reveal>
        <Reveal immediate as="h1" index={1} className={`display ${styles.title}`}>
          {project.title}
          <AnimatedDot />
        </Reveal>
        <Reveal immediate as="p" index={2} className={`body-lg ${styles.lead}`}>
          {project.summary}
          {project.intro && ` ${project.intro}`}
        </Reveal>
        {(project.appUrl || project.docsUrl || project.sourceUrl) && (
          <Reveal immediate index={3} className={styles.actions}>
            {project.appUrl && (
              <Button href={project.appUrl} variant="primary" size="lg" iconEnd={ExternalLink}>
                Ouvrir l&apos;app
              </Button>
            )}
            {project.docsUrl && (
              <Button href={project.docsUrl} variant="outline" size="md" iconStart={FileText}>
                Documentation
              </Button>
            )}
            {project.sourceUrl && (
              <Button href={project.sourceUrl} variant="outline" size="md" iconStart={GithubIcon}>
                Code source
              </Button>
            )}
          </Reveal>
        )}
      </section>

      <div className={`container ${styles.facts}`}>
        <ProjectFacts
          role={project.role}
          year={project.year}
          duration={project.duration}
          technologies={project.technologies}
        />
      </div>

      <div className={`container ${styles.cover}`}>
        <ProjectCover
          title={project.title}
          coverUrl={project.coverUrl}
          size="detail"
          priority
          sizes="(max-width: 1248px) 100vw, 1120px"
        />
      </div>

      {sections.length > 0 && (
        <div className={`container ${styles.sections}`}>
          {sections.map((section, i) => (
            <ProjectSection key={section.label} index={String.fromCharCode(65 + i)} label={section.label}>
              {section.content}
            </ProjectSection>
          ))}
        </div>
      )}

      {project.gallery.length > 0 && (
        <div className={`container ${styles.gallery}`}>
          {project.gallery.map((url, i) => (
            <ProjectCover
              key={url}
              title={project.title}
              coverUrl={url}
              size="gallery"
              alt={`Capture ${i + 2} du projet ${project.title}`}
              sizes="(max-width: 760px) 100vw, 548px"
            />
          ))}
        </div>
      )}

      <nav aria-label="Navigation entre projets" className={styles.pager}>
        <div className={`container ${styles.pagerInner}`}>
          <Link href="/projets" className={`card ${styles.pagerCard}`}>
            <span className={styles.pagerLabel}>Retour</span>
            <span className={styles.pagerTitle}>
              <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
              Tous les projets
            </span>
          </Link>
          {next && (
            <Link href={`/projets/${next.slug}`} className={`card ${styles.pagerCard} ${styles.pagerNext}`}>
              <span className={styles.pagerLabel}>Projet suivant</span>
              <span className={styles.pagerTitle}>
                {next.title}
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
