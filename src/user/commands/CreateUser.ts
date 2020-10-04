import { BaseCommand, Command, OptionInterface } from '@app/core';
import { Injectable } from '@nestjs/common';

@Injectable()
@Command('users:greet', { desc: 'Command to create a user' })
export class CreateUser extends BaseCommand {
  public async handle(): Promise<void> {
    // ask for input from the client
    const name = await this.ask('What is your name?');

    // print success message
    this.success(
      `Hello ${name}, enjoy building cool stuff using this boilerplate! 😁`,
    );

    // print info message
    this.info('User Created');
    return;
  }

  public options(): Record<string, OptionInterface> {
    return {};
  }
}
