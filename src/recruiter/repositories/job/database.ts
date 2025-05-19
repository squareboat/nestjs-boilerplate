import { DatabaseRepository, InjectModel } from "@squareboat/nestjs-objection";
import { JobRepositoryContract } from "./contract";
import { Injectable } from "@nestjs/common";
import { JobModel } from "@app/recruiter/models";

@Injectable()
export class JobRepository extends DatabaseRepository<JobModel> implements JobRepositoryContract {
  @InjectModel(JobModel)
  model: JobModel;

  
  async paginatedJobs(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      JobModel.query().offset(offset).limit(limit),
      JobModel.query().resultSize()
    ]);
    return {
      data,
      pagination: {
        total,
        page,
        limit
      }
    };
  }
}