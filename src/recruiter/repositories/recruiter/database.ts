
import { Injectable } from '@nestjs/common';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { RecruiterRepositoryContract } from './contract';
import { RecruiterModel } from '@app/recruiter/models';

@Injectable()
export class UserRepository
  extends DatabaseRepository<RecruiterModel>
  implements RecruiterRepositoryContract
{
  @InjectModel(RecruiterModel)
  model: RecruiterModel;
}
