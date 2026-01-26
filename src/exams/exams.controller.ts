import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('createExam')
  create(@Body() createExamDto: CreateExamDto): Promise<any> {
    return this.examsService.create(createExamDto);
  }

  @Get('findExams')
  findAll(): Promise<Exam[]> {
    return this.examsService.findAll();
  }

  @Get('exam/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Exam> {
    return this.examsService.findOne(id);
  }

  @Delete('exam/:id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.examsService.remove(id);
  }
}
