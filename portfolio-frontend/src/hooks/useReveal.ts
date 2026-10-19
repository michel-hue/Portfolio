import { useEffect, useRef } from 'react';

interface UseRevealOptions {
  /** Délai avant révélation (ms), pour le stagger */
  delay?: number;
  /** Marge de déclenchement */
  rootMargin?: string;
  /** Seuil de visibilité */
  threshold?: number;
}

/**
 * Reveal on scroll : ajoute `.reveal-visible` quand l'élément entre
 * dans le viewport (une seule fois, via IntersectionObserver).
 *
 * Usage : `const ref = useReveal<HTMLDivElement>({ delay: 100 });`
 * puis `<div ref={ref} className="reveal">…</div>`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const { delay = 0, rootMargin = '0px 0px -10% 0px', threshold = 0.12 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay > 0) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    }

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, rootMargin, threshold]);

  return ref;
}

export default useReveal;
