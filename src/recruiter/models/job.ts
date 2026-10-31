import { BaseModel } from "@squareboat/nestjs-objection";

export class JobModel extends BaseModel {
  static get tableName() {
    return 'jobs';
  }

  id!: number;
  userId!: number;
  title!: string;
  description!: string;
  location!: string;
  skills!: string;
  createdAt!: Date;
  updatedAt!: Date;
  

}
