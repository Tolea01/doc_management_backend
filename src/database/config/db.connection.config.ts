import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenvConfig();

const dbConnectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default dbConnectionOptions;
