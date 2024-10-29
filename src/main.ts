import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app/app.module';
import buildApiDocs from './docs/swagger.builder';
import AppConfig from './config/app.config';
import { config as dotenvConfig } from 'dotenv';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

dotenvConfig();

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(new I18nValidationPipe())
    .useGlobalFilters(new I18nValidationExceptionFilter())
    .enableCors(new AppConfig().getCorsOptions());

  buildApiDocs(app);

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
