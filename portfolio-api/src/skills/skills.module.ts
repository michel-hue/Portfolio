import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service.js';
import { SkillsController } from './skills.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill]),
    ],
    providers: [SkillsService],
    controllers: [SkillsController],
})
export class SkillsModule {}
