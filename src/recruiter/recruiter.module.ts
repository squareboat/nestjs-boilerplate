import { Module } from '@nestjs/common';
import { RecruiterService } from './services/recruiter.service';
import { RecruiterController } from './controllers';
import { JobRepository } from './repositories/job/database';
import { RecruiterModuleConstants } from './constants';

@Module({
  controllers: [RecruiterController],
  providers: [
    RecruiterService,
    {
      provide: RecruiterModuleConstants.jobRepo,
      useClass: JobRepository,
    },
    JobRepository
  ]
})
export class RecruiterModule {}
