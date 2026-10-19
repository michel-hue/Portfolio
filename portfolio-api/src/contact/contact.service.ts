import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateContactDto } from './dto/create-contact.dto.js';
import { Contact } from './contact.entity.js';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) {}

    async create(createContactDto: CreateContactDto) {
        try {
            const contact = this.contactRepository.create(createContactDto);
            return await this.contactRepository.save(contact);
        } catch (error) {
            throw new InternalServerErrorException(
                error.message,
            );
        }
    }

    async findAll() {
        return await this.contactRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: number) {
        const contact =
            await this.contactRepository.findOne({
                where: { id },
            });

        if (!contact) {
            throw new NotFoundException(
                'Message introuvable',
            );
        }

        contact.read = true;

        return await this.contactRepository.save(contact);
    }
}
