import { IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectDto {

    @ApiProperty({ description: 'Titre du projet' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Description du projet' })
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ description: "URL de l'image du projet" })
    @IsOptional()
    @IsString()
    image: string;

    @ApiProperty({ description: 'Technologies utilisées', type: [String] })
    @IsArray()
    @IsString({ each: true })
    technologies: string[];

    @ApiPropertyOptional({ description: "URL du dépôt GitHub" })
    @IsOptional()
    @IsString()
    githubUrl: string;

    @ApiPropertyOptional({ description: 'URL de la démo en ligne' })
    @IsOptional()
    @IsString()
    demoUrl: string;

    @ApiPropertyOptional({ description: 'Projet mis en avant', default: false })
    @IsOptional()
    @IsBoolean()
    featured: boolean;

    @ApiPropertyOptional({ description: "Ordre d'affichage", default: 0 })
    @IsOptional()
    @IsNumber()
    order: number;
}
