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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { STAFF } from 'src/auth/auth.constants';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
//import { HandlerCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Roles(...STAFF)
  @Post('create')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(createAppointmentDto);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('allAppointmens')
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    return this.appointmentService.findAll(paginationDto);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('appointment/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentService.findOne(id);
  }

  //@UseInterceptors(HandlerCacheInterceptor)
  @Get('allActiveAppointments')
  findActives(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    return this.appointmentService.findAllActives(paginationDto);
  }

  @Get('allUserSchedules/:id')
  findByUserId(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment[]> {
    return this.appointmentService.findByUserId(id);
  }

  @Patch('updateSchedule/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    return this.appointmentService.update(id, updateApppointmentDto);
  }

  @Patch('removeSchedule/:id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    return this.appointmentService.remove(id, updateApppointmentDto);
  }
}
