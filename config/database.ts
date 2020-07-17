import { registerAs } from '@nestjs/config';
import { basePath } from '@app/core';

export default registerAs('db', () => ({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'test',
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  logging: !!process.env.DB_LOGGING,
  logger: 'file',
  migrations: [basePath() + 'dist/src/_db/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/_db/migrations',
  },
}));
