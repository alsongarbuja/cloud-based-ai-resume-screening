import { Module } from '@nestjs/common';
import { AppliedService } from './applied.service';
import { AppliedController } from './applied.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applied } from './entities/applied.entity';
import { ResumesModule } from 'src/resumes/resumes.module';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [TypeOrmModule.forFeature([Applied]), ResumesModule, PdfModule],
  controllers: [AppliedController],
  providers: [AppliedService],
  exports: [AppliedService],
})
export class AppliedModule {}
