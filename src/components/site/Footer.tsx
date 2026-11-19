import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

type FooterProps = {
  shortName?: string;
  fullName: string;
  city: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

/** Année courante, mise en cache (recalculée au plus une fois par jour). */
async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer({ shortName, fullName, city, githubUrl, linkedinUrl }: FooterProps) {
  const year = await getCurrentYear();
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo name={shortName} size="sm" />
        <nav aria-label="Liens secondaires" className={styles.nav}>
          <Link href="/">Accueil</Link>
          <Link href="/projets">Projets</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
          {githubUrl && (
            <a href={githubUrl} {...external}>
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} {...external}>
              LinkedIn
            </a>
          )}
        </nav>
        <span>
          © {year} {fullName} · Fait à {city}
        </span>
      </div>
    </footer>
  );
}
