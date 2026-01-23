import { Controller, Get } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  exams(): string {
    return this.examsService.getExams();
  }
}
