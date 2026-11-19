import { NotFoundContent } from "@/components/site/NotFoundContent";

/** 404 déclenchée dans le site (ex. projet inconnu) : rendue dans le layout du site. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
