import { UserModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { UserRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class UserRepository
  extends DatabaseRepository<UserModel>
  implements UserRepositoryContract
{
  @InjectModel(UserModel)
  model: UserModel;
}
