import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  static client: ConfigService;

  constructor(config: ConfigService) {
    AppConfig.client = config;
  }

  static get<T = any>(key: string): T {
    return AppConfig.client.get(key);
  }

  static isLocal() {
    const env = AppConfig.get('app.env');
    return env == 'local' || env == 'dev' || env == 'development';
  }

  static isStaging() {
    const env = AppConfig.get('app.env');
    return env == 'staging' || env == 'testing';
  }

  static isProd() {
    const env = AppConfig.get('app.env');
    return env == 'production' || env == 'prod';
  }
}
