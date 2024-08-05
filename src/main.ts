import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app/app.module';
import buildAppiDocs from './docs/swagger.builder';
import AppConfig from './config/app.config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);
  const configService: ConfigService = new ConfigService();
  const appConfig: AppConfig = new AppConfig(configService);

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(new I18nValidationPipe())
    .useGlobalFilters(new I18nValidationExceptionFilter())
    .enableCors(appConfig.getCorsOptions());

  buildAppiDocs(app, configService);

  await app.listen(configService.get<number>('APP_PORT') || 3000);
}

bootstrap();
