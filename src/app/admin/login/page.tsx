import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.brand}>
          <span>
            archange<span className={styles.dot}>.</span>
          </span>
          <span className={styles.badge}>admin</span>
        </p>
        <h1 className="h2">Connexion</h1>
        <LoginForm />
      </div>
    </main>
  );
}
