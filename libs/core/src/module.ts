import { Module, Global } from '@nestjs/common';
import {
  BaseValidator,
  ExistsConstraint,
  IsUniqueConstraint,
  IsValueFromConfigConstraint,
} from './validator';
import Knex from 'knex';
import * as KnexConfig from '../../../knexfile';
import { KNEX_CONNECTION } from './constants';
import { BaseModel } from './db';
import { DiscoveryModule } from '@nestjs/core';
import { DbOperationsCommand, InitApplicationSetup } from './console';
import { ConfigModule } from '@nestjs/config';
import config from '@config/index';

BaseModel.knex(Knex(KnexConfig));

@Global()
@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
  ],
  providers: [
    DbOperationsCommand,
    InitApplicationSetup,
    BaseValidator,
    // HttpExplorer,
    IsUniqueConstraint,
    ExistsConstraint,
    IsValueFromConfigConstraint,
    { provide: KNEX_CONNECTION, useFactory: async () => Knex(KnexConfig) },
  ],
  exports: [BaseValidator],
})
export class CoreModule {}
