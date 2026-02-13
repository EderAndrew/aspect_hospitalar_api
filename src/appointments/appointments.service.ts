import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ExamsService } from 'src/exams/exams.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { scheduleRelations, scheduleSelect } from './queries/appointment.query';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { CacheInvalidationService } from 'src/common/services/cache-invalidation.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly examsService: ExamsService,
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const {
      patient_id,
      exam_id,
      doctor_id,
      room_id,
      start_time,
      end_time,
      notes,
    } = dto;

    // Buscar entidades relacionadas
    const [patient, exam, doctor, room] = await Promise.all([
      this.patientsService.findOne(patient_id),
      this.examsService.findOne(exam_id),
      this.doctorsService.findOne(doctor_id),
      this.roomsService.findOne(room_id),
    ]);

    if (!patient || !exam || !doctor || !room) {
      throw new BadRequestException('Dados inválidos para o agendamento.');
    }

    // Validação de horário
    if (new Date(end_time) <= new Date(start_time)) {
      throw new BadRequestException(
        'O horário final deve ser maior que o horário inicial.',
      );
    }

    const appointment = this.appointmentRepository.create({
      patient,
      exam,
      doctor,
      room,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      status: AppointmentStatus.SCHEDULED,
      notes: notes ?? null,
    });

    await this.appointmentRepository.save(appointment);

    await this.cacheInvalidationService.invalidateSchedulesCache();

    return appointment;
}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Schedules>> {
    const { limit = 10, offset = 0 } = paginationDto;

    const items: Schedules[] = await this.scheduleRepository.find({
      take: limit,
      skip: offset,
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    const total = await this.scheduleRepository.count();

    return { items, total };
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id,
      },
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    if (!schedule) throw new NotFoundException('Agendamento não encontrados');

    return schedule;
  }

  async findAllActives(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Schedules>> {
    const { limit = 10, offset = 0 } = paginationDto;

    const items = await this.scheduleRepository.find({
      where: {
        status: true,
      },
      take: limit,
      skip: offset,
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    if (!items) throw new NotFoundException('Agendamentos não encontrados');

    const total = await this.scheduleRepository.count({
      where: { status: true },
    });

    return { items, total };
  }

  async findByUserId(id: string): Promise<Schedules[]> {
    const items = await this.scheduleRepository.find({
      where: {
        user: { id },
        status: true,
      },
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    return items;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.preload({
      id,
      ...updateScheduleDto,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao atualizar o agendamento.');

    await this.scheduleRepository.save(schedule);
    await this.cacheInvalidationService.invalidateSchedulesCache();

    return { message: 'Agendamento atualizado com sucesso.' };
  }

  async remove(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.preload({
      id,
      status: updateScheduleDto.status,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao remover o agendamento.');

    await this.scheduleRepository.save(schedule);
    await this.cacheInvalidationService.invalidateSchedulesCache();

    return { message: 'Agendamento removido com sucesso.' };
  }
}
