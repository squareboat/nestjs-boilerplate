import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';

@Injectable()
@Command('user:greet {name}', { desc: 'Command to greet a user' })
export class GreetUser {
  public async handle(_cli: ConsoleIO): Promise<void> {
    const name = _cli.argument<string>('name');

    // print success message
    _cli.success(
      `Hello ${name}, enjoy building cool stuff with this boilerplate! 😁`,
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
