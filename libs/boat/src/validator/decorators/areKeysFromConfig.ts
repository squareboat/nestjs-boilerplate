import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isArray, isEmpty, isObject } from 'lodash';

@Injectable()
@ValidatorConstraint({ async: false })
export class AreKeysFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private config: ConfigService) {}

  validate(value: string, args: ValidationArguments): boolean {
    const [options] = args.constraints;
    const validValues = this.getKeys(options.key);

    if (isEmpty(validValues) || !isArray(validValues)) {
      return false;
    }

    const valueArr = value?.split(',');
    if (!valueArr || valueArr.length === 0) return false;

    for (let v of valueArr) {
      if (!validValues.includes(v)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [options] = args.constraints;
    const validValues = this.getKeys(options.key);
    return `${args.property} should have only ${validValues.join(
      ', ',
    )} as values`;
  }

  private getKeys(key: string): any {
    let validKeys: Array<string> = this.config.get(key);
    if (isObject(validKeys)) {
      validKeys = Object.keys(validKeys);
    }

    return validKeys;
  }
}

export function AreKeysFromConfig(
  options: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: AreKeysFromConfigConstraint,
    });
  };
}
