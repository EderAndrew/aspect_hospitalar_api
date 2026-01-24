import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedules } from './entities/schedules.entity';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
//import { HandlerCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: SchedulesService) {}

  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto): Promise<any> {
    return this.scheduleService.create(createScheduleDto);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('allSchedules')
  findAll(@Query() paginationDto: PaginationDto): Promise<Schedules[]> {
    return this.scheduleService.findAll(paginationDto);
  }

  @Get('schedule/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Schedules> {
    return this.scheduleService.findOne(id);
  }

  @Get('allActiveSchedules')
  findActives(): Promise<Schedules[]> {
    return this.scheduleService.findAllActives();
  }

  @Patch('updateSchedule/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<any> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Patch('removeSchedule/:id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<any> {
    return this.scheduleService.remove(id, updateScheduleDto);
  }
}
