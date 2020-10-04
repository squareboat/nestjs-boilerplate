import { CommandOptions } from './Decorators';

export class CommandMeta {
  private static commands: Record<string, any> = {};

  /**
   * Add a new command to the command meta
   * @param command string
   * @param target Function
   * @param options Options
   *
   * @returns void
   */
  static setCommand(
    command: string,
    target: Function,
    options?: CommandOptions,
  ): void {
    CommandMeta.commands[command] = { target, options };
    return;
  }

  /**
   * Get all commands along with their stored payload
   *
   * @returns Record<string, any>
   */
  static getAllCommands(): Record<string, any> {
    return CommandMeta.commands;
  }

  /**
   * Get target for the specified command
   * @param command string
   *
   * @returns Function|null
   */
  static getTarget(command: string): Function | null {
    const obj = CommandMeta.commands[command];
    return obj ? obj.target : null;
  }
}
