import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public async validate(
    value: string,
    args: ValidationArguments,
  ): Promise<boolean> {
    const [options] = args.constraints;
    const params = {};
    params[options.column] = value;

    if (options.caseInsensitive) {
      params[options.column] =
        typeof value === 'string' ? value.toLowerCase() : value;
    }

    // return this.connection
    //   .collection(options.collection)
    //   .findOne(params)
    //   .then(count => {
    //     return !!!count;
    //   });

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    return `${options.column} already exists.`;
  }
}

export function IsUnique(
  options: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
