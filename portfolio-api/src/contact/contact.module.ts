import { Module } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
