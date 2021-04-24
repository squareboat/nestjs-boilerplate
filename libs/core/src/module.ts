import { Module, Global } from '@nestjs/common';
import { BaseValidator } from './validator';
import { getProviders } from './providers';
import * as Knex from 'knex';
import * as KnexConfig from '../../../knexfile';
import { KNEX_CONNECTION } from './constants';
import { BaseModel } from './db';
import { DiscoveryModule } from '@nestjs/core';

BaseModel.knex(Knex(KnexConfig));

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    ...getProviders(),
    { provide: KNEX_CONNECTION, useFactory: async () => Knex(KnexConfig) },
  ],
  exports: [BaseValidator],
})
export class CoreModule {}
