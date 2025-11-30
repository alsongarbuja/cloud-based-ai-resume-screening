import { Injectable } from '@nestjs/common';
import { UpdateAppliedDto } from './dto/update-applied.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Applied } from './entities/applied.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppliedService {
  constructor(
    @InjectRepository(Applied)
    private appliedRepository: Repository<Applied>,
  ) {}

  create() {
    const applied = new Applied();
    return this.appliedRepository.save(applied);
  }

  findAll() {
    return this.appliedRepository.find();
  }

  findOne(id: number) {
    return this.appliedRepository.findBy({ id });
  }

  update(id: number, updateAppliedDto: UpdateAppliedDto) {
    return `This action updates a #${id} applied`;
  }

  remove(id: number) {
    return this.appliedRepository.delete(id);
  }
}
