import { Inject, Injectable } from '@nestjs/common';
import { RecruiterModuleConstants } from '../constants';
import { JobRepositoryContract } from '../repositories/job/contract';
import { JobModel } from '../models';

@Injectable()
export class RecruiterService {
    constructor(
        @Inject(RecruiterModuleConstants.jobRepo) private readonly jobRepo: JobRepositoryContract
    ) { }


    async createJob(job): Promise<JobModel> {
        console.log('Job created', job);
        // save to database
        return await this.jobRepo.create(job);
    }

    async fetchAllJobsPaginated(page: number, limit: number) {
        return await this.jobRepo.paginatedJobs(page, limit);
    }

    async getAllJobs(): Promise<JobModel[]> {
        const jobs =  await this.jobRepo.all();
        return jobs;
    }
}
