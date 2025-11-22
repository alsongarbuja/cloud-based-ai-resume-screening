import { Injectable } from '@nestjs/common';
import { CreateAppliedDto } from './dto/create-applied.dto';
import { UpdateAppliedDto } from './dto/update-applied.dto';

@Injectable()
export class AppliedService {
  create(createAppliedDto: CreateAppliedDto) {
    return 'This action adds a new applied';
  }

  findAll() {
    return `This action returns all applied`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applied`;
  }

  update(id: number, updateAppliedDto: UpdateAppliedDto) {
    return `This action updates a #${id} applied`;
  }

  remove(id: number) {
    return `This action removes a #${id} applied`;
  }
}
