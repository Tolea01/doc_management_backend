import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dbConnectionOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<number>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
});

export default dbConnectionOptions;
