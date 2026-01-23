import { Injectable } from '@nestjs/common';

@Injectable()
export class ExamsService {
  getExams() {
    return 'Exames';
  }
}
