import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AppliedService } from './applied.service';
import { CreateAppliedDto } from './dto/create-applied.dto';
import { UpdateAppliedDto } from './dto/update-applied.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResumesService } from 'src/resumes/resumes.service';

@Controller('applied')
export class AppliedController {
  constructor(
    private readonly appliedService: AppliedService,
    private readonly resumeService: ResumesService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(@Req() req, @Body() createAppliedDto: CreateAppliedDto) {
    const resume = await this.resumeService.findByUserId(req.user.id);
    if (!resume) {
      throw new NotFoundException('Resume not found in your profile');
    }
    return this.appliedService.create(
      req.user.id,
      createAppliedDto.jobId,
      resume.resumeLink,
      resume.cleanResumeText,
    );
  }

  @Get('job/:jobId')
  @UseGuards(JWTAuthGuard)
  async getJobApplications(@Param('jobId') jobId: string) {
    const applications = await this.appliedService.findWhere({
      jobId: { id: +jobId },
    });
    return applications;
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
  @UseGuards(JWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.appliedService.remove(+id);
  }
}
