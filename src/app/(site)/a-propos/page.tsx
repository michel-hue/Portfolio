import type { Metadata } from "next";
import { Download, MapPin } from "lucide-react";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { Button } from "@/components/site/Button";
import { CtaBand } from "@/components/site/CtaBand";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Portrait } from "@/components/site/Portrait";
import { Reveal } from "@/components/site/Reveal";
import { TagList } from "@/components/site/Tag";
import { getExperiences, getProfile, getSkillGroups } from "@/lib/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours et compétences d'Archange YEBOUET, développeur web et mobile à Abidjan.",
  alternates: { canonical: "/a-propos" },
};

export default async function AboutPage() {
  const [profile, groups, experiences] = await Promise.all([
    getProfile(),
    getSkillGroups(),
    getExperiences(),
  ]);

  return (
    <>
      <section className={`container ${styles.hero}`}>
        <Portrait url={profile.portraitUrl} fullName={profile.fullName} variant="about" priority />
        <div className={styles.heroText}>
          <Reveal immediate>
            <Eyebrow index="03">À propos</Eyebrow>
          </Reveal>
          <Reveal immediate as="h1" index={1} className="display">
            Je suis {profile.fullName}
            <AnimatedDot />
          </Reveal>
          <Reveal immediate as="p" index={2} className="body-lg">
            {profile.role} basé à {profile.city}. {profile.aboutLong}
          </Reveal>
          <Reveal immediate index={3} className={styles.details}>
            <span className={styles.detail}>
              <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
              {profile.city}, {profile.country}
            </span>
            {profile.available && (
              <span className={styles.detail}>
                <span className={styles.availableDot} aria-hidden="true" />
                Disponible{profile.availableFrom ? ` · ${profile.availableFrom}` : ""}
              </span>
            )}
          </Reveal>
          <Reveal immediate index={4} className={styles.actions}>
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} variant="primary" size="lg" iconStart={Download} external>
                Télécharger le CV
              </Button>
            )}
            <Button href="/contact" variant={profile.resumeUrl ? "outline" : "primary"} size="lg">
              Me contacter
            </Button>
          </Reveal>
        </div>
      </section>

      {groups.length > 0 && (
        <section className={styles.skills} aria-labelledby="competences">
          <div className={`container ${styles.skillsInner}`}>
            <div className={styles.heading}>
              <Eyebrow index="A">Compétences</Eyebrow>
              <h2 id="competences" className="h1">
                Ce que je fais
              </h2>
            </div>
            <div className={styles.groups}>
              {groups.map((group, i) => (
                <Reveal key={group.id} index={i} className={styles.group}>
                  <h3 className="h3">{group.name}</h3>
                  <p className="muted">{group.description}</p>
                  <TagList items={group.skills.map((s) => s.name)} label={`Compétences ${group.name}`} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className={`container ${styles.timeline}`} aria-labelledby="parcours">
          <div className={styles.timelineSide}>
            <Eyebrow index="B">Parcours</Eyebrow>
            <h2 id="parcours" className="h1">
              Parcours
            </h2>
            <p className="muted">Le détail complet est dans le CV.</p>
          </div>
          <ol className={styles.rows}>
            {experiences.map((item) => (
              <li key={item.id} className={styles.row}>
                <span className={styles.period}>{item.period}</span>
                <div className={styles.rowText}>
                  <h3 className="h3">{item.title}</h3>
                  {item.description && <p className="muted">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <CtaBand title="On travaille ensemble ?" label="Écrire un message" variant="outline" />
    </>
  );
}
