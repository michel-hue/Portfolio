import type { Metadata } from "next";
import { ArrowRight, Download, Mail } from "lucide-react";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { Button } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";
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

  const cards = projects.map(toCardProject);
  const card = [
    { label: "Basé à", value: `${profile.city}, ${profile.country}` },
    { label: "Délai de réponse", value: `Sous ${profile.responseTime}` },
  ];

  return (
    <>
      {/* 01 — Hero : métier, nom, fiche + intro */}
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        {profile.available && (
          <Reveal immediate className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            Disponible{profile.availableFrom ? ` · ${profile.availableFrom}` : ""}
          </Reveal>
        )}

        <div className={styles.titles}>
          <Reveal immediate as="p" index={1} className={styles.job}>
            {profile.role}
          </Reveal>
          <Reveal immediate as="h1" index={2} id="hero-title" className={styles.name}>
            {profile.fullName}
            <AnimatedDot />
          </Reveal>
        </div>

        <div className={styles.heroBottom}>
          <Reveal immediate as="dl" index={3} className={styles.card}>
            {card.map((item) => (
              <div key={item.label}>
                <dt className={styles.cardLabel}>{item.label}</dt>
                <dd className={styles.cardValue}>{item.value}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal immediate index={4} className={styles.lead}>
            <p className="body-lg">{profile.heroIntro}</p>
            <div className={styles.actions}>
              <Button href="#projets" variant="primary" size="lg" iconEnd={ArrowRight}>
                Voir les projets
              </Button>
              {profile.resumeUrl ? (
                <Button href={profile.resumeUrl} variant="outline" size="lg" iconStart={Download} external>
                  Télécharger le CV
                </Button>
              ) : (
                <Button href="/contact" variant="outline" size="lg">
                  Me contacter
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — Projets */}
      {cards.length > 0 && <HomeProjects projects={cards} />}

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
                <span className={styles.stackLabel}>Stack</span>
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
