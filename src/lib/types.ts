import type { ProjectCategory } from "@/lib/constants";

/** Données d'une carte projet (sérialisables, passées aux composants client). */
export type CardProject = {
  slug: string;
  number: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  technologies: string[];
  coverUrl: string | null;
  appUrl: string | null;
};

export function toCardProject(p: CardProject): CardProject {
  return {
    slug: p.slug,
    number: p.number,
    title: p.title,
    category: p.category,
    summary: p.summary,
    technologies: p.technologies,
    coverUrl: p.coverUrl,
    appUrl: p.appUrl,
  };
}
