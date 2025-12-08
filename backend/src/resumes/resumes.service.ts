import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
  ) {}

  create(
    createResumeDto: CreateResumeDto & {
      resumeLink: string;
    },
  ) {
    const resume = this.resumeRepository.create(createResumeDto);
    const savedResume = this.resumeRepository.insert({
      name: resume.name,
      resumeLink: resume.resumeLink,
      uploadedBy: { id: +createResumeDto.userId },
    });
    return savedResume;
  }

  findByUserId(userId: number) {
    return this.resumeRepository.findOneBy({ uploadedBy: { id: userId } });
  }

  remove(id: number) {
    return this.resumeRepository.delete(id);
  }
}
