import Image from "next/image";
import styles from "./ProjectCover.module.css";

type ProjectCoverProps = {
  title: string;
  coverUrl?: string | null;
  /** Hauteur de la maquette : home 220, list 200, detail 560, gallery 320. */
  size: "home" | "list" | "detail" | "gallery";
  /** Texte alternatif ; par défaut « Capture du projet {title} ». */
  alt?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Capture d'un projet. Sans image, une couverture générée aux couleurs
 * de la charte (titre du projet + point accent) prend sa place.
 */
export function ProjectCover({
  title,
  coverUrl,
  size,
  alt,
  priority,
  sizes = "(max-width: 760px) 100vw, 560px",
  className,
}: ProjectCoverProps) {
  return (
    <div className={[styles.cover, styles[size], className].filter(Boolean).join(" ")}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={alt ?? `Capture du projet ${title}`}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      ) : (
        <span className={styles.generated} aria-hidden="true">
          {title}
          <span className={styles.dot}>.</span>
        </span>
      )}
    </div>
  );
}
