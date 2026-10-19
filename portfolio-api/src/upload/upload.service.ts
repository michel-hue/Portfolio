import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  buildUrl(protocol: string, host: string, filename: string): string {
    return `${protocol}://${host}/uploads/${filename}`;
  }
}
