import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationFailed, InvalidCredentials, GenericException } from '.';
import { Unauthorized } from './unauthorized';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<any> {
    return [
      NotFoundException,
      ValidationFailed,
      InvalidCredentials,
      GenericException,
      Unauthorized,
      UnauthorizedException,
    ];
  }

  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    this.report(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    if (exception instanceof ValidationFailed) {
      return response.error(
        {
          message: exception.message,
          errors: exception.getErrors(),
        },
        exception.getStatus(),
      );
    }

    let message =
      exception.message || 'Something went wrong. Please try again later';

    const status = exception.status ? exception.status : 500;
    message = exception.status ? message : 'Internal Server Error';

    return response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }

  /**
   * Logs server errors. Client errors (4xx) and the doNotReport() types
   * are not logged.
   */
  report(exception: any): void {
    if (this.doNotReport().some((type) => exception instanceof type)) return;

    if (exception instanceof HttpException) {
      if (exception.getStatus() >= 500) {
        this.logger.error(`${exception.name}: ${exception.message}`);
      }
      return;
    }

    // knex/objection errors put the SQL and its bindings (a password
    // hash, for example) into message and stack: log the driver's own
    // message and the stack frames only
    const dbError = exception?.nativeError ?? exception;
    if (dbError?.sqlMessage || dbError?.sql || exception?.nativeError) {
      const frames = String(exception?.stack ?? '')
        .split('\n')
        .filter((line) => /^\s+at /.test(line))
        .join('\n');
      this.logger.error(
        `${exception?.name ?? 'DBError'}: ${dbError?.code ?? ''} ${dbError?.sqlMessage ?? ''}`.trim(),
        frames,
      );
      return;
    }

    this.logger.error(
      `${exception?.name ?? 'Error'}: ${exception?.message ?? exception}`,
      exception?.stack,
    );
  }
}
