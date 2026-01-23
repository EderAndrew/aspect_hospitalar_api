import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  getSchedule() {
    return 'Retornando Schedules';
  }
}
