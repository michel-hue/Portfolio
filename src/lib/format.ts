/** Numéro affiché d'un projet : 0 → « 01 ». */
export function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** « 1 projet », « 4 projets ». */
export function projectCountLabel(count: number) {
  return `${count} ${count > 1 ? "projets" : "projet"}`;
}
