import { SignJWT, jwtVerify } from "jose";

/*
 * Jeton de session admin : JWT HS256 signé avec SESSION_SECRET.
 * Ce module n'importe rien de « server-only » : il est aussi utilisé par proxy.ts.
 */

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours, en secondes

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET manquante ou trop courte (32 caractères minimum).");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key());
}

/** Vrai si le jeton est signé par nous, non expiré et porte le rôle admin. */
export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload.sub === "admin" && payload.role === "admin";
  } catch {
    return false;
  }
}
