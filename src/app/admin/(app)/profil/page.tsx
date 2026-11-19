import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getAdminProfile } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Profil" };

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();
  return (
    <>
      <PageHeader title="Profil" subtitle="Textes, liens, portrait et CV affichés sur tout le site." />
      <ProfileForm profile={profile} />
    </>
  );
}
