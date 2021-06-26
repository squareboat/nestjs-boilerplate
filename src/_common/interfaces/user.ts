import { ObjectionModel } from '@libs/core';

export interface User$Model extends ObjectionModel {
  id?: number;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
