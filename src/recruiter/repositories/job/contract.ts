import { JobModel } from '@app/recruiter/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface JobRepositoryContract extends RepositoryContract<JobModel> {
  paginatedJobs(page: number, limit: number): Promise<{ data: JobModel[]; pagination: { total: number; page: number; limit: number } }>;
}
