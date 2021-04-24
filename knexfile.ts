import 'dotenv/config';
import * as Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

module.exports = {
  client: process.env.DB_TYPE || 'mysql2',
  debug: !!+process.env.DB_DEBUG,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8',
  },
  useNullAsDefault: true,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: './src/_db/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/_db/seeds',
  },
  ...knexSnakeCaseMappers(),
} as Knex.Config;
