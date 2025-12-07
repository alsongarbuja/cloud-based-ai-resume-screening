import { Module } from '@nestjs/common';
import { AppliedService } from './applied.service';
import { AppliedController } from './applied.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applied } from './entities/applied.entity';
import { ResumesModule } from 'src/resumes/resumes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Applied]), ResumesModule],
  controllers: [AppliedController],
  providers: [AppliedService],
  exports: [AppliedService],
})
export class AppliedModule {}
