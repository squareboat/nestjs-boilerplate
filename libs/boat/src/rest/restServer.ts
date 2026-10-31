import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ServerOptions } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { RequestGuard } from './guards';
import { ExceptionFilter, ValidationFailed } from '../exceptions';
import { BaseValidator } from '../validator/basevalidator';
import * as os from 'node:os';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import Cluster from 'node:cluster';
import helmet from 'helmet';
import type { NestExpressApplication } from '@nestjs/platform-express';
export class RestServer {
  private module: any;
  private options: ServerOptions;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(module: any, options?: ServerOptions): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(module);
    const config = app.get(ConfigService, { strict: false });

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    // security headers; also drops X-Powered-By
    app.use(helmet());

    const trustProxy = config.get<string>('app.trustProxy');
    if (trustProxy)
      app.set('trust proxy', RestServer.parseTrustProxy(trustProxy));

    // only the origins from CORS_ORIGINS, none by default
    const origins = config.get<string[]>('app.corsOrigins') ?? [];
    if (origins.length) {
      app.enableCors({ origin: origins.includes('*') ? '*' : origins });
    }

    app.useGlobalGuards(new RequestGuard());

    // Validate DTO bodies/queries/params. Unknown properties are dropped,
    // and failures use the same 422 response as BaseValidator.fire().
    const validator = new BaseValidator();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) =>
          new ValidationFailed(validator.errorBag(errors)),
      }),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    if (options?.isCluster) {
      await RestServer.makeWithCluster(app, options);
    } else {
      await app.listen(options.port || config.get<number>('app.port'));
    }
  }

  /** "true"/"false", a hop count ("1") or Express' own values ("loopback", IPs) */
  static parseTrustProxy(value: string): boolean | number | string {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return /^\d+$/.test(value) ? +value : value;
  }

  static async makeWithCluster(
    app: INestApplication<any>,
    options?: ServerOptions,
  ): Promise<void> {
    const numCPUs = options.numCPUs || os.cpus().length;
    const config = app.get(ConfigService, { strict: false });
    const port = options.port || config.get<number>('app.port');

    if (Cluster.isPrimary) {
      Logger.log(
        `⚙️ Master is running on Port: ${port}, PID:${process.pid}, CPU: ${numCPUs}`,
      );

      for (let i = 0; i < numCPUs; i++) {
        Cluster.fork();
      }

      Cluster.on('exit', (worker, code, signal) => {
        Logger.error(
          `⛓️‍💥 Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`,
        );
      });
    } else {
      Logger.log(`🛠️ Worker ${process.pid} started`);
      await app.listen(port);
    }
  }
}
