import { Injectable } from '@nestjs/common';
import { __ } from '@squareboat/nestjs-localization';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
class IsValidAddressConstraint implements ValidatorConstraintInterface {
  async validate(
    value: string,
    args: ValidationArguments | Record<string, any>,
  ) {
    const [options] = args.constraints;
    const allowedSpecialChars = [',', '.', '|', '/', '-', "'", ':'];
    let data = '';

    for (const val of value) {
      if (allowedSpecialChars.includes(val)) {
        continue;
      }
      data += val;
    }
    if (value && !data) return false;
    const minLength = options?.['minLength'] || 0;
    const addressRegex = new RegExp('^[a-zA-Z0-9\\s]{' + minLength + ',255}$');
    return !!addressRegex.test(data);
  }

  defaultMessage(args: ValidationArguments) {
    return __('errorMessages.invalidAddress');
  }
}

export function IsValidAddress(
  options?: { minLength: number },
  validationOptions?: ValidationOptions | Record<string, any>,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValidAddressConstraint,
    });
  };
}
