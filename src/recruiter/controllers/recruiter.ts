import { RestController } from "@libs/boat";
import { Body, Controller, Get, Post, Request, Response, UseGuards } from "@nestjs/common";
import { JobDTO } from "../dto/job";
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard";
import { UserService } from "@app/user";
import { RecruiterService } from "../services/recruiter.service";
import { JobDetailTransformer } from "@app/transformer/job";

@Controller('api/recruiter')
export class RecruiterController extends RestController {

    constructor(private recruiterService: RecruiterService) {
        super();
    }

    @Post('jobs')
    @UseGuards(JwtAuthGuard)
    async createjob(@Body() jobDTO: JobDTO, @Request() req, @Response() res): Promise<any> {
        const user = req.user;
        jobDTO.user_id = user.userId;
        const job = await this.recruiterService.createJob(jobDTO);

        return res.success(
            await this.transform(job, new JobDetailTransformer(), { req }),
        );
    }

    @Get('jobs')
    async getAllJobs(@Request() req, @Response() res): Promise<any> {
        const jobs = await this.recruiterService.getAllJobs();
        return res.success(
            await this.collection(jobs, new JobDetailTransformer(), { req }),
        );
    }


}