import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseValidator } from './basevalidator';
import { CustomValidationOptions } from './index';

@Injectable()
export class CustomValidationPipe implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const schema = this.reflector.get('dtoSchema', context.getHandler());
    const options = {
      ...this.reflector.get<CustomValidationOptions>(
        'dtoOptions',
        context.getHandler(),
      ),
    };

    if (options.schemaGroup) {
      options['groups'] = [req.all()[options.schemaGroup]];
      delete options.schemaGroup;
    }
    const validator = new BaseValidator();
    validator.setContext(req);

    req._dto = await validator.fire(
      {
        ...req.all(),
      },
      schema,
      options,
    );

    return true;
  }
}
