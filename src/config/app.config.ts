import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConnectionOptions from 'src/database/config/db.connection.config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import I18nConfig from 'app/common/interfaces/I18nConfig.interface';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Injectable()
export default class AppConfig {
  private configService: ConfigService = new ConfigService();

  constructor() {}

  public getCorsOptions(): CorsOptions {
    return {
      origin: [this.configService.get<string>('CORS_ALLOWED_ORIGINS')],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
  }

  public databaseConnection(): TypeOrmModuleOptions {
    return {
      ...dbConnectionOptions,
      autoLoadEntities: true,
      entities: ['dist/app/modules/**/*.entity{.ts,.js}'],
    };
  }

  public getI18nConfig(): I18nConfig {
    return {
      fallbackLanguage:
        this.configService.get<string>('DEFAULT_APP_LANGUAGE') || 'ro',
      loaderOptions: {
        path: join(__dirname, '/../i18n/'),
        watch: true,
      },
    };
  }

  public getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      signOptions: {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
      },
    };
  }

  public getMulterOptions(destination: string) {
    return {
      storage: diskStorage({
        destination: this.configService.get<string>(`${destination}`),
        filename: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const filename =
            Date.now() + '-' + file.originalname.replace(/\s/g, '_');
          callback(null, filename);
        },
      }),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Fișierul PDF nu este valid'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 200 * 1024 * 1024,
      },
    };
  }
}
