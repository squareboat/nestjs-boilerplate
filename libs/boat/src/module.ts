import { Global, Module } from '@nestjs/common';
import config from '@config/index';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { BaseValidator } from './validator';
import { MakeMonorepo, GenApp, GenLib, Init, GenWorker } from './commands';

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
  providers: [BaseValidator, MakeMonorepo, GenApp, GenLib, Init, GenWorker],
  exports: [],
})
export class BoatModule {}
