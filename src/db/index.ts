import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

/** Client Drizzle sur Neon (HTTP, adapté au serverless de Vercel). */
export const db = drizzle(neon(env.DATABASE_URL), { schema });

export { schema };
