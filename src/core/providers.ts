import { ListCommands, InitApplicationSetup } from './console';
import { EventExplorer } from './events';
import { BaseValidator, ExistsConstraint } from './validator';
import { IsUniqueConstraint } from './validator/decorators/isUnique';
import { IsValueFromConfigConstraint } from './validator/decorators/isValueFromConfig';

const providers = [
  // commands
  ListCommands,
  InitApplicationSetup,

  // event explore
  EventExplorer,

  // custom base validator
  BaseValidator,

  // custom validator decorators
  IsUniqueConstraint,
  ExistsConstraint,
  IsValueFromConfigConstraint,
];

const getProviders = function (): any {
  return providers;
};

export { getProviders };
