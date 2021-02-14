import { Injectable } from '@nestjs/common';
import { Command, _cli } from '@squareboat/nest-console';

@Injectable()
@Command('user:greet', { desc: 'Command to create a user' })
export class GreetUser {
  public async handle(): Promise<void> {
    // ask for input from the client
    const name = await _cli.ask('What is your name?');

    // print success message
    _cli.success(
      `Hello ${name}, enjoy building cool stuff using this boilerplate! 😁`,
    );

    _cli.table([
      { name: 'User 1', designation: 'Software Engineer L1' },
      { name: 'User 2', designation: 'Software Engineer L1' },
    ]);

    // print info message
    _cli.info('User Greeted');
    return;
  }
}
