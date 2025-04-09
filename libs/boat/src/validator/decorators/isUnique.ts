import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ObjectionService } from '@squareboat/nestjs-objection';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public async validate(
    value: string | string[],
    args: ValidationArguments,
  ): Promise<boolean> {
    if (isEmpty(value)) return false;

    const [{ table, column, caseInsensitive, where }] = args.constraints;

    if (caseInsensitive) {
      value = Array.isArray(value)
        ? value.map((v) => v.toLowerCase())
        : value.toLowerCase();
    }
    const connection = await ObjectionService.connection();

    const query = connection(table);
    Array.isArray(value)
      ? query.whereIn(column, value)
      : query.where(column, value);

    if (where) query.where(where);

    const result = await query.count({ count: '*' });
    const record = result[0] || {};
    const count = +record['count'];
    return Array.isArray(value) ? !!!(value.length === count) : !!!count;
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
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
