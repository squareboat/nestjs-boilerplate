import { Inject, Injectable } from '@nestjs/common';
import { RecruiterModuleConstants } from '../constants';
import type { JobRepositoryContract } from '../repositories/job/contract';
import { JobModel } from '../models';
import { JobDTO } from '../dto/job';

@Injectable()
export class RecruiterService {
    constructor(
        @Inject(RecruiterModuleConstants.jobRepo) private readonly jobRepo: JobRepositoryContract
    ) { }


    async createJob(userId: number, job: JobDTO): Promise<JobModel> {
        // model properties are camelCase, knexSnakeCaseMappers maps them to the columns
        return await this.jobRepo.create({
            userId,
            title: job.title,
            description: job.description,
            location: job.location,
            skills: job.skills,
        });
    }

    async fetchAllJobsPaginated(page: number, limit: number) {
        return await this.jobRepo.paginatedJobs(page, limit);
    }

    async getAllJobs(): Promise<JobModel[]> {
        const jobs =  await this.jobRepo.all();
        return jobs;
    }
}
