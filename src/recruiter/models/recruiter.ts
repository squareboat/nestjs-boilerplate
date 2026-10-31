import { BaseModel } from '@squareboat/nestjs-objection';

export class RecruiterModel extends BaseModel {
  static get tableName() {
    return 'users';
  }
  id!: number;
  username!: string;
  password!: string;
  dob!: string; // 'YYYY-MM-DD', see dateStrings in config/database.ts
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: number; // 0: user, 1: recruiter, 2: admin
}
