import { Injectable } from '@nestjs/common';
import { basePath } from '@libs/core/helpers';
import { Command, _cli } from '@squareboat/nest-console';
const { exec } = require('child_process');

const rootPath = basePath();
const commands = [
  {
    title: 'Removing github templates',
    cmd: `rm -rf .github`,
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
  {
    title: 'Initializing Git Repo',
    cmd: `cd ${rootPath} && git init`,
  },
];

@Injectable()
@Command('init', {
  desc: 'Command to setup the project. Compatible for linux and mac only!',
})
export class InitApplicationSetup {
  public async handle(args: Record<string, any>): Promise<void> {
    _cli.info('🚀 Starting Setup... \n');

    for (const command of commands) {
      _cli.info(`✅ ${command.title}`, 'white');
      exec(command.cmd);
    }

    _cli.info('\n🥳 Setup Finish!\n');
    _cli.success('⚡ You are all set now! Do amazing things!');
  }
}
