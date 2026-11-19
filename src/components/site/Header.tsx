"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/a-propos", label: "À propos" },
] as const;

const MOBILE_LINKS = [...LINKS, { href: "/contact", label: "Contact" }] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Header flottant + menu plein écran sous 640px. */
export function Header({ shortName }: { shortName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Ferme le menu après une navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const toggleButton = toggleRef.current;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      toggleButton?.focus();
    };
  }, [open]);

  const contactActive = isActive(pathname, "/contact");

  return (
    <div className={`container ${styles.wrapper}`}>
      <header className={styles.header}>
        <Logo name={shortName} />

        <nav aria-label="Navigation principale" className={styles.nav}>
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                aria-current={active ? "page" : undefined}
              >
                {active && <span className={styles.activeDot} aria-hidden="true" />}
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Link
            href="/contact"
            className={styles.contact}
            aria-current={contactActive ? "page" : undefined}
          >
            Me contacter
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>Menu</span>
        </button>
      </header>

      {open && (
        <div
          id="menu-mobile"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.overlayTop}>
            <Logo name={shortName} />
            <button
              ref={closeRef}
              type="button"
              className={styles.menuButton}
              onClick={() => setOpen(false)}
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>Fermer</span>
            </button>
          </div>
          <nav aria-label="Navigation mobile" className={styles.overlayNav}>
            {MOBILE_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.overlayLink}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {active && (
                    <span className={styles.overlayDot} aria-hidden="true">
                      .
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className={styles.overlayBottom}>
            <span>Thème</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
