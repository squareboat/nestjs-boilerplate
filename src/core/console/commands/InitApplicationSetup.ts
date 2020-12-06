import { BaseCommand, OptionInterface } from '../BaseCommand';
import { Command } from '../Decorators';
import { Injectable } from '@nestjs/common';
import { basePath } from '@app/core/helpers';
const { exec } = require('child_process');
const rimraf = require('rimraf');

const rootPath = basePath();
const commands = [
  {
    title: 'Removing github templates',
    cmd: `rm -rf .github`,
  },
  {
    title: 'Removing other files',
    cmd: `rm CODE_OF_CONDUCT.md CONTRIBUTING.md cover.jpg LICENSE.md README.md`,
  },
  {
    title: 'Cleaning git commits for you',
    cmd: `rm -rf .git`,
  },
  {
    title: 'Copying .env.example to .env',
    cmd: `cp .env.example .env`,
  },
  {
    title: 'Initializing Git Repo',
    cmd: 'git init',
  },
];

@Injectable()
@Command('init', {
  desc: 'Command to setup the project. Compatible for linux and mac only!',
})
export class InitApplicationSetup extends BaseCommand {
  public async handle(): Promise<void> {
    this.info('🚀 Starting Setup... \n');

    for (const command of commands) {
      this.info(`✅ ${command.title}`, 'white');
      exec(command.cmd);
    }

    this.info('\n🥳 Setup Finish!\n');
    this.success('⚡ You are all set now! Do amazing things!');
  }

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
