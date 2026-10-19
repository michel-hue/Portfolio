import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
