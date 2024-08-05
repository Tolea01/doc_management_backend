import { DataSource } from 'typeorm';
import dbConnectionOptions from './db.connection.config';
import { ConfigService } from '@nestjs/config';

const AppDataSource: DataSource = new DataSource({
  ...dbConnectionOptions(new ConfigService()),
  entities: ['dist/app/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
