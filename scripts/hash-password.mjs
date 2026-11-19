#!/usr/bin/env node
/*
 * npm run hash-password
 *
 * Demande le mot de passe admin (saisie masquée, deux fois), calcule son hash
 * bcrypt, l'encode en base64 et l'écrit dans .env.local (ADMIN_PASSWORD_HASH).
 * La même valeur est à copier dans les variables d'environnement de Vercel.
 *
 * Pourquoi base64 : un hash bcrypt contient des « $ », que Next.js interprète
 * comme des variables dans les fichiers .env (le hash serait abîmé).
 *
 * Sans terminal interactif, le mot de passe est lu sur l'entrée standard :
 *   echo "mon mot de passe" | npm run hash-password
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";

const MIN_LENGTH = 12;
const ENV_FILE = resolve(process.cwd(), ".env.local");

function promptHidden(question) {
  return new Promise((resolvePrompt, reject) => {
    stdout.write(question);
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (char) => {
      if (char === "\u0003") {
        // Ctrl+C
        stdin.setRawMode(false);
        stdout.write("\n");
        reject(new Error("Annulé."));
      } else if (char === "\r" || char === "\n" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolvePrompt(value);
      } else if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function readStdin() {
  let data = "";
  for await (const chunk of stdin) data += chunk;
  return data.replace(/\r?\n$/, "");
}

async function getPassword() {
  if (!stdin.isTTY) return readStdin();
  const first = await promptHidden("Nouveau mot de passe admin : ");
  const second = await promptHidden("Confirme le mot de passe : ");
  if (first !== second) throw new Error("Les deux saisies sont différentes.");
  return first;
}

try {
  const password = await getPassword();
  if (password.length < MIN_LENGTH) {
    throw new Error(`Le mot de passe doit faire au moins ${MIN_LENGTH} caractères.`);
  }

  const hash = await bcrypt.hash(password, 12);
  const encoded = Buffer.from(hash, "utf8").toString("base64");
  const line = `ADMIN_PASSWORD_HASH=${encoded}`;

  let content = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  if (/^ADMIN_PASSWORD_HASH=.*$/m.test(content)) {
    content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, line);
  } else {
    if (content && !content.endsWith("\n")) content += "\n";
    content += `${line}\n`;
  }
  writeFileSync(ENV_FILE, content);

  console.log("\n✓ ADMIN_PASSWORD_HASH écrit dans .env.local.");
  console.log("  Pour Vercel, copie cette valeur dans la variable ADMIN_PASSWORD_HASH :\n");
  console.log(`  ${encoded}\n`);
  console.log("  Redémarre le serveur (npm run dev) pour la prendre en compte.");
} catch (error) {
  console.error(`✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
