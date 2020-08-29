import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { HttpModule } from './http';
import { useContainer } from 'class-validator';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { RequestGaurd, ExceptionFilter, TimeoutInterceptor } from '@app/core';
import { ConfigService } from '@nestjs/config';
import { CanBeAuthenticated, UserModule, UserService } from '@app/user';

async function bootstrap() {
  const app = await NestFactory.create(HttpModule);

  useContainer(app.select(HttpModule), { fallbackOnErrors: true });

  // middlewares, express specific
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.use(rateLimit({ windowMs: 60, max: 50 }));

  // guards
  app.useGlobalGuards(new RequestGaurd(),);

  // filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  // interceptors
  app.useGlobalInterceptors(new TimeoutInterceptor());

  const config = app.get(ConfigService);
  await app.listen(config.get('app.port'));
}

bootstrap();
