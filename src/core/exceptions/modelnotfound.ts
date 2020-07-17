import { NotFoundException } from '@nestjs/common';

export class ModelNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
