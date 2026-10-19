import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module.js';
import { ProfileService } from './profile/profile.service.js';
import { SkillsService } from './skills/skills.service.js';
import { ProjectsService } from './projects/projects.service.js';
import { Skill } from './skills/skill.entity.js';
import { Project } from './projects/project.entity.js';
import { Profile } from './profile/profile.entity.js';

async function seedReset() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const dataSource = app.get(DataSource);
        const profileService = app.get(ProfileService);
        const skillsService = app.get(SkillsService);
        const projectsService = app.get(ProjectsService);

        // 1. Vider les tables skills et projects (le compte admin est préservé)
        const deletedProjects = await dataSource
            .getRepository(Project)
            .clear();
        console.log('Table "projects" vidée.');
        void deletedProjects;

        const deletedSkills = await dataSource
            .getRepository(Skill)
            .clear();
        console.log('Table "skills" vidée.');
        void deletedSkills;

        // 2. Réinitialiser le profil (supprime le profil existant s'il y en a un)
        try {
            const existingProfile = await profileService.findOne();
            await dataSource.getRepository(Profile).delete(existingProfile.id);
            console.log(
                `Profil existant ("${existingProfile.name}") supprimé.`,
            );
        } catch {
            console.log('Aucun profil existant à supprimer.');
        }

        // 3. Réinsérer le profil "Manuel" (mêmes données que seed.ts)
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
        console.log('Profil "Manuel" réinséré (1 profil).');

        // 4. Réinsérer les 8 compétences (mêmes que seed.ts)
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
        console.log(`${skills.length} compétences réinsérées.`);

        // 5. Réinsérer les 5 projets de démo
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
                featured: true,
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
            {
                title: 'Blog Tech Personnel',
                description:
                    'Blog avec articles sur le dev web/mobile, markdown, commentaires et recherche full-text.',
                image: 'https://picsum.photos/seed/blog/800/600',
                technologies: ['Next.js', 'PostgreSQL', 'Tailwind CSS'],
                githubUrl: 'https://github.com/manuel/blog',
                demoUrl: 'https://blog-exemple.com',
                featured: false,
                order: 5,
            },
        ];
        for (const project of projects) {
            await projectsService.create(
                project as unknown as Parameters<ProjectsService['create']>[0],
            );
        }
        console.log(`${projects.length} projets réinsérés.`);

        console.log(
            'Seed reset terminé avec succès : 1 profil, 8 compétences, 5 projets. Compte admin préservé.',
        );
    } finally {
        await app.close();
    }
}

seedReset().catch((error) => {
    console.error('Erreur lors du seed reset :', error);
    process.exit(1);
});
