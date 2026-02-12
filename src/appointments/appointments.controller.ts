import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
//import { HandlerCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(AuthTokenGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post('create')
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<any> {
    return this.appointmentService.create(createAppointmentDto);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('allSchedules')
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    return this.appointmentService.findAll(paginationDto);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('schedule/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Schedules> {
    return this.scheduleService.findOne(id);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('allActiveSchedules')
  findActives(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Schedules>> {
    return this.scheduleService.findAllActives(paginationDto);
  }

  @Get('allUserSchedules/:id')
  findByUserId(@Param('id', ParseUUIDPipe) id: string): Promise<Schedules[]> {
    return this.scheduleService.findByUserId(id);
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
