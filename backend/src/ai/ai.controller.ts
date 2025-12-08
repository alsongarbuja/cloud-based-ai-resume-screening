import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AwsService } from 'src/aws/aws.service';
import { JobsService } from 'src/jobs/jobs.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly jobService: JobsService,
    private readonly awsService: AwsService,
  ) {}

  @Post('predict')
  @UseGuards(JWTAuthGuard)
  async getPrediction(@Body() inputDto: { jobId: number }) {
    const job = await this.jobService.findOne(inputDto.jobId);
    if (!job) {
      throw new NotFoundException();
    }
    const job_description = job.desc + job.req + job.resp;

    const predictionResult = await this.awsService.predict(job_description);
    return {
      success: true,
      data: predictionResult,
    };
  }
}
