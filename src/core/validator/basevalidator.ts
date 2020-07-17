import { startCase, isEmpty } from 'lodash';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ValidationFailed } from '../exceptions';

@Injectable()
export class BaseValidator {
  async fire(inputs, schemaMeta): Promise<Record<string, any>> {
    const schema = plainToClass(schemaMeta, inputs);
    const errors = await validate(schema);

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

        bag = {
          ...bag,
          ...childErrorBag,
        };
      }

      throw new ValidationFailed(bag);
    }

    return inputs;
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
}
