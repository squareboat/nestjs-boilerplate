import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { CommandMeta } from '../CommandMeta';
import { Injectable } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
@Command('list', { desc: 'Command to list all the commands' })
export class ListCommands extends BaseCommand {
  public async handle(): Promise<void> {
    const commands = CommandMeta.getAllCommands();
    const list = [];
    for (const key in commands) {
      const options = commands[key].options;
      list.push({
        command: chalk.greenBright.bold(key),
        description: options.desc,
      });
    }

    this.table(list);
  }

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
