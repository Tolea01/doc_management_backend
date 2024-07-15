import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConnectionOptions from 'src/database/config/db.connection.config';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n';

dotenvConfig();

export default class AppConfig {
  public static setupConfigModule(): ReturnType<typeof ConfigModule.forRoot> {
    return ConfigModule.forRoot({ isGlobal: true });
  }

  public static getCorsOptions(): CorsOptions {
    return {
      origin: [process.env.CORS_ALLOWED_ORIGINS],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
  }

  public static databaseConnection(): TypeOrmModuleOptions {
    return {
      ...dbConnectionOptions,
      autoLoadEntities: true,
      entities: ['dist/app/modules/**/*.entity{.ts,.js}'],
    };
  }

  public static getI18nConfig() {
    return {
      fallbackLanguage: process.env.DEFAULT_APP_LANGUAGE || 'ro',
      loaderOptions: {
        path: path.join(__dirname, '../..', '/i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['language'] },
        { use: AcceptLanguageResolver, options: [] },
      ],
    };
  }
}
