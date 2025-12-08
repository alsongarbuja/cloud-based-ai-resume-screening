import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [JobsModule, AwsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
