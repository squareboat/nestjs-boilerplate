import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { BaseValidator } from './basevalidator';
import { CustomValidationPipe } from './customValidation';
import { ValidationOptions } from 'class-validator';

export * from 'class-validator';
export * from './decorators';

export { BaseValidator };

export interface CustomValidationOptions extends ValidationOptions {
  schemaGroup?: string;
}

export function Validate(Dto: any, options: CustomValidationOptions = {}) {
  return applyDecorators(
    SetMetadata('dtoSchema', Dto),
    SetMetadata('dtoOptions', options),
    UseGuards(CustomValidationPipe),
  );
}

export const Dto = createParamDecorator(
  (data: Record<string, any>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request._dto;
  },
);
