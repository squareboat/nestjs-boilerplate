import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@app/core/helpers';
import { capitalize } from 'lodash';
const { exec } = require('child_process');
const ejs = require('ejs');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');

const rootPath = basePath();

@Injectable()
@Command('transformer:init', {
  desc: 'Creates a transformer',
})
export class CreateTransformer extends BaseCommand {
  public async handle(): Promise<void> {
    const name = await this.ask('Enter Transformer name:');

    const contents = this.compileTemplate('transformer.ejs', {
      filename: capitalize(name),
    });
    exec(`mkdir ${rootPath}src/transformer/${name}`, function (err) {
      if (err) {
        console.log('Folder creation err:' + err);
      } else {
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

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
