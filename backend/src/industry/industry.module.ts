import { Module } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from './entities/industry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}
