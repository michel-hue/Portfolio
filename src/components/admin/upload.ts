/** Upload direct navigateur → Cloudinary, avec signature obtenue sur /api/upload. */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 Mo

export const ACCEPT = {
  image: "image/jpeg,image/png,image/webp",
  pdf: "application/pdf",
} as const;

export type UploadKind = keyof typeof ACCEPT;

type Signature = {
  cloudName: string;
  apiKey: string;
  resourceType: "image" | "raw";
  signature: string;
  timestamp: number;
  folder: string;
  allowed_formats: string;
};

/** Vérifie le fichier, l'envoie à Cloudinary et renvoie son URL https. */
export async function uploadToCloudinary(file: File, kind: UploadKind): Promise<string> {
  const allowed = ACCEPT[kind].split(",");
  if (!allowed.includes(file.type)) {
    throw new Error(kind === "pdf" ? "Seuls les PDF sont acceptés." : "Formats acceptés : JPG, PNG, WebP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Fichier trop lourd : 5 Mo maximum.");
  }

  const signRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind }),
  });
  if (signRes.status === 401) throw new Error("Session expirée : reconnecte-toi.");
  if (!signRes.ok) throw new Error("Impossible de préparer l’envoi.");
  const sig = (await signRes.json()) as Signature;

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);
  body.append("allowed_formats", sig.allowed_formats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`,
    { method: "POST", body },
  );
  const json = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message ? `Cloudinary : ${json.error.message}` : "Échec de l’envoi.");
  }
  return json.secure_url;
}
