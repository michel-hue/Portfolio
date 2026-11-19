import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { NotFoundContent } from "@/components/site/NotFoundContent";
import { getProfile } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

/** 404 des adresses inconnues : hors du layout du site, on remet header et footer. */
export default async function NotFound() {
  const profile = await getProfile();
  return (
    <>
      <Header shortName={profile.shortName} />
      <main id="contenu">
        <NotFoundContent />
      </main>
      <Footer
        shortName={profile.shortName}
        fullName={profile.fullName}
        city={profile.city}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
      />
    </>
  );
}
