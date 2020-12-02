import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@app/core/helpers';
const { exec } = require('child_process');
const rimraf = require('rimraf');
const ejs = require('ejs');
const fs = require('fs');
import path = require('path');

const rootPath = basePath();
const commands = [
  {
    title: 'Removing github templates',
    cmd: `cd ${rootPath} && rm -rf .github`,
  },
  {
    title: 'Removing other files',
    cmd: `cd ${rootPath} && rm CODE_OF_CONDUCT.md CONTRIBUTING.md cover.jpg LICENSE.md README.md`,
  },
  {
    title: 'Cleaning git commits for you',
    cmd: `cd ${rootPath} && rm -rf .git`,
  },
  {
    title: 'Copying .env.example to .env',
    cmd: `cd ${rootPath} && cp .env.example .env`,
  },
];

@Injectable()
@Command('transformer', {
  desc: 'Creates a transformer',
})
export class CreateModule extends BaseCommand {
  public async handle(): Promise<void> {
    const name = await this.ask('name');
    // const template = await ejs.render(detail, {
    //   filename: name,
    // });

    // const contents = template({ filename: name });
    const contents = this.compileTemplate('transformer.ejs', {
      filename: name,
    });
    exec(`mkdir ${rootPath}src/transformer/${name}`, function (
      err,
      strdout,
      stderr,
    ) {
      if (err) {
        console.log('Folder creation err:' + err);
      }
      if (!err) {
        fs.writeFile(
          `${rootPath}src/transformer/${name}/Detail.ts`,
          contents,
          { flag: 'w', encoding: 'utf-8', recursive: true },
          (err) => {
            if (err) {
              return console.error(
                `Autsch! Failed to store template: ${err.message}.`,
              );
            }

            console.log(`Saved template!`);
          },
        );
      }
    });
  }
  compileTemplate(template: string, payload: Record<string, any>): any {
    const templateCompiler = ejs.render(
      fs.readFileSync(
        path.join(rootPath, 'src/core/console/stubs', template),
        'utf-8',
      ),
      payload,
    );
    return templateCompiler;
  }

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
