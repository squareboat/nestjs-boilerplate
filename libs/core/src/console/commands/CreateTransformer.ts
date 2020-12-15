import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@libs/core/helpers';
import { capitalize } from 'lodash';
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const rootPath = basePath();

@Injectable()
@Command('transformer:create', {
  desc: 'Creates a transformer',
})
export class CreateTransformer extends BaseCommand {
  public async handle(): Promise<void> {
    const that = this;

    const name = await this.ask('Enter Transformer name :');

    const transformerStub = await this.compileTemplate('transformer.ejs', {
      filename: capitalize(name),
    });

    const indexStub = await this.compileTemplate('index.ejs', {
      filename: 'Detail',
    });

    await exec(`mkdir ${rootPath}src/transformer/${name}`);
    await that.writeFile(`/transformer/${name}/Detail.ts`, transformerStub);
    await that.writeFile(`transformer/${name}/index.ts`, indexStub);
    await this.writeFile(
      `/transformer/index.ts`,
      '\r\n' +
        (await this.compileTemplate('index.ejs', {
          filename: name,
        })),
      'a',
    );
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

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
