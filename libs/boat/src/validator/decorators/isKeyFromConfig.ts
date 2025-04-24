import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty, isArray, isObject } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsKeyFromConfigConstraint implements ValidatorConstraintInterface {
  constructor(private config: ConfigService) {}

  validate(value: string, args: ValidationArguments): boolean {
    const [options] = args.constraints;
    const validValues = this.getKeys(options.key);

    if (isEmpty(validValues) || !isArray(validValues)) {
      return false;
    }

    if (validValues.includes(value)) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    const validKeys = this.getKeys(options.key);
    return `${args.property} should have either of ${validKeys.join(
      ', ',
    )} as value`;
  }

  private getKeys(key: string): any {
    let validKeys: Array<string> = this.config.get(key);
    if (isObject(validKeys)) {
      validKeys = Object.keys(validKeys);
    }

    return validKeys;
  }
}

export function IsKeyFromConfig(
  options: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsKeyFromConfigConstraint,
    });
  };
}
