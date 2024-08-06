import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConnectionOptions from 'src/database/config/db.connection.config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import I18nConfig from 'app/common/interfaces/I18nConfig.interface';

@Injectable()
export default class AppConfig {
  constructor(private configService: ConfigService) {}

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
}
