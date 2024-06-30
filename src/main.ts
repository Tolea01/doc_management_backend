import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app/app.module';
import buildAppiDocs from './docs/swagger.builder';
import AppConfig from './config/app.config';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.enableCors(AppConfig.getCorsOptions());

  buildAppiDocs<NestApplication>(app);

  await app.listen(process.env.APP_PORT);
}

bootstrap();
