import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

const buildAppiDocs = <T>(app: T): void => {
  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE)
    .setVersion(process.env.APP_VERSION)
    .addTag(process.env.APP_TAG)
    .build();
  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app as any,
    swaggerConfig,
  );

  SwaggerModule.setup(process.env.SWAGGER_PATH, app as any, swaggerDocument);
};

export default buildAppiDocs;
