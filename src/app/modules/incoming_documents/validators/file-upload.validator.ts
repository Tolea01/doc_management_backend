import { ParseFilePipe, ParseFilePipeBuilder } from '@nestjs/common';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const fileUploadValidator = (): ParseFilePipe => {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: 'pdf' }) // Validare tip fișier
    .addMaxSizeValidator({ maxSize: 200 * 1024 * 1024 }) // Limită de 200MB
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: () => {
        return new BadRequestException('Fișierul încărcat nu este valid');
      },
    });
};

export const fileNameTransformer = () => {
  return {
    storage: diskStorage({
      destination: process.env.INCOMING_DOCUMENTS_UPLOAD_DEST,
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + file.originalname.replace(/\s/g, '_');
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(
          new BadRequestException('Fișierul trebuie să fie un PDF'),
          false,
        );
      }
      callback(null, true);
    },
    limits: {
      fileSize: 200 * 1024 * 1024,
    },
  };
};
