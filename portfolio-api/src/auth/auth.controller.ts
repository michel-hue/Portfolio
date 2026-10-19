import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "Connexion de l'administrateur" })
    @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token JWT et les informations utilisateur' })
    @ApiResponse({ status: 401, description: 'Email ou mot de passe invalide' })
    @HttpCode(200)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }
}
