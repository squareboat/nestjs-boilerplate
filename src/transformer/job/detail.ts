import { Transformer } from '@libs/boat';

export class JobDetailTransformer extends Transformer {
  availableIncludes = [];
  defaultIncludes = [];

  async transform(job: Record<string, any>): Promise<Record<string, any>> {
    console.log('Transforming job: ', job);
    
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      skills: job.skills,
      user_id: job.user_id,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

}
