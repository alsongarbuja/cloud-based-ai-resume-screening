import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { CreateSavedDto } from './dto/create-saved.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  create(@Req() req, @Body() createSavedDto: CreateSavedDto) {
    const userId: number = req.user.id;
    return this.savedService.create(createSavedDto, userId);
  }

  @Get()
  findAll() {
    return this.savedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedService.findOne(+id);
  }

  @Delete(':jobId')
  @UseGuards(JWTAuthGuard)
  remove(@Req() req, @Param('jobId') jobId: string) {
    const userId: number = req.user.id;
    return this.savedService.remove(+jobId, userId);
  }
}
