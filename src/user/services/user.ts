import { Injectable, Inject } from '@nestjs/common';
import type { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { UserModel } from '../models';

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

  async findById(id: number): Promise<UserModel | undefined> {
    return this.users.firstWhere({ id });
  }

  async findOne(username: string): Promise<UserModel | undefined> {
    return this.users.firstWhere({ username: username });
  }

  // async create(user: SignupDto): Promise<User> {
  //   return this.users.create(user);
  // }
  

}
