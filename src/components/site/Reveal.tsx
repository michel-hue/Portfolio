"use client";

import { useEffect, useRef, type ElementType } from "react";

type RevealProps = {
  children: React.ReactNode;
  as?: ElementType;
  /** Rang dans un groupe : décale l'apparition de 80 ms par élément. */
  index?: number;
  /**
   * Contenu visible dès le chargement (haut de page) : animation CSS seule,
   * sans attendre JavaScript (meilleur LCP). Sinon : apparition au défilement.
   */
  immediate?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

/**
 * Apparition au défilement (fondu + 16px, 700 ms), une seule fois.
 * Sans JS ou avec `prefers-reduced-motion`, le contenu est visible tout de suite.
 */
export function Reveal({
  children,
  as: Tag = "div",
  index = 0,
  immediate = false,
  className,
  id,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || immediate) return;
    // Déjà à l'écran au chargement (ou pas d'IntersectionObserver) : on révèle tout de suite,
    // l'animation CSS joue quand même grâce à la transition.
    const rect = el.getBoundingClientRect();
    if (typeof IntersectionObserver === "undefined" || rect.top < window.innerHeight) {
      requestAnimationFrame(() => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={[immediate ? "rise" : "reveal", className].filter(Boolean).join(" ")}
      style={{ ...style, "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
