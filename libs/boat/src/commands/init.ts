import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Files that only belong to the boilerplate repository itself.
 * LICENSE.MD is kept on purpose: the MIT licence asks for the notice to stay
 * with copies of the code.
 */
const BOILERPLATE_FILES = [
  '.github',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'README.md',
  'cover.jpg',
];

const BOILERPLATE_REMOTE = /squareboat\/nestjs-boilerplate(\.git)?$/i;

@Injectable()
@Command('init {--yes}', {
  desc: 'Set up a new project: removes the boilerplate files, creates .env with new secrets and a fresh git repository',
})
export class InitApplicationSetup {
  async handle(_cli: ConsoleIO): Promise<void> {
    const root = process.cwd();
    const files = BOILERPLATE_FILES.filter((f) => existsSync(join(root, f)));
    const resetGit = this.isBoilerplateClone(root);

    _cli.info(`🚀 Setting up the project in ${root}`);
    if (files.length) _cli.info(`   remove: ${files.join(', ')}`);
    if (resetGit)
      _cli.info('   replace the boilerplate git history with a new repository');

    if (!_cli.option<boolean>('yes')) {
      const ok = await _cli.confirm('Continue?', false);
      if (!ok) {
        _cli.info('Nothing changed.');
        return;
      }
    }

    for (const file of files) {
      rmSync(join(root, file), { recursive: true, force: true });
      _cli.info(`✅ Removed ${file}`);
    }

    const env = join(root, '.env');
    const envExample = join(root, '.env.example');
    if (!existsSync(env) && existsSync(envExample)) {
      writeFileSync(env, this.withSecrets(readFileSync(envExample, 'utf8')), {
        mode: 0o600,
      });
      _cli.info('✅ Created .env from .env.example, with new random secrets');
    }

    if (resetGit) {
      rmSync(join(root, '.git'), { recursive: true, force: true });
    }
    if (!existsSync(join(root, '.git'))) {
      try {
        execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
        _cli.info('✅ Initialized a new git repository');
      } catch {
        _cli.error(' Could not run `git init`, is git installed? ');
      }
    }

    _cli.success('⚡ You are all set now! Do amazing things!');
  }

  /**
   * Fills empty JWT_SECRET / RESET_PASSWORD_SECRET lines with different
   * random values. The API refuses to start without them.
   */
  private withSecrets(env: string): string {
    for (const key of ['JWT_SECRET', 'RESET_PASSWORD_SECRET']) {
      env = env.replace(
        new RegExp(`^${key}=[ \\t]*$`, 'm'),
        `${key}=${randomBytes(32).toString('base64url')}`,
      );
    }
    return env;
  }

  /**
   * True only when .git still points at the boilerplate repository, so a
   * project created from the GitHub template (or an existing project) keeps
   * its own history.
   */
  private isBoilerplateClone(root: string): boolean {
    if (!existsSync(join(root, '.git'))) return false;
    try {
      const url = execFileSync('git', ['remote', 'get-url', 'origin'], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      return BOILERPLATE_REMOTE.test(url);
    } catch {
      return false;
    }
  }
}
