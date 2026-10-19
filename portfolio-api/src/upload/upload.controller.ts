import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UploadService } from './upload.service.js';

const ALLOWED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'];

interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

type FilenameCallback = (error: Error | null, filename: string) => void;
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Uploader une image' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image à uploader (jpeg, jpg, png, gif, webp, svg) - 5MB max',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req: Request, file: UploadedFile, callback: FilenameCallback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = extname(file.originalname).toLowerCase();
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (_req: Request, file: UploadedFile, callback: FileFilterCallback) => {
        const extension = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          return callback(
            new BadRequestException(
              `Format de fichier non supporté. Formats acceptés : ${ALLOWED_EXTENSIONS.join(', ')}`,
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post()
  uploadFile(@UploadedFile() file: UploadedFile, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }
    const url = this.uploadService.buildUrl(
      req.protocol,
      req.get('host') ?? '',
      file.filename,
    );
    return { url };
  }
}