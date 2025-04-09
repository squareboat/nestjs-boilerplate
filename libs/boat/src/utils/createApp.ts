// this helps in creating boilerplate friendly monorepo apps
import { ConsoleIO } from '@squareboat/nest-console';
import { spawn } from 'child_process';
import { BuildUtils } from './buildUtils';
import * as fs from 'fs/promises';


export class Create {
  static async common(path: string) {
    const winPath = path.replace(/\//g, '\\');
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        process.platform === 'win32' ? 'del' : 'rm',
        process.platform === 'win32'
          ? [`/s`, `/q`, `${winPath}\\src\\*.spec.ts`]
          : [`-rf`, `${path}/src/*.spec.ts`],
        { shell: true },
      );
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        process.platform === 'win32' ? 'move' : 'mv',
        process.platform === 'win32'
          ? [`${winPath}\\src\\*.module.ts`, `${winPath}\\src\\module.ts`]
          : [`${path}/src/*.module.ts`, `${path}/src/module.ts`],
        { shell: true },
      );
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        process.platform === 'win32' ? 'move' : 'mv',
        process.platform === 'win32'
          ? [`${winPath}\\src\\*.service.ts`, `${winPath}\\src\\service.ts`]
          : [`${path}/src/*.service.ts`, `${path}/src/service.ts`],
        { shell: true },
      );
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
  }

  static async app(appName: string, cli: ConsoleIO) {
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn('nest', ['g', 'app', appName], {
        shell: true,
      });
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        process.platform === 'win32' ? 'rmdir' : 'rm',
        process.platform === 'win32'
          ? ['/s', '/q', `apps/${appName}/test`]
          : [`-rf`, `apps/${appName}/test`],
        { shell: true },
      );
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
    await Create.common(`apps/${appName}`);
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        process.platform === 'win32' ? 'move' : 'mv',
        process.platform === 'win32'
          ? [
              `apps\\${appName}\\src\\*.controller.ts`,
              `apps\\${appName}\\src\\controller.ts`,
            ]
          : [
              `apps/${appName}/src/*.controller.ts`,
              `apps/${appName}/src/controller.ts`,
            ],
        { shell: true },
      );
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });

    let controller = await BuildUtils.readFile(
      `apps/${appName}/src/controller.ts`
    );
    controller = controller.replace(
      `import { Controller, Get } from '@nestjs/common';`,
      `import { Controller, Get } from '@nestjs/common';\nimport { RestController } from '@libs/boat';`,
    );
    controller = controller.replace(
      `Controller {`,
      `Controller extends RestController {`,
    );
    controller = controller.replace(`{}`, `{\n\t\tsuper();\n}`);
    controller = controller.replace(`./${appName}.service`, './service');
    await BuildUtils.writeFile(`apps/${appName}/src/controller.ts`, controller);
    let module = await BuildUtils.readFile(`apps/${appName}/src/module.ts`);
    module = module.replace(`./${appName}.service`, './service');
    module = module.replace(`./${appName}.controller`, './controller');
    module = module.replace(
      `import { Module } from '@nestjs/common';`,
      `import { Module } from '@nestjs/common';\nimport { BoatModule } from '@libs/boat';`,
    );
    module = module.replace(`imports: [],`, `imports: [BoatModule],`);
    await BuildUtils.writeFile(`apps/${appName}/src/module.ts`, module);
    const properCaseNameModule =
      appName
        .split('-')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join('') + 'Module';
    const main = `import { RestServer } from '@libs/boat';\nimport { ${properCaseNameModule} } from './module';\n\nRestServer.make(${properCaseNameModule}, {\n\tport: +process.env.APP_PORT,\n\taddValidationContainer: true\n});`;
    await BuildUtils.writeFile(`apps/${appName}/src/main.ts`, main);
    await BuildUtils.writeFile(
      `apps/${appName}/tsconfig.app.json`,
      JSON.stringify(
        {
          extends: '../tsconfig.app.json',
        },
        null,
        2,
      ),
    );
    return properCaseNameModule
  }

  static generateStrings(baseString: string) {
    // Convert kebab-case to PascalCase
    let pascalCase = baseString
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // Replace 's' at the end of pascalCase string
    let name = pascalCase.replace(/Lib$/, '');
    if (name.endsWith('s')) {
      name = name.slice(0, -1);
    }

    return {
      pascalCase,
      interface: `I${name}`,
      interfaceSearch: `I${name}Search`,
      repository: `${pascalCase}Repository`,
      model: `${name}Model`,
      name,
    };
  }

  static async lib(appName: string, cli: ConsoleIO) {
    await new Promise<void>((resolve, reject) => {
      const childProcess = spawn('nest', ['g', 'lib', appName], {
        shell: true
      });
      childProcess.on('close', (code) => (code === 0 ? resolve() : reject()));
    });
    await Create.common(`libs/${appName}`);
    let index = await BuildUtils.readFile(`libs/${appName}/src/index.ts`);
    index = index.replace(
      `export * from './${appName}.module';`,
      `export * from './module';`,
    );
    index = index.replace(
      `export * from './${appName}.service';`,
      `export * from './service';`,
    );
    await BuildUtils.writeFile(`libs/${appName}/src/index.ts`, index);

    const repositoryPath = `libs/${appName}/src/repositories`;
    await fs.mkdir(repositoryPath, { recursive: true });

    const string = Create.generateStrings(appName);

    const contractContent = `
import { Pagination, RepositoryContract } from '@squareboat/nestjs-objection';
import { ${string.interface}, ${string.interfaceSearch} } from '@libs/common';

export interface ${string.repository}Contract extends RepositoryContract<${string.interface}> {
  search(filters: ${string.interfaceSearch}): Promise<Pagination<${string.interface}>>;
}
`;
    await BuildUtils.writeFile(`${repositoryPath}/contract.ts`, contractContent);
    const databaseContent = `
import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel, Pagination } from '@squareboat/nestjs-objection';
import { ${string.interface}, ${string.interfaceSearch} } from '@libs/common';
import { ${string.model} } from '../models';
import { ${string.repository}Contract } from './contract';
import { get } from 'lodash';

@Injectable()
export class ${string.repository}
  extends DB<${string.interface}>
  implements ${string.repository}Contract
{
  @InjectModel(${string.model})
  model: ${string.model};

  search(filters: ${string.interfaceSearch}): Promise<Pagination<${string.interface}>> {
    const query = this.query();

    if ('status' in filters) query.where('status', filters.status);
    query.cOrderBy(filters.sort || 'createdAt:DESC');

    return get(filters, 'paginate', true)
      ? query.paginate<${string.interface}>(filters.page, filters.perPage)
      : query.allPages<${string.interface}>();
  }
}
`;
    await BuildUtils.writeFile(`${repositoryPath}/database.ts`, databaseContent);

    const indexContent = `
export * from './contract';
export * from './database';
`;
    await BuildUtils.writeFile(`${repositoryPath}/index.ts`, indexContent);

    const modelsContent = `
import { BaseModel } from '@squareboat/nestjs-objection';

export class ${string.model} extends BaseModel {
    static tableName: string = '${string.name.toLowerCase()}s';
}
`;
    await BuildUtils.writeFile(`libs/${appName}/src/models.ts`, modelsContent);
    const constantsContent = `
    export class ${string.name}ModuleConstants {
        static ${string.name.toUpperCase()}_REPOSITORY = '${string.name.toUpperCase()}_REPOSITORY';
    }
    `;
    await BuildUtils.writeFile(`libs/${appName}/src/constants.ts`, constantsContent);
    let module = await BuildUtils.readFile(`libs/${appName}/src/module.ts`);
    module = module.replace(
      `from './${appName}.service';`,
      `from './service';\nimport { ${string.repository}Contract } from './repositories';\nimport { ${string.name}ModuleConstants } from './constants';`,
    );
    module = module.replace(
      `providers: [${string.pascalCase}Service],`,
      `providers:[
        ${string.pascalCase}Service, 
        {
          provide: ${
            string.name
          }ModuleConstants.${string.name.toUpperCase()}_REPOSITORY ,
          useClass: ${string.repository}
        }
      ],`,
    );
    await BuildUtils.writeFile(`libs/${appName}/src/module.ts`, module);
    let serviceContent = await BuildUtils.readFile(
      `libs/${appName}/src/service.ts`
    );
    serviceContent = serviceContent.replace(
      `import { Injectable } from '@nestjs/common';`,
      `import { Inject, Injectable } from '@nestjs/common';\nimport { ${string.name}ModuleConstants } from './constants';\nimport { ${string.repository} } from './repositories';`,
    );
    serviceContent = serviceContent.replace(
      `{}`,
      `{\n\tconstructor(\n\t\t@Inject(${
        string.name
      }ModuleConstants.${string.name.toUpperCase()}_REPOSITORY)\n\t\tpublic readonly repo: ${
        string.repository
      })\n\t{}\n}`,
    );
    await BuildUtils.writeFile(`libs/${appName}/src/service.ts`, serviceContent);
  }

  static async worker(appName: string, cli: ConsoleIO) {
    const moduleName = await Create.app(appName, cli);

    let main = await BuildUtils.readFile(`apps/${appName}/src/main.ts`);
    main = `
import { NestFactory } from '@nestjs/core';
import yargs from 'yargs-parser';
import { ConfigService } from '@nestjs/config';
import { fromContainerMetadata } from '@aws-sdk/credential-providers';
import { ConsoleIO } from '@squareboat/nest-console';
import { QueueWorker } from '@squareboat/nest-queue';
import { ${moduleName} } from './module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    ${moduleName},
  );

  const appConfig = app.get(ConfigService, { strict: false });
  if (appConfig.get('app.runningOnEcs')) {
    const credentials = fromContainerMetadata();
    const resolvedCredentials = await credentials();
    // AWS SDK v3 uses resolved credentials directly
    process.env.AWS_ACCESS_KEY_ID = resolvedCredentials.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = resolvedCredentials.secretAccessKey;
    process.env.AWS_SESSION_TOKEN = resolvedCredentials.sessionToken;
  }

  const argv = yargs(process.argv.slice(2));

  const _cli = ConsoleIO.from(
    'queue:work {--sleep=} {--connection=} {--queue=}',
    argv,
  );

  const sleep = _cli.option<number>('sleep');
  const connection = '${moduleName.toLocaleLowerCase().replace('worker', '').replace('module', '')}';
  const queue = '${moduleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('-worker', '').replace('-module', '')}-queue';

  const options: { [key: string]: string | number } = {};
  if (sleep) options['sleep'] = sleep;
  if (connection) options['connection'] = connection;
  if (queue) options['queue'] = queue;

  await QueueWorker.init({
    sleep,
    connection,
    queue,
  }).listen();
}
bootstrap();
`
    await BuildUtils.writeFile(`apps/${appName}/src/main.ts`, main);

    await BuildUtils.deleteFile(
      `apps/${appName}/src/controller.ts`);
  }
}
