import {
    Injectable,
    InternalServerErrorException,
    ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    async create(data: { email: string; password: string; name: string; role?: string }) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: data.email },
            });

            if (existingUser) {
                throw new ConflictException(
                    'Cet email existe déjà',
                );
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = this.userRepository.create({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role ?? 'admin',
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(
                error.message,
            );
        }
    }
}
