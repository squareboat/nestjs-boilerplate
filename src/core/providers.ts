import { ListCommands } from './console';
import { EventExplorer } from './events';
import { BaseValidator, ExistsConstraint } from './validator';
import { IsUniqueConstraint } from './validator/decorators/isUnique';
import { IsValueFromConfigConstraint } from './validator/decorators/isValueFromConfig';

const providers = [
  EventExplorer,
  ListCommands,
  BaseValidator,
  IsUniqueConstraint,
  ExistsConstraint,
  IsValueFromConfigConstraint,
];

const getProviders = function(): any {
  return providers;
};

export { getProviders };
