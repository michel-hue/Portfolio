import "server-only";
import { createHash } from "node:crypto";
import { getAdminEnv } from "./env";

/** Dossier Cloudinary de tous les fichiers du portfolio. */
export const UPLOAD_FOLDER = "portfolio";

export type UploadKind = "image" | "pdf";

/**
 * Paramètres signés d'un upload direct navigateur → Cloudinary.
 * La signature (SHA-1 des paramètres triés + secret) empêche d'envoyer
 * autre chose que ce que le serveur autorise : dossier, formats.
 */
export function signUpload(kind: UploadKind) {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = getAdminEnv();
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string | number> = {
    allowed_formats: kind === "pdf" ? "pdf" : "jpg,jpeg,png,webp",
    folder: UPLOAD_FOLDER,
    timestamp,
  };

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + CLOUDINARY_API_SECRET).digest("hex");

  return {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    // Les PDF passent en « raw » : livrés tels quels (les comptes gratuits bloquent les PDF « image »).
    resourceType: kind === "pdf" ? "raw" : "image",
    signature,
    ...params,
  };
}
