import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ResumesModule } from './resumes/resumes.module';
import { AppliedModule } from './applied/applied.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [JobsModule, UsersModule, CompaniesModule, ResumesModule, AppliedModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
