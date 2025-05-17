import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { ListensTo } from '@squareboat/nest-events';
import { UserModuleConstants } from '../constants';

export type User = {
  id: number;
  username: string;
  password: string;
}
@Injectable()
export class UserService {
  constructor(
    @Inject(UserModuleConstants.userRepo) private users: UserRepositoryContract,
  ) { }

  async get(): Promise<Record<string, any>> {
    return this.users.firstWhere({});
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.firstWhere({ username: username });
  }

}
