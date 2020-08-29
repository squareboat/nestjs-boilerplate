import { Injectable, Inject, HttpService } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { USER_REPOSITORY } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private users: UserRepositoryContract,
    private http: HttpService,
  ) { }

  async get(): Promise<Record<string, any>> {
    return this.users.firstWhere({});
  }

  getByToken(bearer: any): any {
    throw new Error("Method not implemented.");
  }
}
