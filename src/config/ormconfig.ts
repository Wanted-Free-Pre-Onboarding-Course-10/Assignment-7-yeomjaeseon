import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { config } from 'dotenv';

config();

export const typeOrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: process.env.DATABASE,
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  synchronize: true,
  logging: true,
};
