import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMIN_ONLY } from 'src/auth/auth.constants';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Roles(...ADMIN_ONLY)
  @Post('createExam')
  create(@Body() createExamDto: CreateExamDto): Promise<any> {
    return this.examsService.create(createExamDto);
  }

  @Get('findExams')
  findAll(): Promise<Exam[]> {
    return this.examsService.findAll();
  }

  @Get('exam/:id')
  findExam(@Param('id', ParseUUIDPipe) id: string): Promise<Exam> {
    return this.examsService.findExam(id);
  }

  @Delete('exam/:id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.examsService.remove(id);
  }
}
