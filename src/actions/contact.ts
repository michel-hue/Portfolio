"use server";

import { and, count, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import { clientIpHash } from "@/lib/ip";
import { contactSchema, type ContactField } from "@/lib/validation";

/** Nombre maximal de messages par heure et par adresse IP. */
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export type ContactResult =
  | { status: "success"; firstName: string; email: string }
  | { status: "invalid"; fields: ContactField[] }
  | { status: "rate_limited" }
  | { status: "error" };

function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

export async function sendContactMessage(formData: FormData): Promise<ContactResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fields = new Set<ContactField>();
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") fields.add(key);
    }
    // Un sujet invalide ne peut venir que d'une requête forgée.
    return fields.size > 0 ? { status: "invalid", fields: [...fields] } : { status: "error" };
  }

  const data = parsed.data;

  // Pot de miel rempli : on fait comme si tout s'était bien passé, sans rien enregistrer.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", firstName: firstNameOf(data.name), email: data.email };
  }

  try {
    const ipHash = await clientIpHash();
    const since = new Date(Date.now() - WINDOW_MS);
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.messages)
      .where(and(eq(schema.messages.ipHash, ipHash), gt(schema.messages.createdAt, since)));

    if (total >= RATE_LIMIT) return { status: "rate_limited" };

    await db.insert(schema.messages).values({
      name: data.name,
      email: data.email,
      topic: data.topic,
      body: data.message,
      ipHash,
    });
  } catch (error) {
    console.error("[contact] échec de l'enregistrement du message", error);
    return { status: "error" };
  }

  return { status: "success", firstName: firstNameOf(data.name), email: data.email };
}
