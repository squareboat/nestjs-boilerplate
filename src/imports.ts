import config from '@config/index';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@app/user';
import { CoreModule } from '@app/core';
import { DbModule } from '@app/_db';

export default [
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
    load: config,
  }),
  CoreModule,
  UserModule,
  DbModule,
];
