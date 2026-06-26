import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSoruceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE == 'true',
  logging: process.env.DB_LOGGING == 'true',
  entities: [],
};

const typeormDataSoruce = new DataSource(dataSoruceOptions);

export default typeormDataSoruce;

void typeormDataSoruce.initialize();
