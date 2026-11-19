import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { env } from "@/lib/env";

const description =
  "Archange YEBOUET, développeur web et mobile à Abidjan. Des applications simples à utiliser et simples à maintenir.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Archange YEBOUET — Développeur web et mobile",
    template: "%s · Archange YEBOUET",
  },
  description,
  applicationName: "Archange YEBOUET",
  authors: [{ name: "Archange YEBOUET" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Archange YEBOUET",
    title: "Archange YEBOUET — Développeur web et mobile",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

/*
 * Thème : le HTML statique est rendu en sombre (défaut des maquettes).
 * Ce script s'exécute avant le premier affichage : il applique le cookie
 * `theme` s'il existe (pas de flash) et pose la classe `js` qui active
 * les animations d'apparition. Les pages restent statiques.
 */
const themeScript = `(function(){try{var d=document.documentElement;var m=document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);if(m)d.setAttribute("data-theme",m[1]);d.classList.add("js")}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
