import 'reflect-metadata';
import { CommandMeta } from './CommandMeta';
import { COMMAND_NAME, COMMAND_OPTIONS } from './constants';

/**
 * Command decorator function to add a new command to CommandMeta class
 * @param command string
 * @param options Record<string, any>
 */
export function Command(command: string, options?: CommandOptions) {
  options = options || ({} as CommandOptions);
  return function(target: Function) {
    Reflect.defineMetadata(COMMAND_NAME, command, target);
    Reflect.defineMetadata(COMMAND_OPTIONS, options, target);
    CommandMeta.setCommand(command, target, options);
  };
}

export interface CommandOptions {
  desc: string;
}
