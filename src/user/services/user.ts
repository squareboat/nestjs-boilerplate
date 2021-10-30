import { USER_REPOSITORY } from '../constants';
import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { ListensTo } from '@squareboat/nest-events';
import { UserSignedUp } from '../events/userSignedUp';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private users: UserRepositoryContract) {}

  async get(): Promise<Record<string, any>> {
    return this.users.firstWhere({});
  }

  @ListensTo('USER_SIGNED_UP')
  userSignedUp(event: UserSignedUp): void {
    console.log('EVENT RECEIVED ===>', event);
    // add your logic here
    return;
  }
}
