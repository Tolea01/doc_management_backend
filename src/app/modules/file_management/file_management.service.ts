import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FileManagementService {
  constructor(private readonly configService: ConfigService) {}

  getFilePath(filename: string): string | null {
    const uploadPath: string = this.configService.get<string>(
      'ENTRY_DOCUMENTS_UPLOAD_DEST',
    );
    const filePath: string = resolve(process.cwd(), uploadPath, filename);

    if (!existsSync(filePath)) {
      return null;
    }

    return filePath;
  }

  getFileNames(files: Array<Express.Multer.File>): string[] | null {
    if (!files || files.length === 0) {
      return null;
    }

    const fileNames: string[] = files.map((file) => file.filename);

    return fileNames;
  }

  download(fileName: string): StreamableFile {
    const filePath: string = this.getFilePath(fileName);
    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }

  delete(filePath: string): void {
    if (this.getFilePath(filePath)) {
      unlinkSync(filePath);
    }
  }
}
