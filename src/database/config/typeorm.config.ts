import { DataSource } from 'typeorm';
import dbConnectionOptions from './db.connection.config';

const AppDataSource: DataSource = new DataSource({
  ...dbConnectionOptions,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
