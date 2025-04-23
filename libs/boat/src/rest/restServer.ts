import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ServerOptions } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { RequestGuard } from './guards';
import { ExceptionFilter } from '../exceptions';
import * as os from 'node:os';
import { INestApplication, Logger } from '@nestjs/common';
const Cluster = require('node:cluster');
export class RestServer {
  private module: any;
  private options: ServerOptions;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(module: any, options?: ServerOptions): Promise<void> {
    const app = await NestFactory.create(module);

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    app.enableCors({ origin: true });

    app.useGlobalGuards(new RequestGuard());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    const config = app.get(ConfigService, { strict: false });

    if (options?.isCluster) {
      await RestServer.makeWithCluster(app, options);
    } else {
      await app.listen(options.port || config.get<number>('app.port'));
    }
  }

  static async makeWithCluster(
    app: INestApplication<any>,
    options?: ServerOptions,
  ): Promise<void> {
    const numCPUs = options.numCPUs || os.cpus().length;
    const config = app.get(ConfigService, { strict: false });
    const port = options.port || config.get<number>('app.port');

    if (Cluster.isMaster) {
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
