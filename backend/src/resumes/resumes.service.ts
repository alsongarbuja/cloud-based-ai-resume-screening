import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
  ) {}

  create(createResumeDto: CreateResumeDto) {
    return 'This action adds a new resume';
  }

  findAll() {
    return this.resumeRepository.find();
  }

  findOne(id: number) {
    return this.resumeRepository.findBy({ id });
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return this.resumeRepository.delete(id);
  }
}
