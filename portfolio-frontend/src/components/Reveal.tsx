import { createElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  /** Délai de révélation (ms) — stagger */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'article' | 'section' | 'li' | 'span';
}

/**
 * Wrapper reveal-on-scroll : fade + translateY + flou dissipé,
 * piloté par IntersectionObserver (une seule fois).
 * N'altère ni textes ni mise en page — visuel uniquement.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  style,
  as = 'div',
}: RevealProps) {
  const ref = useReveal({ delay });

  return createElement(
    as,
    { ref, className: `reveal ${className}`.trim(), style },
    children,
  );
}
