import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { Skill } from './skill.entity.js';

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(Skill)
        private readonly skillRepository: Repository<Skill>,
    ) {}

    async create(createSkillDto: CreateSkillDto) {
        try {
            const skill = this.skillRepository.create(createSkillDto);
            return await this.skillRepository.save(skill);
        } catch (error) {
            throw new InternalServerErrorException(
                error.message,
            );
        }
    }

    async findAll() {
        return await this.skillRepository.find({
            order: { order: 'ASC' },
        });
    }

    async findOne(id: number) {
        const skill =
            await this.skillRepository.findOne({
                where: { id },
            });

        if (!skill) {
            throw new NotFoundException(
                'Compétence introuvable',
            );
        }

        return skill;
    }

    async update(
        id: number,
        updateSkillDto: UpdateSkillDto,
    ) {
        const skill =
            await this.skillRepository.findOne({
                where: { id },
            });

        if (!skill) {
            throw new NotFoundException(
                'Compétence introuvable',
            );
        }

        Object.assign(skill, updateSkillDto);

        return await this.skillRepository.save(skill);
    }

    async remove(id: number) {
        const skill =
            await this.skillRepository.findOne({
                where: { id },
            });

        if (!skill) {
            throw new NotFoundException(
                'Compétence introuvable',
            );
        }

        await this.skillRepository.remove(skill);

        return {
            message: 'Compétence supprimée',
        };
    }
}
