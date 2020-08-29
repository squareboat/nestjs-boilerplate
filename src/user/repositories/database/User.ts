import { User } from '../../models';
import { Injectable } from '@nestjs/common';
import {
  DatabaseRepository as DB,
  InjectModel,
} from '@app/core';
import { UserRepositoryContract } from '../contracts';

@Injectable()
export class UserRepository extends DB implements UserRepositoryContract {
  @InjectModel(User)
  model: User;
}
