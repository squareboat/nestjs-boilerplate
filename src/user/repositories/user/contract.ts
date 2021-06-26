import { User$Model } from '@app/_common';
import { RepositoryContract } from '@libs/core';

export interface UserRepositoryContract
  extends RepositoryContract<User$Model> {}
