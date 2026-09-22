import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL == 'true',
  logging: process.env.DB_LOGGING === 'true',
  synchronize: false,
  migrationsRun: true,
  migrations: [join(__dirname, '../db/migrations/**/*{.ts,.js}')],
  autoLoadEntities: true,
}));
