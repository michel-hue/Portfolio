"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  User,
  Wrench,
} from "lucide-react";
import { logout } from "@/actions/auth";
import styles from "./Sidebar.module.css";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/competences", label: "Compétences", icon: Wrench },
  { href: "/admin/parcours", label: "Parcours", icon: Briefcase },
  { href: "/admin/profil", label: "Profil", icon: User },
  { href: "/admin/messages", label: "Messages", icon: Mail },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand}>
        <span>
          archange<span className={styles.dot}>.</span>
        </span>
        <span className={styles.badge}>admin</span>
      </Link>

      <nav aria-label="Navigation admin" className={styles.nav}>
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={styles.link}
            aria-current={isActive(pathname, href) ? "page" : undefined}
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.link}>
          <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
          Voir le site
        </a>
        <form action={logout}>
          <button type="submit" className={styles.link}>
            <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
