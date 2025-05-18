import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { SignupDto } from '@app/auth/dto/signup';
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

  async get(): Promise<Record<string, any>> {
    return this.users.firstWhere({});
  }

  async findOne(username: string): Promise<UserModel | undefined> {
    return this.users.firstWhere({ username: username });
  }

  // async create(user: SignupDto): Promise<User> {
  //   return this.users.create(user);
  // }
  

}
