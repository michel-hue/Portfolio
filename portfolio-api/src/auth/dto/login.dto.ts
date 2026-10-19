import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

    @ApiProperty({ description: "Adresse email de l'administrateur" })
    @IsEmail({}, { message: 'Email invalide' })
    @IsNotEmpty({ message: "L'email est requis" })
    email: string;

    @ApiProperty({ description: 'Mot de passe' })
    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;
}
