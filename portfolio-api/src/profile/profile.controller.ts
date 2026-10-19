import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Récupérer le profil' })
  @Get()
  findOne() {
    return this.profileService.findOne();
  }

  @ApiOperation({ summary: 'Modifier le profil' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }
}
