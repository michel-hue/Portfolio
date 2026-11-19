"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { Button } from "@/components/site/Button";
import styles from "./LoginForm.module.css";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className={styles.input}
        />
        {state.error && (
          <p id="login-error" className={styles.error} role="alert">
            {state.error}
          </p>
        )}
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
