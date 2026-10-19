import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UsersService } from './users/users.service.js';
import { ProfileService } from './profile/profile.service.js';
import { SkillsService } from './skills/skills.service.js';
import { ProjectsService } from './projects/projects.service.js';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const usersService = app.get(UsersService);
        const profileService = app.get(ProfileService);
        const skillsService = app.get(SkillsService);
        const projectsService = app.get(ProjectsService);

        // 1. Compte admin (idempotent)
        const adminEmail = 'admin@portfolio.com';
        const existingAdmin = await usersService.findByEmail(adminEmail);

        if (existingAdmin) {
            console.log('Le compte admin existe déjà, rien à faire.');
        } else {
            await usersService.create({
                email: adminEmail,
                password: 'admin123',
                name: 'Admin',
                role: 'admin',
            });

            console.log('Compte admin créé avec succès :');
            console.log('  Email : admin@portfolio.com');
            console.log('  Mot de passe : admin123 (à changer rapidement !)');
        }

        // 2. Profil (idempotent : crée uniquement s'il n'existe pas)
        try {
            const existingProfile = await profileService.findOne();
            if (existingProfile.name !== 'Manuel') {
                console.log(
                    `Un profil existe déjà ("${existingProfile.name}"), il est laissé tel quel.`,
                );
            } else {
                console.log('Le profil "Manuel" existe déjà, rien à faire.');
            }
        } catch {
            await profileService.update({
                name: 'Manuel',
                title: 'Développeur Full Stack',
                bio: 'Développeur passionné spécialisé dans les applications web et mobiles. J\'aime construire des produits épurés et performants avec React, NestJS et Flutter.',
                email: 'manuel.dev@exemple.com',
                github: 'https://github.com/manuel',
                linkedin: 'https://linkedin.com/in/manuel',
                location: 'Dakar, Sénégal',
                avatar: null,
            } as unknown as Parameters<ProfileService['update']>[0]);
            console.log('Profil "Manuel" créé avec succès.');
        }

        // 3. Compétences (n'ajoute que si la table est vide)
        const existingSkills = await skillsService.findAll();
        if (existingSkills.length > 0) {
            console.log(
                `${existingSkills.length} compétence(s) déjà présente(s), rien à faire.`,
            );
        } else {
            const skills = [
                { name: 'React', icon: '⚛️', category: 'Frontend', order: 1 },
                { name: 'TypeScript', icon: '📘', category: 'Frontend', order: 2 },
                { name: 'Angular', icon: '🅰️', category: 'Frontend', order: 3 },
                { name: 'NestJS', icon: '🦁', category: 'Backend', order: 4 },
                { name: 'PostgreSQL', icon: '🐘', category: 'Backend', order: 5 },
                { name: 'Flutter', icon: '💙', category: 'Mobile', order: 6 },
                { name: 'Docker', icon: '🐳', category: 'DevOps', order: 7 },
                { name: 'Git', icon: '🔧', category: 'Outils', order: 8 },
            ];
            for (const skill of skills) {
                await skillsService.create(skill);
            }
            console.log(`${skills.length} compétences insérées avec succès.`);
        }

        // 4. Projets (n'ajoute que si la table est vide)
        const existingProjects = await projectsService.findAll();
        if (existingProjects.length > 0) {
            console.log(
                `${existingProjects.length} projet(s) déjà présent(s), rien à faire.`,
            );
        } else {
            const projects = [
                {
                    title: 'Portfolio Personnel',
                    description:
                        'Site portfolio avec React, NestJS et PostgreSQL, dark/light mode, panel admin.',
                    image: 'https://picsum.photos/seed/portfolio/800/600',
                    technologies: ['React', 'NestJS', 'PostgreSQL', 'TypeScript'],
                    githubUrl: 'https://github.com/manuel/portfolio',
                    featured: true,
                    order: 1,
                },
                {
                    title: 'API de Réservation de Terrains',
                    description:
                        'API REST NestJS + TypeORM + PostgreSQL avec authentification, documentation Swagger, gestion des réservations.',
                    image: 'https://picsum.photos/seed/terrains/800/600',
                    technologies: ['NestJS', 'TypeORM', 'PostgreSQL', 'Swagger'],
                    githubUrl: 'https://github.com/manuel/appApi',
                    featured: true,
                    order: 2,
                },
                {
                    title: 'App Mobile E-commerce',
                    description:
                        'Application mobile Flutter avec panier, paiement et notifications push.',
                    image: 'https://picsum.photos/seed/mobile/800/600',
                    technologies: ['Flutter', 'Dart', 'Firebase'],
                    demoUrl: 'https://exemple.com/demo',
                    featured: false,
                    order: 3,
                },
                {
                    title: 'Dashboard Analytics',
                    description:
                        'Tableau de bord Angular avec graphiques temps réel et export de rapports.',
                    image: 'https://picsum.photos/seed/dashboard/800/600',
                    technologies: ['Angular', 'TypeScript', 'Chart.js'],
                    githubUrl: 'https://github.com/manuel/dashboard',
                    featured: false,
                    order: 4,
                },
            ];
            for (const project of projects) {
                await projectsService.create(
                    project as unknown as Parameters<ProjectsService['create']>[0],
                );
            }
            console.log(`${projects.length} projets insérés avec succès.`);
        }

        console.log('Seed terminé avec succès.');
    } finally {
        await app.close();
    }
}

seed().catch((error) => {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
});
