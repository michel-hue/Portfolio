"use client";

import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Bascule sombre / clair. Le thème est appliqué sur <html data-theme>
 * et mémorisé dans le cookie `theme` (lu avant l'affichage par le layout).
 * Les deux icônes sont rendues ; le CSS affiche la bonne selon le thème,
 * ce qui évite tout écart entre rendu serveur et client.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    document.cookie = `theme=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      aria-label="Changer de thème (clair / sombre)"
      title="Changer de thème"
    >
      <Sun size={18} strokeWidth={1.75} aria-hidden="true" className={styles.sun} />
      <Moon size={18} strokeWidth={1.75} aria-hidden="true" className={styles.moon} />
    </button>
  );
}
