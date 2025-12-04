import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ResumesModule } from './resumes/resumes.module';
import { AppliedModule } from './applied/applied.module';
import { ResultsModule } from './results/results.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndustryModule } from './industry/industry.module';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
        synchronize: true, // TODO: false in production
      }),
      inject: [ConfigService],
    }),
    JobsModule,
    UsersModule,
    CompaniesModule,
    ResumesModule,
    AppliedModule,
    ResultsModule,
    IndustryModule,
    AuthModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
