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

  create(
    createResumeDto: CreateResumeDto & {
      resumeLink: string;
      cleanedResumeText: string;
    },
  ) {
    const resume = this.resumeRepository.create(createResumeDto);
    const savedResume = this.resumeRepository.insert({
      name: resume.name,
      resumeLink: resume.resumeLink,
      cleanResumeText: resume.cleanResumeText,
      uploadedBy: { id: +createResumeDto.userId },
    });
    return savedResume;
  }

  findAll() {
    return this.resumeRepository.find();
  }

  findOne(id: number) {
    return this.resumeRepository.findBy({ id });
  }

  findByUserId(userId: number) {
    return this.resumeRepository.findOneBy({ uploadedBy: { id: userId } });
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return this.resumeRepository.delete(id);
  }
}
