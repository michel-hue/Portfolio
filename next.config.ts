import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // CSS (petit) inliné dans <head> : supprime la feuille bloquante au premier affichage.
    inlineCss: true,
  },
  images: {
    // Captures et portrait sont hébergés sur Cloudinary (dossier portfolio/),
    // redimensionnés par Cloudinary lui-même (f_auto,q_auto).
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
