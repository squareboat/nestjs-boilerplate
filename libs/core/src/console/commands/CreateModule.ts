import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@libs/core/helpers';
const ejs = require('ejs');
const fs = require('fs').promises;
import path = require('path');
import { lowerCase, upperCase } from 'lodash';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const rootPath = basePath();
const commands = (name) => [
  {
    title: '\nCreating Module.... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/module.ts`,
        await that.compileTemplate('module.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/constants.ts`,
        await that.compileTemplate('constants.ejs', {
          modelName: upperCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: 'module',
        }),
      );
    },
  },
  {
    title: '\nCreating Controllers.... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/controllers`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/controllers/${that.toPascalCase(name)}Controller.ts`,
        await that.compileTemplate('controller.ejs', {
          className: that.toPascalCase(name),
          name: lowerCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/controllers/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: `${that.toPascalCase(name)}Controller`,
        }),
      );
    },
  },
  {
    title: '\nCreating Service... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/services`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/services/${that.toPascalCase(name)}Service.ts`,
        await that.compileTemplate('service.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
          name: lowerCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/services/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: `${that.toPascalCase(name)}Service`,
        }),
      );
    },
  },
  {
    title: '\nCreating Models... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/models`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/models/${that.toPascalCase(name)}.ts`,
        await that.compileTemplate('model.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
          name: lowerCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/models/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
      );
    },
  },
  {
    title: '\nCreating repositories... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/repositories/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: 'contracts',
        }),
      );
      await that.writeFile(
        `${name}s/repositories/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: 'databases',
        }),
        'a',
      );
    },
  },
  {
    title: '\nCreating Databases... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories/databases`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/repositories/databases/${that.toPascalCase(name)}.ts`,
        await that.compileTemplate('database.ejs', {
          modelName: that.toPascalCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/repositories/databases/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
      );
    },
  },
  {
    title: '\nCreating Contracts... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories/contracts`,
    postcmd: async (that, name) => {
      await that.writeFile(
        `${name}s/repositories/contracts/${that.toPascalCase(name)}.ts`,
        await that.compileTemplate('contract.ejs', {
          modelName: that.toPascalCase(name),
        }),
      );
      await that.writeFile(
        `${name}s/repositories/contracts/index.ts`,
        await that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
      );
    },
  },
];

@Injectable()
@Command('module:create', {
  desc: 'Creates a Module',
})
export class CreateModule extends BaseCommand {
  public async handle(): Promise<void> {
    const name = await this.ask('Enter name of module :');
    const that = this;

    for (const command of commands(name)) {
      try {
        console.log(command.title);
        await exec(command.cmd);
        if (command.postcmd) {
          await command.postcmd(that, name);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  private async compileTemplate(
    template: string,
    payload: Record<string, any>,
  ): Promise<any> {
    const stub = await fs.readFile(
      path.join(rootPath, 'libs/core/src/console/stubs', template),
      'utf-8',
    );
    const templateCompiler = ejs.render(stub, payload);
    return templateCompiler;
  }

  private async writeFile(path, template, flag?) {
    if (!flag) flag = 'w';
    await fs.writeFile(`${rootPath}src/${path}`, template, {
      flag,
      encoding: 'utf-8',
      recursive: true,
    });
    console.log(`✅ ${path}`);
  }

  private toPascalCase(string) {
    return `${string}`
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), (s) => s.toUpperCase());
  }

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
