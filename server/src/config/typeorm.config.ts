import { DataSource } from 'typeorm';
import databaseConfig from './database.config';

const config = databaseConfig();

export default new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  ssl: config.ssl,
  logging: config.logging,
  synchronize: false,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
});
