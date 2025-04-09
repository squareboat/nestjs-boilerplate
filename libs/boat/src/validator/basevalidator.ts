import { startCase, isEmpty } from 'lodash';
import { validate, ValidationOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Injectable, Type } from '@nestjs/common';
import { ValidationFailed } from '../exceptions';
import { Context } from '../utils';
import { Request } from '../rest';

@Injectable()
export class BaseValidator {
  private context: Context;

  constructor() {
    this.context = new Context();
  }

  setContext(req: Request) {
    this.context.setRequest(req.getContext());
    return this;
  }

  async fire<T>(
    inputs: Record<string, any>,
    schemaMeta: Type<T>,
    params: ValidationOptions = {},
    throwErr: boolean = true,
  ): Promise<T> {
    const schema: T = plainToClass(schemaMeta, inputs);
    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true,
      ...params,
    });

    /**
     * Process errors, if any.
     * Throws new ValidationFailed Exception with validation errors
     */
    let bag = {};
    if (errors.length > 0) {
      for (const error of errors) {
        const errorsFromParser = this.parseError(error);
        const childErrorBag = {};
        for (const key in errorsFromParser) {
          if (!isEmpty(errorsFromParser[key])) {
            childErrorBag[key] = errorsFromParser[key];
          }
        }

        bag = { ...bag, ...childErrorBag };
      }
      throw new ValidationFailed(bag);
    }

    return schema;
  }

  parseError(error) {
    const children = [];
    for (const child of error.children || []) {
      children.push(this.parseError(child));
    }

    const messages = [];
    for (const c in error.constraints) {
      let message = error.constraints[c];
      message = message.replace(error.property, startCase(error.property));
      messages.push(message);
    }

    const errors = {};
    if (!isEmpty(messages)) {
      errors[error.property] = messages;
    }

    for (const child of children) {
      for (const key in child) {
        errors[`${error.property}.${key}`] = child[key];
      }
    }

    return errors;
  }

  async parseValidated<T>(
    inputs: Record<string, any>,
    schemaMeta: Type<T>,
    throwErr: boolean = true,
  ) {
    try {
      const res = await this.fire(inputs, schemaMeta, {}, throwErr);
      return { schema: res };
    } catch (err) {
      return { error: err.errors };
    }
  }
}
