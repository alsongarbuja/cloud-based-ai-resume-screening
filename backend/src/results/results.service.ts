import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  create(createResultDto: CreateResultDto) {
    return this.resultRepository.create(createResultDto);
  }

  bulkInsert(values: Result[]) {
    return this.resultRepository.insert(values);
  }

  async check(where: Record<string, any>) {
    const results = await this.resultRepository.find({ where });
    return results.length > 0;
  }

  async findResultsWhere(where: Record<string, any>) {
    const results = await this.resultRepository.find({
      where,
      relations: ['user'],
    });
    const result: {
      jobId: number;
      ranking: {
        user: User;
        rank: number;
        score: number;
        resumeLink: string;
      }[];
    } = {
      jobId: where.jobId as number,
      ranking: [],
    };

    for (let i = 0; i < results.length; i++) {
      result.ranking.push({
        user: results[i].user,
        rank: results[i].rank,
        score: results[i].score,
        resumeLink: results[i].resumeLink,
      });
    }

    return result;
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }
}
