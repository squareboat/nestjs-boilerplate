import { UserModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface RecruiterRepositoryContract extends RepositoryContract<UserModel> {}
