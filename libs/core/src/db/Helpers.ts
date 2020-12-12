import { RepositoryContract } from './repositories/Contract';
import { DbRepositoryException } from '../exceptions/core';
import { BaseModel } from './BaseModel';
import { DatabaseRepository } from './repositories/Database';

export function InjectModel(model: any): Function {
  if (!(model.prototype instanceof BaseModel)) {
    throw new DbRepositoryException(
      `Instance of ${BaseModel.name} expected, ${typeof model} passed!`,
    );
  }

  return function (target: RepositoryContract, key: string | symbol) {
    Object.assign(target, {
      [key]: model,
    });
  };
}

export function InjectRepository(model: any): Function {
  const repo = new DatabaseRepository();
  return function (target: RepositoryContract, key: string | symbol) {
    Object.assign(target, { [key]: repo.setModel(model) });
  };
}
