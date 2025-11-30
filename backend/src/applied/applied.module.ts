import { Module } from '@nestjs/common';
import { AppliedService } from './applied.service';
import { AppliedController } from './applied.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applied } from './entities/applied.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applied])],
  controllers: [AppliedController],
  providers: [AppliedService],
})
export class AppliedModule {}
