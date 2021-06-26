import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from '../../constants';
import * as Knex from 'knex';
import { isEmpty } from 'lodash';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(KNEX_CONNECTION) private connection: Knex) {}

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

    const query = this.connection(table);
    Array.isArray(value)
      ? query.whereIn(column, value)
      : query.where(column, value);

    if (where) query.where(where);

    const result = await query.count({ count: '*' });
    const record = result[0] || {};
    const count = +record['count'];
    return Array.isArray(value) ? value.length === count : !!count;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    return `${options.column} does not exist.`;
  }
}

export function Exists(
  options: {
    table: string;
    column?: string;
    caseInsensitive?: boolean;
    where?: Record<string, any>;
  },
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistsConstraint,
    });
  };
}
