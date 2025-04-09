import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import { BuildUtils } from '../utils';

@Injectable()
@Command('init {db}', { desc: 'Command to initialize the project' })
export class Init {
  async handle(_cli: ConsoleIO): Promise<void> {
    try {
      const db = _cli.argument('db');
      let dbconf: string;

      if (db === 'pg') {
        dbconf = `import { registerAs } from '@nestjs/config';
import { DatabaseOptions } from '@squareboat/nestjs-objection';
import { knexSnakeCaseMappers } from 'objection';

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
          migrations: {
            directory: './database/migrations',
          },
          ...knexSnakeCaseMappers(),
        },
      },
    } as DatabaseOptions),
);`;
      } else if (db === 'mysql') {
        dbconf = `import { knexSnakeCaseMappers } from 'objection';
import { registerAs } from '@nestjs/config';
import { DatabaseOptions } from '@squareboat/nestjs-objection';

export default registerAs(
  'db',
  () =>
    ({
      isGlobal: true,
      default: 'mysql',
      connections: {
        mysql: {
          client: 'mysql2',
          debug: !!+process.env.DB_DEBUG,
          connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            charset: 'utf8',
            timezone: process.env.DB_TIMEZONE,
          },
          useNullAsDefault: true,
          ...knexSnakeCaseMappers(),
        },
      },
    } as DatabaseOptions),
);`;
      } else {
        _cli.error('Invalid database type');
        return;
      }

      await BuildUtils.writeFile('config/database.ts', dbconf);

      let config = await BuildUtils.readFile('config/index.ts');
      config = config.replace(
        `import services from './services';`,
        `import services from './services';\nimport db from './database';`
      );
      config = config.replace(`services]`, `services, db]`);
      await BuildUtils.writeFile('config/index.ts', config);

      let app = await BuildUtils.readFile('src/app.ts');
      app = app.replace(
        `import { BoatModule } from '@libs/boat';`,
        `import { BoatModule } from '@libs/boat';\nimport { ConfigModule, ConfigService } from '@nestjs/config';\nimport { ObjectionModule } from '@squareboat/nestjs-objection';`
      );
      app = app.replace(
        `BoatModule,`,
        `ObjectionModule.registerAsync({
          isGlobal: true,
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => config.get('db'),
          inject: [ConfigService]
        }),
        BoatModule,`
      );
      await BuildUtils.writeFile('src/app.ts', app);

      await BuildUtils.deleteFile('CONTRIBUTING.md');
      await BuildUtils.deleteFile('LICENSE.MD');
      await BuildUtils.deleteFile('README.md');
      await BuildUtils.deleteFile('CODE_OF_CONDUCT.md');
      await BuildUtils.deleteFile('cover.jpg');

      await new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'copy' : 'cp';
        const childProcess = spawn(command, ['.env.example', '.env'], { shell: true });
        childProcess.on('close', (code) => (code === 0 ? resolve(0) : reject()));
      });

      let module = await BuildUtils.readFile('libs/boat/src/module.ts');
      module = module.replace(/, Init/g, '');
      await BuildUtils.writeFile('libs/boat/src/module.ts', module);

      let index = await BuildUtils.readFile('libs/boat/src/commands/index.ts');
      index = index.replace(`export * from './init';`, ``);
      await BuildUtils.writeFile('libs/boat/src/commands/index.ts', index);

      await BuildUtils.deleteFile('libs/boat/src/commands/init.ts');

      _cli.success('Project initialized successfully');
    } catch (error) {
      console.error('Error initializing project:', error);
    }
  }

}