import { RepositoryContract } from './repositories/Contract';
import { DbRepositoryException } from '../exceptions/core';
import { BaseModel } from './BaseModel';

export function InjectModel(model: any) {
  if (!(model.prototype instanceof BaseModel)) {
    throw new DbRepositoryException(
      `Instance of ${BaseModel.name} expected, ${typeof model} passed!`,
    );
  }

  return function(target: RepositoryContract, key: string | symbol) {
    Object.assign(target, {
      [key]: model,
    });
  };
}
