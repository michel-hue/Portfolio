import { IsNotEmpty, IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {

    @ApiProperty({ description: 'Nom de l\'expéditeur' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email de l\'expéditeur' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Sujet du message' })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({ description: 'Contenu du message' })
    @IsNotEmpty()
    @IsString()
    message: string;
}
