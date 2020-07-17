import { User } from '../../models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseRepository as DB } from '@app/core';
import { UserRepositoryContract } from '../contracts';

export class UserRepository extends DB implements UserRepositoryContract {
  @InjectRepository(User)
  entity: Repository<User>;
}
