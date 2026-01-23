/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: SchedulesService) {}

  @Get()
  schedules(@Query() pagination: any): string {
    const { limit = 10, offset = 0 } = pagination;

    return this.scheduleService.getSchedule(limit, offset);
  }
}
