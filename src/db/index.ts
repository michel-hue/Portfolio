import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Client Drizzle sur Neon (HTTP, adapté au serverless de Vercel).
 * `cache: "no-store"` : le driver passe par fetch(), que Next mettrait sinon dans son
 * cache de données (.next/cache/fetch-cache, conservé entre deux builds, y compris sur
 * Vercel) : une nouvelle build pourrait servir d’anciennes données. Le cache des pages
 * est géré par "use cache" + cacheTag (src/lib/queries.ts).
 */
export const db = drizzle(neon(env.DATABASE_URL, { fetchOptions: { cache: "no-store" } }), { schema });

export { schema };
