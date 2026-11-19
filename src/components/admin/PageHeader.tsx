import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./admin.module.css";

export function PageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        {back && (
          <Link href={back.href} className={styles.back}>
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.rowActions}>{actions}</div>}
    </header>
  );
}
