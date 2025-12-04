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

  create(userId: number, jobId: number, usedResume: string) {
    const applied = this.appliedRepository.create({
      userId: { id: userId },
      jobId: { id: jobId },
      usedResume,
    });
    const savedApplied = this.appliedRepository.insert(applied);
    return savedApplied;
  }

  findAll() {
    return this.appliedRepository.find();
  }

  findOne(id: number) {
    return this.appliedRepository.findBy({ id });
  }

  findWhere(where: Record<string, any>) {
    return this.appliedRepository.find({
      where: where,
      relations: {
        userId: true,
        jobId: {
          createdBy: true,
        },
      },
    });
  }

  update(id: number, updateAppliedDto: UpdateAppliedDto) {
    return `This action updates a #${id} applied`;
  }

  remove(id: number) {
    return this.appliedRepository.delete(id);
  }
}
