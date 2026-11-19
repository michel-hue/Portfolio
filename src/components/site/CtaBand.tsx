import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  title: string;
  label?: string;
  href?: string;
  /** primary (Projets) ou outline (À propos). */
  variant?: "primary" | "outline";
};

/** Bande d'appel en bas des pages Projets et À propos. */
export function CtaBand({ title, label = "Me contacter", href = "/contact", variant = "primary" }: CtaBandProps) {
  return (
    <section className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <h2 className="h1">{title}</h2>
        <Button href={href} variant={variant} size="lg" iconEnd={ArrowRight}>
          {label}
        </Button>
      </div>
    </section>
  );
}
