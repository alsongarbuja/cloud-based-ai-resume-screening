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
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CompaniesService } from 'src/companies/companies.service';
import { User } from 'src/users/entities/user.entity';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly companyService: CompaniesService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(@Req() req, @Body() createJobDto: CreateJobDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const company = await this.companyService.findWhere((req.user as User).id);
    if (!company) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Company not found',
      };
    }
    return this.jobsService.create(createJobDto, company.id);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('mine')
  @UseGuards(JWTAuthGuard)
  async findMine(@Req() req) {
    // console.log(req.user);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const company = await this.companyService.findWhere((req.user as User).id);
    if (!company) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Company not found',
      };
    }

    return this.jobsService.findWhere(company.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
