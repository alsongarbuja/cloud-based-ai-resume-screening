import { Injectable } from '@nestjs/common';
import { CreateSavedDto } from './dto/create-saved.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Saved } from './entities/saved.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SavedService {
  constructor(
    @InjectRepository(Saved)
    private savedRepository: Repository<Saved>,
  ) {}

  create(createSavedDto: CreateSavedDto, userId: number) {
    const savedJob = this.savedRepository.create({
      userId,
      jobId: createSavedDto.jobId,
    });
    const createdSavedJob = this.savedRepository.insert(savedJob);
    return createdSavedJob;
  }

  findAll() {
    return `This action returns all saved`;
  }

  findWhere(where: Record<string, any>, relations: string[]) {
    return this.savedRepository.find({
      where,
      relations,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} saved`;
  }

  async remove(jobId: number, userId: number) {
    await this.savedRepository.delete({
      jobId,
      userId,
    });
    return true;
  }
}
