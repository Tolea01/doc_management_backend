import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule } from '@nestjs/config';

export default class AppConfig {
  public static setupConfigModule(): ReturnType<typeof ConfigModule.forRoot> {
    return ConfigModule.forRoot({ isGlobal: true });
  }

  public static getCorsOptions(): CorsOptions {
    return {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }
}
