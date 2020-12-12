import { HttpException } from '@nestjs/common';

export class ModelAlreadyExists extends HttpException {
  constructor(model: string) {
    super(model + ' already exists', 403);
  }
}
