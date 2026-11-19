import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Charge .env.local comme Next.js.
loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL manquante : ajoute-la dans .env.local (voir .env.example).");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
