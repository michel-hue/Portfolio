import type { Metadata } from "next";
import { ArrowRight, Download, Mail } from "lucide-react";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { Button } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
import { HeroProject } from "@/components/site/HeroProject";
import { HomeProjects } from "@/components/site/HomeProjects";
import { Portrait } from "@/components/site/Portrait";
import { Reveal } from "@/components/site/Reveal";
import { TagList } from "@/components/site/Tag";
import { getProfile, getPublishedProjects, getStackSkills } from "@/lib/queries";
import { toCardProject } from "@/lib/types";
import styles from "./page.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [profile, projects, stack] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
    getStackSkills(),
  ]);

  // Le projet 01 (ordre défini dans l'admin) est affiché en grand ; les suivants en grille.
  const [lead, ...rest] = projects;
  const others = rest.map(toCardProject);

  return (
    <>
      {/* 01 — Hero */}
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <Reveal immediate className={styles.identity}>
            <div className={styles.tile} aria-hidden="true">
              a.
            </div>
            <div className={styles.identityText}>
              <span className={styles.name}>{profile.fullName}</span>
              <span className={styles.role}>
                {profile.role} · {profile.city}
              </span>
            </div>
          </Reveal>
          <Reveal immediate as="h1" index={1} className="display">
            {profile.heroTitle}
            <AnimatedDot />
          </Reveal>
          <Reveal immediate as="p" index={2} className={`body-lg ${styles.intro}`}>
            {profile.heroIntro}
          </Reveal>
          <Reveal immediate index={3} className={styles.actions}>
            <Button href="#projets" variant="primary" size="lg" iconEnd={ArrowRight}>
              Voir les projets
            </Button>
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="text" iconStart={Download} external>
                Télécharger le CV
              </Button>
            )}
          </Reveal>
        </div>

        {lead && (
          <Reveal immediate index={2} className={styles.heroCard}>
            <HeroProject project={toCardProject(lead)} />
          </Reveal>
        )}
      </section>

      {/* 02 — Projets */}
      {others.length > 0 && <HomeProjects projects={others} />}

      {/* 03 — À propos */}
      <section className={styles.about} aria-labelledby="a-propos">
        <div className={`container ${styles.aboutInner}`}>
          <Portrait url={profile.portraitUrl} fullName={profile.fullName} variant="home" />
          <Reveal className={styles.aboutText}>
            <Eyebrow index="03">À propos</Eyebrow>
            <h2 id="a-propos" className="h1">
              {profile.aboutTitle}
            </h2>
            <p className="body-lg">{profile.aboutShort}</p>
            <Button href="/a-propos" variant="link" iconEnd={ArrowRight} className={styles.more}>
              En savoir plus sur moi
            </Button>
            {stack.length > 0 && (
              <div className={styles.stack}>
                <span className={styles.stackLabel}>
                  Stack
                </span>
                <TagList items={stack} variant="outlined" label="Stack" />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* 04 — Contact */}
      <section className={`container ${styles.contact}`} aria-labelledby="contact">
        <Eyebrow index="04">Contact</Eyebrow>
        <h2 id="contact" className={`display ${styles.contactTitle}`}>
          Un projet en tête ?
        </h2>
        <p className={`body-lg ${styles.contactText}`}>
          Écris-moi : je réponds sous {profile.responseTime}, avec des questions précises.
        </p>
        <div className={styles.contactActions}>
          <Button href="/contact" variant="primary" size="lg" iconStart={Mail}>
            Écrire un message
          </Button>
          {profile.githubUrl && (
            <Button href={profile.githubUrl} variant="outline" size="lg">
              GitHub
            </Button>
          )}
          {profile.linkedinUrl && (
            <Button href={profile.linkedinUrl} variant="outline" size="lg">
              LinkedIn
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
