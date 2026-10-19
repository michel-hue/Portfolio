import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { Project } from './project.entity.js';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async create(createProjectDto: CreateProjectDto) {
        try {
            const project = this.projectRepository.create(createProjectDto);
            return await this.projectRepository.save(project);
        } catch (error) {
            throw new InternalServerErrorException(
                error.message,
            );
        }
    }

    async findAll() {
        return await this.projectRepository.find({
            order: { order: 'ASC' },
        });
    }

    async findFeatured() {
        return await this.projectRepository.find({
            where: { featured: true },
            order: { order: 'ASC' },
        });
    }

    async findOne(id: number) {
        const project =
            await this.projectRepository.findOne({
                where: { id },
            });

        if (!project) {
            throw new NotFoundException(
                'Projet introuvable',
            );
        }

        return project;
    }

    async update(
        id: number,
        updateProjectDto: UpdateProjectDto,
    ) {
        const project =
            await this.projectRepository.findOne({
                where: { id },
            });

        if (!project) {
            throw new NotFoundException(
                'Projet introuvable',
            );
        }

        Object.assign(project, updateProjectDto);

        return await this.projectRepository.save(project);
    }

    async remove(id: number) {
        const project =
            await this.projectRepository.findOne({
                where: { id },
            });

        if (!project) {
            throw new NotFoundException(
                'Projet introuvable',
            );
        }

        await this.projectRepository.remove(project);

        return {
            message: 'Projet supprimé',
        };
    }
}
