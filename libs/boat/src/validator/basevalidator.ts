import { startCase, isEmpty } from 'lodash';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Injectable, Type } from '@nestjs/common';
import { ValidationFailed } from '../exceptions';

@Injectable()
export class BaseValidator {
  async fire<T>(inputs: Record<string, any>, schemaMeta: Type<T>): Promise<T> {
    const schema: T = plainToClass(schemaMeta, inputs);
    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true,
    });

    /**
     * Throws new ValidationFailed Exception with validation errors, if any.
     */
    if (errors.length > 0) {
      throw new ValidationFailed(this.errorBag(errors));
    }

    return schema;
  }

  /**
   * Turns class-validator errors into `{ field: [messages] }`.
   * Also used by the global ValidationPipe (see RestServer).
   */
  errorBag(errors: ValidationError[]): Record<string, string[]> {
    let bag = {};
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

    return bag;
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
