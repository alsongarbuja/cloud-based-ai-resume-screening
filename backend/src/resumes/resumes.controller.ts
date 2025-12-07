import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('resumes')
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('resume'))
  async create(
    @Req() req,
    @Body() createResumeDto: CreateResumeDto,
    @UploadedFile() file,
  ) {
    const userId: number = req.user.id;
    const resumeUrl =
      'https://kaam-ai.s3.us-east-1.amazonaws.com/resumes/Alson_Garbuja_Resume_2025_3.pdf';
    // const resumeUrl = await this.awsService.uploadFile(file, userId, 'resumes');
    const cleanedTextData = await this.awsService.processPdf(resumeUrl);
    return this.resumesService.create({
      ...createResumeDto,
      resumeLink: resumeUrl,
      cleanedResumeText: cleanedTextData.cleaned_text,
    });
  }

  @Get()
  findAll() {
    return this.resumesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumesService.update(+id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(+id);
  }
}
