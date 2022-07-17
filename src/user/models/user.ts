import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel {
  static tableName = 'users';
}
