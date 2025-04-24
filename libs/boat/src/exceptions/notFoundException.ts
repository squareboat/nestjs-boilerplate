import { HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    message = message ? message : 'Record Not found!';
    super(message, 404);
  }
}
