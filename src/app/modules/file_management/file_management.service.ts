import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { translateMessage } from 'app/utils/translateMessage';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { I18nService } from 'nestjs-i18n/dist/services/i18n.service';
import { resolve } from 'path';

@Injectable()
export class FileManagementService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

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

  async saveFiles(pdfFiles: Array<Express.Multer.File>) {
    try {
      const filenames = this.getFileNames(pdfFiles);
      if (!filenames || filenames.length === 0) {
        throw new BadRequestException(
          await translateMessage(this.i18n, 'validation.INVALID_PDF'),
        );
      }

      return {
        message: await translateMessage(this.i18n, 'message.UPLOAD_SUCCESS'),
        filenames: filenames,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }

  async downloadFile(fileName: string): Promise<StreamableFile> {
    try {
      const filePath: string | null = this.getFilePath(fileName);

      if (!filePath) {
        throw new NotFoundException(
          await translateMessage(this.i18n, 'message.FILE_NOT_FOUND'),
        );
      }

      return new StreamableFile(createReadStream(filePath));
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }

  async deleteFile(fileName: string) {
    try {
      const filePath: string | null = this.getFilePath(fileName);

      if (!filePath) {
        throw new NotFoundException(
          await translateMessage(this.i18n, 'message.FILE_NOT_FOUND'),
        );
      }

      unlinkSync(filePath);

      return {
        message: await translateMessage(this.i18n, 'message.DELETE_SUCCESS'),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }
}
