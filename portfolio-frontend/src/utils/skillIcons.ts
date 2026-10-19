/* Icônes de compétences uniformes (style Devicon via CDN jsDelivr). */

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const SLUG_MAP: Record<string, string> = {
  react: 'react/react-original',
  typescript: 'typescript/typescript-original',
  angular: 'angular/angular-original',
  nestjs: 'nestjs/nestjs-original',
  postgresql: 'postgresql/postgresql-original',
  postgres: 'postgresql/postgresql-original',
  flutter: 'flutter/flutter-original',
  docker: 'docker/docker-original',
  git: 'git/git-original',
  javascript: 'javascript/javascript-original',
  js: 'javascript/javascript-original',
  python: 'python/python-original',
  java: 'java/java-original',
  php: 'php/php-original',
  vue: 'vue/vue-original',
  vuejs: 'vue/vue-original',
  node: 'nodejs/nodejs-original',
  nodejs: 'nodejs/nodejs-original',
  mongodb: 'mongodb/mongodb-original',
  mongo: 'mongodb/mongodb-original',
  mysql: 'mysql/mysql-original',
  firebase: 'firebase/firebase-plain',
  tailwind: 'tailwindcss/tailwindcss-original',
  tailwindcss: 'tailwindcss/tailwindcss-original',
  next: 'nextjs/nextjs-original',
  nextjs: 'nextjs/nextjs-original',
  dart: 'dart/dart-original',
  csharp: 'csharp/csharp-original',
  'c#': 'csharp/csharp-original',
  html: 'html5/html5-original',
  html5: 'html5/html5-original',
  css: 'css3/css3-original',
  css3: 'css3/css3-original',
  linux: 'linux/linux-original',
  figma: 'figma/figma-original',
  postman: 'postman/postman-original',
};

/** Normalise un nom de techno : lowercase, sans espaces / tirets / underscores / points. */
export function normalizeSkillName(name: string): string {
  return name.toLowerCase().replace(/[\s._-]+/g, '');
}

/** Icône SVG inline uniforme (chevrons code </>) encodée en data-URI (fallback). */
export const FALLBACK_SKILL_ICON: string =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a67c52" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  );

/** Retourne l'URL Devicon pour une techno, ou le fallback si inconnue. */
export function getSkillIcon(name: string): string {
  const key = normalizeSkillName(name);
  const slug = SLUG_MAP[key];
  if (!slug) return FALLBACK_SKILL_ICON;
  return `${DEVICON_BASE}/${slug}.svg`;
}
