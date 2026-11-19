"use server";

import bcrypt from "bcryptjs";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { createSession, deleteSession } from "@/lib/auth";
import { getAdminEnv } from "@/lib/env";
import { clientIpHash } from "@/lib/ip";

const MAX_FAILURES = 5;
const LOCK_MS = 10 * 60 * 1000;

export type LoginState = { error: string | null };

/** Connexion admin : un mot de passe comparé au hash bcrypt, 5 essais puis 10 min d'attente. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Indique le mot de passe." };
  }
  if (password.length > 200) {
    return { error: "Mot de passe incorrect." };
  }

  const ipHash = await clientIpHash();
  const since = new Date(Date.now() - LOCK_MS);
  const recent = and(eq(schema.loginAttempts.ipHash, ipHash), gt(schema.loginAttempts.createdAt, since));

  const [{ failures }] = await db
    .select({ failures: count() })
    .from(schema.loginAttempts)
    .where(recent);

  if (failures >= MAX_FAILURES) {
    return { error: "Trop d’essais ratés. Réessaie dans 10 minutes." };
  }

  const ok = await bcrypt.compare(password, getAdminEnv().ADMIN_PASSWORD_HASH);

  if (!ok) {
    await db.insert(schema.loginAttempts).values({ ipHash });
    const left = MAX_FAILURES - (failures + 1);
    return {
      error:
        left > 0
          ? `Mot de passe incorrect. Encore ${left} essai${left > 1 ? "s" : ""}.`
          : "Mot de passe incorrect. Réessaie dans 10 minutes.",
    };
  }

  // Succès : on efface les échecs de cette IP et les vieux essais de tout le monde.
  await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.ipHash, ipHash));
  await db.delete(schema.loginAttempts).where(lt(schema.loginAttempts.createdAt, since));

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
