import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSessionToken,
  verifySessionToken,
} from "./session-token";

/** Pose le cookie de session (httpOnly, Secure en production, SameSite=Lax, 7 jours). */
export async function createSession() {
  const token = await signSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * À appeler en tête de chaque page admin ET de chaque Server Action admin :
 * le proxy ne fait qu'une vérification rapide, l'autorisation réelle est ici.
 */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
