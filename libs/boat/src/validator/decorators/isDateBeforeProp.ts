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
class IsDateBeforePropConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const [properties] = args.constraints;
    const dto = args.object as Record<string, any>;

    for (const property of properties) {
      const propertyValue = dto[property];
      if (propertyValue && new Date(value) >= new Date(propertyValue)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [properties] = args.constraints;
    return `${args.property} should be less than ${properties.join(' or ')} `;
  }
}

export function IsDateBeforeProp(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [properties],
      validator: IsDateBeforePropConstraint,
    });
  };
}
