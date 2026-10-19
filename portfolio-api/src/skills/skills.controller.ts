import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) {}

    @ApiOperation({ summary: 'Récupérer toutes les compétences' })
    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @ApiOperation({ summary: 'Récupérer une compétence' })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.skillsService.findOne(id);
    }

    @ApiOperation({ summary: 'Créer une compétence' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createSkillDto: CreateSkillDto) {
        return this.skillsService.create(createSkillDto);
    }

    @ApiOperation({ summary: 'Modifier une compétence' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateSkillDto: UpdateSkillDto) {
        return this.skillsService.update(id, updateSkillDto);
    }

    @ApiOperation({ summary: 'Supprimer une compétence' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.skillsService.remove(id);
    }
}
