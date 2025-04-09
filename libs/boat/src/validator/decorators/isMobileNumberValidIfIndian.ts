import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMobileNumberValidIfIndianConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args?: ValidationArguments): boolean {
    if (!value) return false;
    const prefix = value.includes('+91-')
      ? '+91-'
      : value.includes('+91')
      ? '+91'
      : null;
    if (!prefix) return true;

    const startsWith = value.split(prefix)[1][0];
    if ('012345'.includes(startsWith)) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Mobile Number must be a valid phone number';
  }
}

export function IsMobileNumberValidIfIndian(
  options?: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsMobileNumberValidIfIndianConstraint,
    });
  };
}
