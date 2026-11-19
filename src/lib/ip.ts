import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { env } from "./env";

/**
 * Empreinte de l'IP du visiteur : HMAC-SHA256 avec un secret serveur.
 * L'IP n'est jamais stockée en clair. Sur Vercel, x-forwarded-for est posé par la plateforme.
 */
export async function clientIpHash() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "inconnue";
  return createHmac("sha256", env.IP_HASH_SECRET).update(ip).digest("hex");
}
