import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublishedProjects } from "@/lib/queries";

/** Plan du site : pages publiques + un lien par projet publié. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const projects = await getPublishedProjects();
  const lastProjectUpdate = projects.reduce<Date | undefined>(
    (latest, p) => (!latest || p.updatedAt > latest ? p.updatedAt : latest),
    undefined,
  );

  return [
    { url: `${base}/`, lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projets`, lastModified: lastProjectUpdate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/a-propos`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((p) => ({
      url: `${base}/projets/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
