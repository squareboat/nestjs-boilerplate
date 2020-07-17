import { Injectable, Inject, HttpService } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { USER_REPOSITORY } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private users: UserRepositoryContract,
    private http: HttpService,
  ) {}

  async getProfile(inputs: Record<string, any>): Promise<Record<string, any>> {
    return { id: 1, name: 'NestJS Boilerplate' };
  }

  async getByToken(token: string): Promise<Record<string, any>> {
    return { id: 1, name: 'NestJS Boilerplate' };
  }
}
