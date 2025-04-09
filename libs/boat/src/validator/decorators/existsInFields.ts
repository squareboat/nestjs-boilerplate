import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Type } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { BaseModel, ObjectionService } from '@squareboat/nestjs-objection';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistsInFieldsConstraint implements ValidatorConstraintInterface {
  public async validate(
    value: any | any[],
    args: ValidationArguments,
  ): Promise<boolean> {
    if (!value && isEmpty(value)) return false;

    const [{ table, columns, caseInsensitive, where, model, modelProp }] =
      args.constraints;

    if (columns?.length === 0) return false;

    if (caseInsensitive) {
      value = Array.isArray(value)
        ? value.map((v) => v.toLowerCase())
        : value.toLowerCase();
    }

    const connection = await ObjectionService.connection();
    const query = connection(table);
    Array.isArray(value)
      ? query.where((builder) => {
          columns?.forEach((c) => builder.whereIn(c, value));
        })
      : query.where((builder) => {
          columns?.forEach((c) => builder.orWhere(c, value));
        });

    if (where) query.where(where);

    const result = await query;

    if (Array.isArray(value) && result.length !== value.length) {
      return false;
    } else if (result.length == 0) {
      return false;
    }

    if (!model) return true;

    const records = result.map((s) => {
      const m = new model();
      return m.$setJson(s);
    });

    const propName = modelProp || args.property;
    if (model) {
      if (Array.isArray(value)) {
        args.object[propName] = records;
      } else {
        args.object[propName] = records[0];
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    return `${options.columns[0]} does not exist.`;
  }
}

export function ExistsInFields(
  options: {
    table: string;
    columns: string[];
    caseInsensitive?: boolean;
    where?: Record<string, any>;
    model?: Type<BaseModel>;
    modelProp?: string;
  },
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistsInFieldsConstraint,
    });
  };
}
