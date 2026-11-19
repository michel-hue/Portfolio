import { ArrowRight } from "lucide-react";
import { AnimatedDot } from "./AnimatedDot";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import styles from "./NotFoundContent.module.css";

/** Contenu de la page 404, dans le style des en-têtes de page du site. */
export function NotFoundContent() {
  return (
    <section className={`container ${styles.page}`}>
      <Eyebrow index="404">Page introuvable</Eyebrow>
      <h1 className="display">
        Cette page n’existe pas
        <AnimatedDot />
      </h1>
      <p className={`body-lg ${styles.text}`}>
        Le lien est peut-être ancien, ou le projet a été retiré. Les projets en ligne sont tous sur la
        page Projets.
      </p>
      <div className={styles.actions}>
        <Button href="/projets" variant="primary" size="lg" iconEnd={ArrowRight}>
          Voir les projets
        </Button>
        <Button href="/" variant="outline" size="lg">
          Retour à l’accueil
        </Button>
      </div>
    </section>
  );
}
