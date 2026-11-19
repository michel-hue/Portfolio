import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProfile } from "@/lib/queries";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header shortName={profile.shortName} />
      <main id="contenu">{children}</main>
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
