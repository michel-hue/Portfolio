import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import styles from "@/components/admin/admin.module.css";
import { getDashboardStats } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        actions={
          <Link href="/admin/projets/nouveau" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
            Nouveau projet
          </Link>
        }
      />

      <div className={styles.stats}>
        <Link href="/admin/projets" className={styles.stat}>
          <span className={styles.statValue}>{stats.published}</span>
          <span className={styles.statLabel}>
            {stats.published > 1 ? "projets publiés" : "projet publié"}
          </span>
        </Link>
        <Link href="/admin/projets" className={styles.stat}>
          <span className={styles.statValue}>{stats.drafts}</span>
          <span className={styles.statLabel}>
            {stats.drafts > 0 && <span className={`${styles.status} ${styles.statusWarning}`}>Brouillon</span>}
            {stats.drafts > 1 ? "brouillons" : "brouillon"}
          </span>
        </Link>
        <Link href="/admin/messages" className={styles.stat}>
          <span className={styles.statValue}>{stats.unread}</span>
          <span className={styles.statLabel}>
            {stats.unread > 0 && <span className={`${styles.status} ${styles.statusWarning}`}>Non lu</span>}
            {stats.unread > 1 ? "messages non lus" : "message non lu"} sur {stats.totalMessages}
          </span>
        </Link>
      </div>
    </>
  );
}
