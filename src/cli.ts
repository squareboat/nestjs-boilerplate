#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { BaseConsoleModule } from './consolemodule';
import { BaseCommand, CommandMeta, Logger } from '@app/core';
import * as yargs from 'yargs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BaseConsoleModule, {
    logger: false,
  });
  const argv = yargs.argv;

  const c = argv._[0];
  argv.command = c;

  if (typeof argv.command != 'string') {
    Logger.error(' PLEASE ADD A COMMAND ');
    return app.close();
  }

  const target = CommandMeta.getTarget(argv.command);
  if (!target) {
    Logger.error(` ${argv.command} : command not found `);
    return app.close();
  }

  const command = app.get<BaseCommand>(target, { strict: false });

  command.setReceivedOptions(argv);

  if (argv.options) {
    const options = command.options();
    const commandOptions = [];
    for (const key in options) {
      commandOptions.push({
        name: key,
        description: options[key].desc,
        required: options[key].req ? 'Y' : '',
      });
    }

    if (commandOptions.length) {
      Logger.table(commandOptions);
    } else {
      Logger.info('No option found for specified command');
    }
    return app.close();
  }

  await command.work();
  await app.close();
}

bootstrap();
