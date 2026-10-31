import { BaseModel } from '@squareboat/nestjs-objection';

export class RecruiterModel extends BaseModel {
  static get tableName() {
    return 'users';
  }
  id!: number;
  username!: string;
  password!: string;
  dob!: Date;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;
}
