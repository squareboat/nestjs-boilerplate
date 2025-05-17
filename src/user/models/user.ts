import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel {
  static get tableName() {
    return 'users';
  }
  id!: number;
  username!: string;
  password!: string;
  dob!: Date;
  first_name!: string;
  last_name!: string;
  email!: string;
  role!: string;
}
