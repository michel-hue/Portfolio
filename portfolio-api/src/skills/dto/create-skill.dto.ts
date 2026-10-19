import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
    @ApiProperty({ description: 'Nom de la compétence' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: "Icône de la compétence (emoji ou classe d'icône)" })
    @IsOptional()
    @IsString()
    icon: string;

    @ApiPropertyOptional({ description: 'Catégorie de la compétence', example: 'Frontend' })
    @IsOptional()
    @IsString()
    category: string;

    @ApiPropertyOptional({ description: "Ordre d'affichage", default: 0 })
    @IsOptional()
    @IsNumber()
    order: number;
}
