import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { basePath } from '@app/core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = this.config.get('db');

    // create ormconfig.json file at root
    fs.writeFileSync(
      path.join(basePath(), 'ormconfig.json'),
      JSON.stringify(config, null, 2),
    );

    return config;
  }
}
