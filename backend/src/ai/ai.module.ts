import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AppliedModule } from 'src/applied/applied.module';

@Module({
  imports: [AppliedModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
