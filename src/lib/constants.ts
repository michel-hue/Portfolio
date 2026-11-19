/** Listes de valeurs partagées par le schéma, le serveur et les composants client. */

export const PROJECT_CATEGORIES = ["Web", "Mobile", "API"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const MESSAGE_TOPICS = ["Projet web", "App mobile", "Poste / mission", "Autre"] as const;
export type MessageTopic = (typeof MESSAGE_TOPICS)[number];

export const EXPERIENCE_KINDS = ["work", "education"] as const;
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number];
