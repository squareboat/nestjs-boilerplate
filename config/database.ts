import { registerAs } from '@nestjs/config';
import { DatabaseOptions } from '@squareboat/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';

export default registerAs(
  'db',
  () =>
    ({
      isGlobal: true,
      default: 'mysql2',
      connections: {
        mysql2: {
          client: 'mysql2',
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
          migrations: {
            directory: './database/migrations',
          },
          ...knexSnakeCaseMappers(),
        },
      },
    } as DatabaseOptions),
);
