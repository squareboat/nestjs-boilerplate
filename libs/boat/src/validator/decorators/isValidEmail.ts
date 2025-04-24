import { COMMON_REGEX, falseEmails } from '../../utils';
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
class IsValidEmailConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!isEmail(value)) return false;
    if (value.includes('+')) return false;
    const arr = value.split('@');
    const domain = arr[1];
    if (falseEmails.includes(domain)) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid email`;
  }
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEmailConstraint,
    });
  };
}

function isEmail(email: string) {
  const emailRegex = COMMON_REGEX.EMAIL;
  return !!emailRegex.test(email);
}
