/**
 * Au démarrage du serveur : vérifie toutes les variables d'environnement.
 * S'il en manque une, le serveur s'arrête avec un message clair au lieu
 * d'échouer plus tard, à la première requête.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { getAdminEnv } = await import("./lib/env-schema");
  getAdminEnv();
}
