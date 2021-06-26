import { KNEX_CONNECTION } from '@libs/core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Command, _cli } from '@squareboat/nest-console';
import Knex = require('knex');
import * as chalk from 'chalk';
import { basePath } from '../helpers';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbOperationsCommand {
  private migratorConfig = {
    directory: './dist/src/_db/migrations',
    loadExtensions: ['.js'],
  };

  constructor(
    @Inject(KNEX_CONNECTION) private knex: Knex,
    private config: ConfigService,
  ) {}

  @Command('migrate:status', {
    desc: 'Command to show the status of all migrations',
  })
  async migrateStatus() {
    let [completed, pending]: Record<string, any>[][] =
      await this.knex.migrate.list(this.migratorConfig);
    const statusList = [];

    for (const migration of completed) {
      statusList.push({ migration: migration.file, status: chalk.green('Y') });
    }

    for (const migration of pending) {
      statusList.push({ migration: migration.file, status: chalk.red('N') });
    }

    _cli.table(statusList);
  }

  @Command('migrate', { desc: 'Command to run the pending migrations' })
  async migrationUp() {
    const [batch, migrations]: [number, string[]] = await this.knex.migrate.up(
      this.migratorConfig,
    );

    if (migrations.length === 0) {
      _cli.info('No migrations to run');
      return;
    }

    _cli.info(`Batch Number: ${batch}`);
    for (const migration of migrations) {
      _cli.success(migration);
    }
  }

  @Command('migrate:rollback', {
    desc: 'Command to rollback the previous batch of migrations',
  })
  async migrateRollback() {
    const [batch, migrations]: [number, string[]] =
      await this.knex.migrate.down(this.migratorConfig);

    if (migrations.length === 0) {
      _cli.info('No migrations to rollback. Already at the base migration');
      return;
    }

    _cli.info(`Reverted Batch: ${batch}`);
    for (const migration of migrations) {
      _cli.success(migration);
    }
  }

  @Command('migrate:reset', {
    desc: 'Command to reset the migration',
  })
  async migrateReset() {
    const confirm = await _cli.confirm(
      'Are you sure you want to reset your database? This action is irreversible.',
    );

    if (!confirm) {
      _cli.info('Thank you! Exiting...');
      return;
    }

    const password = await _cli.password(
      'Please enter the password of the database to proceed',
    );

    if (password !== this.config.get('db.password')) {
      _cli.error(' Wrong Password. Exiting... ');
      return;
    }

    const [batch, migrations]: [number, string[]] =
      await this.knex.migrate.rollback(this.migratorConfig, true);

    if (migrations.length === 0) {
      _cli.info('No migrations to rollback. Already at the base migration');
      return;
    }

    _cli.info('Rollback of following migrations are done:');
    for (const migration of migrations) {
      _cli.success(migration);
    }
  }

  @Command('make:migration', {
    desc: 'Command to create a new migration',
    args: { name: { req: true } },
  })
  async makeMigration(args: Record<string, any>) {
    const res = await this.knex.migrate.make(args['name'], {
      directory: './src/_db/migrations',
      extension: 'ts',
    });

    const paths = res.split('/');
    _cli.success(paths[paths.length - 1]);
  }
}
