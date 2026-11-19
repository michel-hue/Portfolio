import type { Metadata } from "next";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { CtaBand } from "@/components/site/CtaBand";
import { Eyebrow } from "@/components/site/Eyebrow";
import { ProjectsBrowser } from "@/components/site/ProjectsBrowser";
import { Reveal } from "@/components/site/Reveal";
import intro from "@/components/site/PageIntro.module.css";
import { getPublishedProjects } from "@/lib/queries";
import { toCardProject } from "@/lib/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projets",
  description: "Applications web, applications mobiles et API réalisées par Archange YEBOUET.",
  alternates: { canonical: "/projets" },
};

export default async function ProjectsPage() {
  const projects = (await getPublishedProjects()).map(toCardProject);

  return (
    <>
      <section className={`container ${intro.intro}`}>
        <Reveal immediate>
          <Eyebrow index="02">Projets</Eyebrow>
        </Reveal>
        <Reveal immediate as="h1" index={1} className="display">
          Tous mes projets
          <AnimatedDot />
        </Reveal>
        <Reveal immediate as="p" index={2} className={`body-lg ${intro.lead}`}>
          Applications web, applications mobiles et API. Chaque projet a un lien direct vers
          l&apos;app en ligne.
        </Reveal>
      </section>

      <section className={`container ${styles.list}`} aria-label="Liste des projets">
        <ProjectsBrowser projects={projects} />
      </section>

      <CtaBand title="Un projet en tête ?" />
    </>
  );
}
