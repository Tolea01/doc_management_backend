import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

const buildApiDocs = <T>(app: T): void => {
  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE)
    .setVersion(process.env.APP_VERSION)
    .addTag(process.env.APP_TAG)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app as any,
    swaggerConfig,
  );

  SwaggerModule.setup(process.env.SWAGGER_PATH, app as any, swaggerDocument);
};

export default buildApiDocs;
