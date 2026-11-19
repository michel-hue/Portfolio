import { getProfile } from "@/lib/queries";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Archange YEBOUET — Développeur web et mobile à Abidjan";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Image de partage par défaut (accueil et pages sans image propre). */
export default async function Image() {
  const profile = await getProfile();
  return renderOgImage({
    shortName: profile.shortName,
    eyebrow: `${profile.role} · ${profile.city}`,
    title: profile.heroTitle,
    footer: `${profile.fullName} · ${profile.city}, ${profile.country}`,
  });
}
