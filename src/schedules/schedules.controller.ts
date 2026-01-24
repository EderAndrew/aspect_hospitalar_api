/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: SchedulesService) {}

  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto): Promise<any> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  schedules(@Query() pagination: any): string {
    const { limit = 10, offset = 0 } = pagination;

    return this.scheduleService.getSchedule(limit, offset);
  }
}
