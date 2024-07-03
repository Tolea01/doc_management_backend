import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app/app.module';
import buildAppiDocs from './docs/swagger.builder';
import AppConfig from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.enableCors(AppConfig.getCorsOptions());
  app.useGlobalPipes(new ValidationPipe());

  buildAppiDocs<NestApplication>(app);

  await app.listen(process.env.APP_PORT);
}

bootstrap();
