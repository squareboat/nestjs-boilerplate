import { BaseModel } from './baseModel';

export function InjectModel(model: any): Function {
  if (!(model.prototype instanceof BaseModel)) {
    throw new Error(
      `Instance of ${BaseModel.name} expected, ${typeof model} passed!`,
    );
  }

  return function (target: Function, key: string | symbol) {
    Object.assign(target, {
      [key]: model,
    });
  };
}
