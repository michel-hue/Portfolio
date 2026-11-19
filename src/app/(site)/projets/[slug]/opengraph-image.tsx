import { ImageResponse } from "next/og";
import { getProfile, getProjectWithNext, getPublishedProjects } from "@/lib/queries";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Projet d’Archange YEBOUET";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/**
 * Image de partage d'un projet : sa capture principale (recadrée 1200×630 par Cloudinary)
 * ou, sans capture, une carte aux couleurs de la charte avec le titre du projet.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [data, profile] = await Promise.all([getProjectWithNext(slug), getProfile()]);
  const project = data?.project;

  if (project?.coverUrl?.includes("/image/upload/")) {
    const src = project.coverUrl.replace(
      "/image/upload/",
      `/image/upload/c_fill,g_auto,w_${OG_SIZE.width},h_${OG_SIZE.height},f_jpg,q_auto/`,
    );
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={OG_SIZE.width} height={OG_SIZE.height} style={{ objectFit: "cover" }} />
      ),
      OG_SIZE,
    );
  }

  return renderOgImage({
    shortName: profile.shortName,
    eyebrow: project ? `${project.number} — ${project.category}` : "Projets",
    title: project?.title ?? "Tous mes projets",
    footer: `${profile.fullName} · ${profile.role}`,
  });
}
