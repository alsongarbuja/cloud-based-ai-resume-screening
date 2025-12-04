import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AppliedService } from 'src/applied/applied.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly appliedService: AppliedService,
  ) {}

  @Post('predict')
  async getPrediction(@Body() inputDto: { jobId: number }) {
    const applications = await this.appliedService.findWhere({
      jobId: { id: inputDto.jobId },
    });

    const cleanTexts = applications.map((app) => app.cleanText);
    const job = applications[0].jobId;

    const predictionResult = await this.aiService.runPrediction({
      job_post_texts: [job.desc, job.resp, job.req],
      resumes_texts: cleanTexts,
    });
    return {
      success: true,
      data: predictionResult,
    };
  }
}
