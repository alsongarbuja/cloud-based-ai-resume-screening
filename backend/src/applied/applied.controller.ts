import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppliedService } from './applied.service';
import { CreateAppliedDto } from './dto/create-applied.dto';
import { UpdateAppliedDto } from './dto/update-applied.dto';

@Controller('applied')
export class AppliedController {
  constructor(private readonly appliedService: AppliedService) {}

  @Post()
  create(@Body() createAppliedDto: CreateAppliedDto) {
    return this.appliedService.create();
  }

  @Get()
  findAll() {
    return this.appliedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appliedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppliedDto: UpdateAppliedDto) {
    return this.appliedService.update(+id, updateAppliedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appliedService.remove(+id);
  }
}
