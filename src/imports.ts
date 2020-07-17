import config from '@config/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@app/user';
import { DbConfigService, DbModule } from '@app/_db';
import { CoreModule } from '@app/core';

export default [
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
    load: config,
  }),

  TypeOrmModule.forRootAsync({
    useClass: DbConfigService,
  }),

  CoreModule,

  UserModule,

  DbModule,
];
