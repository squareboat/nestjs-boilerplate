import { Module, Global } from '@nestjs/common';
import { BaseValidator } from './validator';
import { getProviders } from './providers';
import * as Knex from 'knex';
import * as KnexConfig from '../../knexfile';
import { KNEX_CONNECTION } from './constants';
import { BaseModel } from './db';

@Global()
@Module({
  imports: [],
  providers: [...getProviders(), {
    provide: KNEX_CONNECTION,
    useFactory: async () => {
      BaseModel.knex(Knex(KnexConfig));
      BaseModel.setModulePaths([
        // add your module names here
        'user',
      ]);
      return Knex(KnexConfig);
    },
  },],
  exports: [BaseValidator],
})
export class CoreModule { }
