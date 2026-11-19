import Link from "next/link";
import styles from "./Logo.module.css";

type LogoProps = {
  /** Texte du logo (profil.shortName). */
  name?: string;
  size?: "md" | "sm";
  className?: string;
};

/** Logo texte : « archange » + point accent. Jamais une image. */
export function Logo({ name = "archange", size = "md", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={[styles.logo, styles[size], className].filter(Boolean).join(" ")}
      aria-label={`${name}, accueil`}
    >
      {name}
      <span className={styles.dot} aria-hidden="true">
        .
      </span>
    </Link>
  );
}
