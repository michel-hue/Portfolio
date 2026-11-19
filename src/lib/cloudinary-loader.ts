"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Loader next/image pour Cloudinary : redimensionnement, format et qualité
 * automatiques (f_auto,q_auto) servis par le CDN de Cloudinary.
 * Les autres URL sont renvoyées telles quelles.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const marker = "/image/upload/";
  if (!src.includes("res.cloudinary.com") || !src.includes(marker)) return src;
  const transform = ["f_auto", `q_${quality ?? "auto"}`, "c_limit", `w_${width}`].join(",");
  return src.replace(marker, `${marker}${transform}/`);
}
