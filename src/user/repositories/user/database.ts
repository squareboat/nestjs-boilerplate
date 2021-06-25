import { UserModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { UserRepositoryContract } from './contract';
import { User$Model } from '@app/_common';

@Injectable()
export class UserRepository
  extends DB<User$Model>
  implements UserRepositoryContract
{
  @InjectModel(UserModel)
  model: UserModel;
}
