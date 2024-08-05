import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

const buildAppiDocs = <T>(app: T, configService: ConfigService): void => {
  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_TITLE'))
    .setVersion(configService.get<string>('APP_VERSION'))
    .addTag(configService.get<string>('APP_TAG'))
    .build();
  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app as any,
    swaggerConfig,
  );

  SwaggerModule.setup(
    configService.get<string>('SWAGGER_PATH'),
    app as any,
    swaggerDocument,
  );
};

export default buildAppiDocs;
