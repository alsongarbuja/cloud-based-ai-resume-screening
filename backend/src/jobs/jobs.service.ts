import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  create(createJobDto: CreateJobDto, companyId: number) {
    const job = this.jobRepository.create({
      ...createJobDto,
      createdBy: { id: companyId },
    });
    const savedJob = this.jobRepository.insert(job);
    return savedJob;
  }

  async findAll(filters?: Record<string, any>) {
    const jobs = await this.jobRepository.find({
      where: filters || {},
      relations: ['createdBy'],
    });
    return jobs;
  }

  findOne(id: number) {
    return this.jobRepository.findOneBy({ id });
  }

  async findWhere(companyId: number) {
    const jobs = await this.jobRepository.findBy({
      createdBy: { id: companyId },
    });
    return jobs;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.jobRepository.update({ id }, updateJobDto);
    return job;
  }

  remove(id: number) {
    return this.jobRepository.delete(id);
  }
}
