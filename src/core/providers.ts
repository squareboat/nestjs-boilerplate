import { BaseValidator, ExistsConstraint } from './validator';
import { IsUniqueConstraint } from './validator/decorators/isUnique';
import { IsValueFromConfigConstraint } from './validator/decorators/isValueFromConfig';

const providers = [
  BaseValidator,
  IsUniqueConstraint,
  ExistsConstraint,
  IsValueFromConfigConstraint,
];

const getProviders = function(): any {
  return providers;
};

export { getProviders };
