import { Suspense } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import styles from "./layout.module.css";

/** L'admin n'a pas besoin de navigation instantanée : rendu bloquant côté serveur. */
export const instant = false;

/** Vérifie la session (lecture du cookie) : doit être sous un <Suspense> avec Cache Components. */
async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Suspense fallback={<p className={styles.loading}>Chargement…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </div>
  );
}
