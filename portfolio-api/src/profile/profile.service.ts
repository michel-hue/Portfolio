import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Profile } from './profile.entity.js';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {}

    async findOne() {
        const profile =
            await this.profileRepository.findOne({
                where: {},
                order: { id: 'ASC' },
            });

        if (!profile) {
            throw new NotFoundException(
                'Profil introuvable. Veuillez créer votre profil.',
            );
        }

        return profile;
    }

    async update(updateProfileDto: UpdateProfileDto) {
        try {
            let profile =
                await this.profileRepository.findOne({
                    where: {},
                    order: { id: 'ASC' },
                });

            if (!profile) {
                // Créer le profil s'il n'existe pas encore
                profile = this.profileRepository.create({
                    ...updateProfileDto,
                });
                return await this.profileRepository.save(profile);
            }

            Object.assign(profile, updateProfileDto);

            return await this.profileRepository.save(profile);
        } catch (error) {
            throw new InternalServerErrorException(
                error.message,
            );
        }
    }
}
