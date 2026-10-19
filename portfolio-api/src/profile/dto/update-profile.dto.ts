import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {

    @ApiPropertyOptional({ description: 'Nom complet' })
    @IsOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Titre professionnel, ex: Développeur Full Stack' })
    @IsOptional()
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Biographie' })
    @IsOptional()
    @IsString()
    bio: string;

    @ApiPropertyOptional({ description: "URL de la photo de profil" })
    @IsOptional()
    @IsString()
    avatar: string;

    @ApiPropertyOptional({ description: 'Adresse email' })
    @IsOptional()
    @IsString()
    email: string;

    @ApiPropertyOptional({ description: "URL du profil GitHub" })
    @IsOptional()
    @IsString()
    github: string;

    @ApiPropertyOptional({ description: "URL du profil LinkedIn" })
    @IsOptional()
    @IsString()
    linkedin: string;

    @ApiPropertyOptional({ description: "URL du profil Twitter" })
    @IsOptional()
    @IsString()
    twitter: string;

    @ApiPropertyOptional({ description: 'Localisation' })
    @IsOptional()
    @IsString()
    location: string;
}
