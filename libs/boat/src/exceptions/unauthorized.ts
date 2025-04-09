import { HttpException, HttpStatus } from '@nestjs/common';

export class Unauthorized extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Unauthorized exception occurred',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
