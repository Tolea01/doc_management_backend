import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app/app.module';
import AppConfig from './config/app.config';
import buildApiDocs from './docs/swagger.builder';

dotenvConfig();

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(new I18nValidationPipe())
    .useGlobalFilters(new I18nValidationExceptionFilter())
    .use(cookieParser())
    .enableCors(new AppConfig().getCorsOptions());

  buildApiDocs(app);

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
