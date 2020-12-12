import { registerAs } from '@nestjs/config';
import { basePath } from '@libs/core';

export default registerAs('db', () => ({
  type: process.env.DB_TYPE || 'mysql2',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'test',
}));
