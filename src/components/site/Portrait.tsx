import Image from "next/image";
import styles from "./Portrait.module.css";

type PortraitProps = {
  url: string | null;
  fullName: string;
  /** about : page À propos (420px max, fond surface) ; home : teaser (400px, fond surface-raised). */
  variant: "home" | "about";
  priority?: boolean;
};

/** Portrait 4:5. Sans photo : monogramme « a. » aux couleurs de la charte. */
export function Portrait({ url, fullName, variant, priority }: PortraitProps) {
  return (
    <div className={`${styles.portrait} ${styles[variant]}`}>
      {url ? (
        <Image
          src={url}
          alt={`Portrait de ${fullName}`}
          fill
          sizes="(max-width: 760px) 100vw, 420px"
          priority={priority}
          className={styles.image}
        />
      ) : (
        <span className={styles.monogram} aria-hidden="true">
          {fullName.charAt(0).toLowerCase()}
          <span className={styles.dot}>.</span>
        </span>
      )}
    </div>
  );
}
