import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

  findAll() {
    return this.resultRepository.find();
  }

  findOne(id: number) {
    return this.resultRepository.findBy({ id });
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return this.resultRepository.delete(id);
  }
}
