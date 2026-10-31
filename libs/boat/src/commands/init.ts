import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
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

// the boilerplate's own repository on GitHub (https or ssh), nothing else
const BOILERPLATE_REMOTE =
  /^(https?:\/\/(www\.)?github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)squareboat\/nestjs-boilerplate(\.git)?\/?$/i;

// yargs-parser gives `true` for `--yes`, but the string "false" for
// `--yes=false` or `--yes false`
const isTrue = (value: unknown) => value === true || value === 'true';

@Injectable()
@Command('init {--yes} {--keep-git}', {
  desc: 'Set up a new project: removes the boilerplate files, creates .env with new secrets and a fresh git repository',
})
export class InitApplicationSetup {
  async handle(_cli: ConsoleIO): Promise<void> {
    // the cli changes into its own directory, so this is the project root
    const root = process.cwd();

    const notFresh = this.notAFreshBoilerplate(root);
    if (notFresh) {
      _cli.error(` ${notFresh} `);
      _cli.info(
        'init only runs once, in an untouched copy of nestjs-boilerplate. Nothing changed.',
      );
      process.exitCode = 1;
      return;
    }
    const files = BOILERPLATE_FILES;
    const resetGit =
      !isTrue(_cli.option('keep-git')) && this.isBoilerplateClone(root);

    if (resetGit) {
      const unsaved = this.unsavedGitWork(root);
      if (unsaved.length) {
        _cli.error(
          ' The git history would be replaced, but it has work that is not saved anywhere else: ',
        );
        for (const reason of unsaved) _cli.info(`   - ${reason}`);
        _cli.info(
          'Push or discard it first, or run `node cli init --keep-git` to keep .git as it is.',
        );
        process.exitCode = 1;
        return;
      }
    }

    _cli.info(`🚀 Setting up the project in ${root}`);
    if (files.length) _cli.info(`   remove: ${files.join(', ')}`);
    if (resetGit)
      _cli.info('   replace the boilerplate git history with a new repository');

    if (!isTrue(_cli.option('yes'))) {
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
   * Why `root` is not an untouched copy of the boilerplate, or null if it
   * is: package.json is still named nestjs-boilerplate and every file
   * init removes is still there. Keeps init away from apps that were made
   * from the template (where the command still exists) and from any other
   * project.
   */
  private notAFreshBoilerplate(root: string): string | null {
    let name: string | undefined;
    try {
      name = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name;
    } catch {
      return `No readable package.json in ${root}.`;
    }
    if (name !== 'nestjs-boilerplate') {
      return `${root} is "${name}", not nestjs-boilerplate.`;
    }
    const missing = BOILERPLATE_FILES.filter((f) => !existsSync(join(root, f)));
    if (missing.length) {
      return `${missing.join(', ')} already removed, so init has run here before.`;
    }
    return null;
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
    const dotGit = join(root, '.git');
    // a directory: a .git file (submodule, worktree) is never removed
    if (!existsSync(dotGit) || !statSync(dotGit).isDirectory()) return false;
    try {
      return BOILERPLATE_REMOTE.test(
        this.git(root, 'remote', 'get-url', 'origin'),
      );
    } catch {
      return false;
    }
  }

  /**
   * What would be lost by deleting .git: changes, commits that are on no
   * remote, stashes. Empty when everything is on the remote.
   */
  private unsavedGitWork(root: string): string[] {
    try {
      const unsaved: string[] = [];
      if (this.git(root, 'status', '--porcelain')) {
        unsaved.push('uncommitted or untracked changes (`git status`)');
      }
      if (
        this.git(root, 'log', '--branches', '--not', '--remotes', '--oneline')
      ) {
        unsaved.push(
          'commits that are on no remote (`git log --branches --not --remotes`)',
        );
      }
      if (this.git(root, 'stash', 'list')) {
        unsaved.push('stashed changes (`git stash list`)');
      }
      return unsaved;
    } catch {
      return ['the repository could not be checked with git'];
    }
  }

  private git(root: string, ...args: string[]): string {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  }
}
