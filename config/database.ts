import { registerAs } from '@nestjs/config';
import { DatabaseOptions } from '@squareboat/nestjs-objection';

export default registerAs(
  'db',
  () =>
    ({
      isGlobal: true,
      default: 'pg',
      connections: {
        pg: {
          client: 'pg',
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
        },
      },
    } as DatabaseOptions),
);
