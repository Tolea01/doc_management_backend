import { ConfigModule } from '@nestjs/config';

export default class AppConfig {
  public static setupConfigModule(): ReturnType<typeof ConfigModule.forRoot> {
    return ConfigModule.forRoot({ isGlobal: true });
  }
}
