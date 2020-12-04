import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@app/core/helpers';
import { capitalize } from 'lodash';
const { exec } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const rootPath = basePath();

@Injectable()
@Command('transformer:init', {
  desc: 'Creates a transformer',
})
export class CreateTransformer extends BaseCommand {
  public async handle(): Promise<void> {
    const that = this;

    const name = await this.ask('Enter Transformer name :');

    const transformerStub = this.compileTemplate('transformer.ejs', {
      filename: capitalize(name),
    });

    const indexStub = this.compileTemplate('index.ejs', {
      filename: 'Detail',
    });

    exec(`mkdir ${rootPath}src/transformer/${name}`, function (err) {
      if (err) {
        console.log('Folder creation err:' + err);
      } else {
        that.writeFile(`/transformer/${name}/Detail.ts`, transformerStub);
        that.writeFile(`transformer/${name}/index.ts`, indexStub);
      }
    });

    this.writeFile(
      `/transformer/index.ts`,
      '\r\n' +
        this.compileTemplate('index.ejs', {
          filename: name,
        }),
      'a',
    );
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

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
