import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulesService {
  getSchedule(limit: any, offset: any) {
    return `Pegando os agendamentos: ${limit}, ${offset}`;
  }
}
