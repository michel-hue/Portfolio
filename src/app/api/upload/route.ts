import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { signUpload, type UploadKind } from "@/lib/cloudinary";

/**
 * POST /api/upload { kind: "image" | "pdf" }
 * Renvoie une signature d'upload Cloudinary. Réservé à l'admin connecté.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let kind: UploadKind = "image";
  try {
    const body = (await request.json()) as { kind?: unknown };
    if (body.kind === "pdf") kind = "pdf";
  } catch {
    // Corps absent ou invalide : image par défaut.
  }

  return NextResponse.json(signUpload(kind), {
    headers: { "Cache-Control": "no-store" },
  });
}
