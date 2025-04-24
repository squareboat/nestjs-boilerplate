import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
class IsDateBeforeConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const [date] = args.constraints;
    return new Date(value) < new Date(date);
  }

  defaultMessage(args: ValidationArguments) {
    const [date] = args.constraints;
    return `${args.property} should be less than ${date} `;
  }
}

export function IsDateBefore(
  date: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [date],
      validator: IsDateBeforeConstraint,
    });
  };
}
