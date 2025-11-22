import { Module } from '@nestjs/common';
import { AppliedService } from './applied.service';
import { AppliedController } from './applied.controller';

@Module({
  controllers: [AppliedController],
  providers: [AppliedService],
})
export class AppliedModule {}
