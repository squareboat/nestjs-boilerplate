import { Inquirer } from './Inquirer';
import { Logger } from './Logger';

export abstract class BaseCommand {
  public receivedOptions: Record<string, any> = {};

  /**
   * Starts the work of validating and running the command
   * @returns void
   */
  public async work(): Promise<void> {
    if (!this.validate()) {
      return;
    }

    await this.handle();
    return;
  }

  /**
   * Validates the options passed vs the options defined in options method
   * @returns boolean
   */
  private validate(): boolean {
    const requiredOptions = this.getRequiredOptions();
    const noInputFound = [];
    for (const option of requiredOptions) {
      if (!this.value(option)) noInputFound.push(option);
    }
    if (noInputFound.length) {
      this.error(`'Missing arguments: ${noInputFound.join(', ')}`);
      return false;
    }

    return true;
  }

  /**
   * Gets all the options running a particular options
   * @returns string[]
   */
  getRequiredOptions(): string[] {
    const options = this.options();
    const req = [];
    for (const key in options) {
      if (options[key].req) req.push(key);
    }

    return req;
  }

  /**
   * Command to set the received options in a context
   * @param options
   * @return self
   */
  public setReceivedOptions(options: Record<string, any>): this {
    this.receivedOptions = options || {};
    return this;
  }

  /**
   * Use this method to get the value for the options
   * @param option
   * @returns T
   */
  public value<T>(option: string): T {
    const definedOptions = this.options();
    if (!definedOptions[option]) {
      return undefined;
    }
    return this.receivedOptions[option];
  }

  /**
   * Use this method to print an information line
   * @param msg
   * @returns void
   */
  public info(msg: string, color?: string): void {
    Logger.info(msg, color);
  }

  /**
   * Use this method to print an error message
   * @param msg
   * @returns void
   */
  public error(msg: string): void {
    Logger.error(msg);
  }

  /**
   * Use this method to print a success message
   * @param msg
   * @returns void
   */
  public success(msg: string): void {
    Logger.success(msg);
  }

  /**
   * Use this method to print a line.
   * Prints line half the width of the console
   * @returns void
   */
  public line(): void {
    Logger.line();
  }

  /**
   * Use this function to print table in console
   * @param rows
   * @param options
   * @returns void
   */
  public table(rows: Record<string, any>[]): void {
    Logger.table(rows);
  }

  /**
   * Use this method to ask the client about any input.
   * @param question
   * @returns Promise<string>
   */
  public async ask(question: string): Promise<string> {
    return await Inquirer.ask(question);
  }

  /**
   * Use this method to let the client select option from given choices
   * @param question
   * @param choices
   * @returns Promise<string>
   */
  public async select(
    question: string,
    choices: string[],
    multiple = false,
  ): Promise<string | string[]> {
    return await Inquirer.select(question, choices, multiple);
  }

  /**
   * Use this method to ask for confirmation from the client
   * @param question
   */
  public async confirm(question: string): Promise<boolean> {
    return Inquirer.confirm(question);
  }

  /**
   * Use this method to ask for a password/hidden input from the client
   * @param question
   * @param mask
   */
  public async password(question: string, mask = ''): Promise<string> {
    return Inquirer.password(question, mask);
  }

  /**
   * Command's main logic goes inside this function
   * @returns Promise<void>
   */
  public abstract handle(): Promise<void>;

  /**
   * Define options in this method
   * @retusn Object
   */
  public abstract options(): Record<string, OptionInterface>;
}

export interface OptionInterface {
  desc?: string;
  alias?: string;
  req?: boolean;
}
