import type { Metadata } from "next";
import { AnimatedDot } from "@/components/site/AnimatedDot";
import { ContactForm } from "@/components/site/ContactForm";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Reveal } from "@/components/site/Reveal";
import { getProfile } from "@/lib/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une app web, une app mobile, une mission ou un poste ? Écris à Archange YEBOUET.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.side}>
        <Reveal immediate>
          <Eyebrow index="04">Contact</Eyebrow>
        </Reveal>
        <Reveal immediate as="h1" index={1} className="display">
          Parlons de ton projet
          <AnimatedDot />
        </Reveal>
        <Reveal immediate as="p" index={2} className="body-lg">
          Une app web, une app mobile, une mission ou un poste ? Écris-moi, je réponds sous{" "}
          {profile.responseTime}.
        </Reveal>

        <dl className={styles.infos}>
          <div className={styles.info}>
            <dt className={styles.infoLabel}>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
          {(profile.githubUrl || profile.linkedinUrl) && (
            <div className={styles.info}>
              <dt className={styles.infoLabel}>Réseaux</dt>
              <dd className={styles.links}>
                {profile.githubUrl && (
                  <a href={profile.githubUrl} {...external}>
                    GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} {...external}>
                    LinkedIn
                  </a>
                )}
              </dd>
            </div>
          )}
          <div className={styles.info}>
            <dt className={styles.infoLabel}>Basé à</dt>
            <dd className={styles.infoText}>
              {profile.city}, {profile.country}
              {profile.timezone ? ` · ${profile.timezone}` : ""}
            </dd>
          </div>
        </dl>
      </div>

      <div className={styles.card}>
        <ContactForm responseTime={profile.responseTime} email={profile.email} />
      </div>
    </section>
  );
}
