import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  private errors: Record<string, any>;
  constructor(errors: Record<string, any>) {
    super(errors.msg || 'forbidden exception occurred', HttpStatus.FORBIDDEN);

    this.errors = errors;
  }

  getErrors(): Record<string, any> {
    return this.errors;
  }
}
