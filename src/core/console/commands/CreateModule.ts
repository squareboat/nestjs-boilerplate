import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@app/core/helpers';
const { exec } = require('child_process');
const rimraf = require('rimraf');
const ejs = require('ejs');
const fs = require('fs');
import path = require('path');
import { lowerCase, upperCase } from 'lodash';

const rootPath = basePath();
const commands = (name) => [
  {
    title: 'Creating Module.... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/module.ts`,
        that.compileTemplate('module.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
        }),
      );
      that.writeFile(
        `${name}s/constants.ts`,
        that.compileTemplate('constants.ejs', {
          modelName: upperCase(name),
        }),
      );
      that.writeFile(
        `${name}s/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: 'module',
        }),
      );
    },
  },
  {
    title: 'Creating Controllers.... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/controllers`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/controllers/${that.toPascalCase(name)}Controller.ts`,
        that.compileTemplate('controller.ejs', {
          className: that.toPascalCase(name),
          name: lowerCase(name),
        }),
      );
      that.writeFile(
        `${name}s/controllers/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: `${that.toPascalCase(name)}Controller`,
        }),
      );
    },
  },
  {
    title: 'Creating Service... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/services`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/services/${that.toPascalCase(name)}Service.ts`,
        that.compileTemplate('service.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
          name: lowerCase(name),
        }),
      );
      that.writeFile(
        `${name}s/services/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: `${that.toPascalCase(name)}Service`,
        }),
      );
    },
  },
  {
    title: 'Creating Models... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/models`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/models/${that.toPascalCase(name)}.ts`,
        that.compileTemplate('model.ejs', {
          className: that.toPascalCase(name),
          constantName: upperCase(name),
          name: lowerCase(name),
        }),
      );
      that.writeFile(
        `${name}s/models/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
      );
    },
  },
  {
    title: 'Creating repositories... 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/repositories/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: 'contracts',
        }),
      );
      that.writeFile(
        `${name}s/repositories/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: 'databases',
        }),
        'a',
      );
    },
  },
  {
    title: 'Removing github Databases 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories/databases`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/repositories/databases/${that.toPascalCase(name)}.ts`,
        that.compileTemplate('database.ejs', {
          modelName: that.toPascalCase(name),
        }),
      );
      that.writeFile(
        `${name}s/repositories/databases/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
        'a',
      );
    },
  },
  {
    title: 'Removing github Contracts 🚀 ',
    cmd: `mkdir ${rootPath}src/${name}s/repositories/contracts`,
    postcmd: function (that, name) {
      that.writeFile(
        `${name}s/repositories/contracts/${that.toPascalCase(name)}.ts`,
        that.compileTemplate('contract.ejs', {
          modelName: that.toPascalCase(name),
        }),
      );
      that.writeFile(
        `${name}s/repositories/contracts/index.ts`,
        that.compileTemplate('index.ejs', {
          filename: that.toPascalCase(name),
        }),
        'a',
      );
    },
  },
];

@Injectable()
@Command('module:init', {
  desc: 'Creates a Module',
})
export class CreateModule extends BaseCommand {
  public async handle(): Promise<void> {
    const name = await this.ask('Enter name of module :');
    const that = this;

    for (const command of commands(name)) {
      exec(command.cmd, function (err) {
        if (err) {
          console.log('Folder creation err:' + err);
        } else if (command.postcmd) {
          command.postcmd(that, name);
        }
      });
    }
  }

  private compileTemplate(template: string, payload: Record<string, any>): any {
    const templateCompiler = ejs.render(
      fs.readFileSync(
        path.join(rootPath, 'src/core/console/stubs', template),
        'utf-8',
      ),
      payload,
    );
    return templateCompiler;
  }

  private writeFile(path, template, flag?) {
    if (!flag) flag = 'w';
    fs.writeFile(
      `${rootPath}src/${path}`,
      template,
      { flag, encoding: 'utf-8', recursive: true },
      (err) => {
        if (err) {
          return console.error(
            `Autsch! Failed to store template: ${err.message}.`,
          );
        }
        console.log(`✅ ${path}`);
      },
    );
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
