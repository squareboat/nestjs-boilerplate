import { ObjectionService } from '@squareboat/nestjs-objection';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Validator from 'validatorjs';
import { ValidationFailed } from '../exceptions';
import { Helpers, isArrayAndHasLength } from '../helpers';
import _ from 'lodash';
import { parsePhoneNumber } from 'libphonenumber-js/max';
import { lastDayOfYear, isBefore, subDays, format } from 'date-fns';
import { AppConfig } from '../utils';

@Injectable()
export class CustomValidator implements OnModuleInit {
  onModuleInit() {
    this.registerCustomRules();
  }

  registerCustomRules() {
    Validator.registerAsync(
      'exists',
      async function (value, requirement, attribute, passes) {
        const [table, column] = requirement.split(',');
        const connection = await ObjectionService.connection();
        const query = connection(table);
        Array.isArray(value)
          ? query.whereIn(column, value)
          : query.where(column, value);
        const result = await query;
        if (Array.isArray(value) && result.length !== value.length) {
          passes(false, `${column} does not exist.`);
        } else if (result.length == 0) {
          passes(false, `${column} does not exist.`);
        }
        passes();
      },
      'This field value not exist.',
    );

    Validator.registerAsync(
      'existsIf',
      async function (value, requirement, attribute, passes) {
        if (isArrayAndHasLength(value) === 0) {
          passes();
        }
        const [table, column] = requirement.split(',');
        const connection = await ObjectionService.connection();
        const query = connection(table);
        Array.isArray(value)
          ? query.whereIn(column, value)
          : query.where(column, value);
        const result = await query;
        if (Array.isArray(value) && result.length !== value.length) {
          passes(false, `${column} does not exist.`);
        } else if (result.length == 0) {
          passes(false, `${column} does not exist.`);
        }
        passes();
      },
      'This field value not exist.',
    );

    Validator.register(
      'mobile',
      (value: any, requirement, attribute) => {
        try {
          const phoneNumber = parsePhoneNumber(value);
          return phoneNumber.isValid();
        } catch (err) {
          return false;
        }
      },
      'Invalid Phone number format',
    );

    Validator.register(
      'arrayIsIn',
      function (values: any, requirement, attribute) {
        const allowedValues = requirement.split(',');
        if (!Array.isArray(values)) {
          return false;
        }
        for (const value of values) {
          if (!allowedValues.includes(value.toString())) {
            return false;
          }
        }
      },
      `Select correct option`,
    );

    Validator.register(
      'isBoolean',
      function (value: any, requirement, attribute) {
        if (typeof value !== 'boolean') {
          return false;
        }
        return true;
      },
      `This field is required. Accepted values: Yes or No.`,
    );

    Validator.register(
      'integerArray',
      (value, attribute, req) =>
        Array.isArray(value) && value.every((num) => Number.isInteger(num)),
      'This field must be an array of integers.',
    );

    Validator.register(
      'numericArray',
      (value, attribute, req) =>
        Array.isArray(value) &&
        value.every((num) => typeof num === 'number' && !Number.isNaN(num)),
      'This field must be an array of numeric values.',
    );

    Validator.register(
      'numeric',
      (value, attribute, req) =>
        typeof value === 'number' && !Number.isNaN(value),
      'This field must be numeric',
    );

    Validator.register(
      'integer',
      (value, attribute, req) => Number.isInteger(value),
      'This field must be numeric',
    );

    Validator.register(
      'required_if',
      function (value, requirement, attribute) {
        const [field, ...fieldValueArr] = requirement.split(',');
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        const fieldValueFromData = flatObj[field];
        if (!fieldValueArr.includes(fieldValueFromData?.toString())) {
          return true;
        } else {
          if (!value) return false;
        }
        return true;
      },
      'This field is required',
    );

    Validator.register(
      'lengthEqualToProp',
      function (value: any, field, attribute) {
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        const fieldValueFromData = flatObj[field];
        if (value.length != fieldValueFromData) {
          return false;
        }
        return true;
      },
      'This field length is not correct',
    );

    Validator.register(
      'isLessThanProp',
      function (value: any, field, attribute) {
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        if (Array.isArray(value)) {
          for (const i of value) {
            if (i > flatObj[field]) return false;
          }
        } else {
          if (value > flatObj[field]) return false;
        }
        return true;
      },
      'This field value is not correct',
    );

    Validator.register(
      'isLessThanPropIfExist',
      function (value: any, field, attribute) {
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        if (!flatObj[field] && flatObj[field] !== 0) {
          return true;
        }
        if (Array.isArray(value)) {
          for (const i of value) {
            if (i > flatObj[field]) return false;
          }
        } else {
          if (value > flatObj[field]) return false;
        }
        return true;
      },
      'This field value is not correct',
    );

    Validator.registerAsync(
      'isLessThanDate',
      function (value: any, field, attribute, passes) {
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        const targetDate = flatObj[field];
        if (!targetDate) passes();
        if (new Date(value) >= new Date(targetDate)) {
          passes(false, `Date should be less than ${field}`);
        }
        passes();
      },
      'Invalid value',
    );

    Validator.register(
      'isLessThanToday',
      function (value: any, field, attribute) {
        if (new Date() > new Date(value)) {
          return true;
        }
        return false;
      },
      "Date should be equal or less than today's date",
    );

    Validator.registerAsync(
      'isGreaterThanToday',
      async function (value: string, field, attribute, passes): Promise<void> {
        let flatObj = {};
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        const fieldName = attribute.split('.').pop();
        let parseDate: Date | string;

        if (
          AppConfig.get('settings.property')['yearFields'].includes(fieldName)
        ) {
          parseDate = lastDayOfYear(value as string);
        } else {
          parseDate = value;
        }

        if (flatObj['id']) {
          const table = 'properties';
          const column = 'ulid';
          const connection = ObjectionService.connection();
          const query = connection(table);
          const resource = await query
            .where({ [column]: flatObj['id'] })
            .first();
          const dateToCompare = resource?.createdAt || Date.now();

          if (isBefore(parseDate, subDays(dateToCompare, 1))) {
            return passes(
              false,
              `Date should be greater than or equal to ${format(
                dateToCompare,
                'dd MMM yyyy',
              )}`,
            );
          }
        } else {
          if (isBefore(parseDate, subDays(Date.now(), 1 ))) {
            return passes(
              false,
              `Date should be greater than or equal to today's date`,
            );
          }
        }
        return passes();
      },
      "Date should be greater than or equal to today's date",
    );

    Validator.registerAsync(
      'isAreaGreaterThan',
      async function (value: any, requirement, attribute, passes) {
        let flatObj = {};
        const fieldName = attribute.split('.').pop();
        const compareFrom = requirement.split(',') || [];
        Helpers.objectToFlatObject(_.cloneDeep(this.validator.input), flatObj);
        if (!flatObj['id']) {
          passes(false, `property id is missing in parameters`);
        }
        const table = 'properties';
        const column = 'ulid';
        const connection = ObjectionService.connection();
        const query = connection(table);
        const resource = await query.where({ [column]: flatObj['id'] }).first();
        for (const key of compareFrom) {
          if ((resource?.meta?.esObj?.[key] || 0) > value) {
            passes(false, `The ${fieldName} should be greater than ${key}`);
          }
        }
        passes();
      },
      "Date should be greater than or equal to today's date",
    );
  }

  validate(data: any, rules: any): any {
    const validation = new Validator(data, rules);
    validation.passes(() => {});
    return true;
  }

  async validateAsync(data: any, rules: any): Promise<Record<string, any>> {
    const customMsg = {
      required: 'This field is required',
      required_with: 'This field is required',
      in: 'Select correct option',
    };
    const validation = new Validator(data, rules, customMsg);
    //have done this because checkAsync only works with promise link:https://github.com/mikeerickson/validatorjs/issues/418
    const validatorPromise = new Promise((resolve) => {
      validation.checkAsync(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        },
      );
    });
    await validatorPromise;
    const { errors } = validation.errors;
    // Logger().info(
    //   '🚀 ~ file: customValidator.ts:85 ~ CustomValidator ~ validateAsync ~ errors:',
    //   errors,
    // );
    if (Object.keys(errors).length > 0) {
      throw new ValidationFailed(errors);
    }
    return data;
  }
}
