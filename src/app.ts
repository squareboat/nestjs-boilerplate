import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from '@squareboat/nest-events';
import { UserModule } from './user';
import { DbModule } from './_db';
import config from '@config/index';
import { CoreModule } from '@libs/core';

@Module({
  imports: [
    DbModule,
    CoreModule,
    UserModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
