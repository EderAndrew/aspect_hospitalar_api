import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamsService } from 'src/exams/exams.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  appointmentSelect,
  appointmentsRelation,
} from './queries/appointment.query';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { CacheInvalidationService } from 'src/common/services/cache-invalidation.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PatientsService } from 'src/patients/patients.service';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './enums/appointmentStatus.enum';
import { DoctorsService } from 'src/doctors/doctors.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly examsService: ExamsService,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
    private readonly roomsService: RoomsService,
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
      this.patientsService.findPatient(patient_id),
      this.examsService.findExam(exam_id),
      this.doctorsService.findDoctor(doctor_id),
      this.roomsService.findRoom(room_id),
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
      notes: notes ?? undefined,
    });

    await this.appointmentRepository.save(appointment);

    await this.cacheInvalidationService.invalidateSchedulesCache();

    return appointment;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    const { limit = 10, offset = 0 } = paginationDto;

    const items: Appointment[] = await this.appointmentRepository.find({
      take: limit,
      skip: offset,
      relations: appointmentsRelation,
      select: appointmentSelect,
    });

    const total = await this.appointmentRepository.count();

    return { items, total };
  }

  async findOne(id: string) {
    const schedule = await this.appointmentRepository.findOne({
      where: {
        id,
      },
      relations: appointmentsRelation,
      select: appointmentSelect,
    });

    if (!schedule) throw new NotFoundException('Agendamento não encontrados');

    return schedule;
  }

  async findAllActives(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    const { limit = 10, offset = 0 } = paginationDto;

    const items = await this.appointmentRepository.find({
      where: {
        status: AppointmentStatus.CONFIRMED,
      },
      take: limit,
      skip: offset,
      relations: appointmentsRelation,
      select: appointmentSelect,
    });

    if (!items) throw new NotFoundException('Agendamentos não encontrados');

    const total = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.CONFIRMED },
    });

    return { items, total };
  }

  async findByUserId(id: string): Promise<Appointment[]> {
    const items = await this.appointmentRepository.find({
      where: {
        patient: { id },
        status: AppointmentStatus.CONFIRMED,
      },
      relations: appointmentsRelation,
      select: appointmentSelect,
    });

    return items;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const schedule = await this.appointmentRepository.preload({
      id,
      ...updateAppointmentDto,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao atualizar o agendamento.');

    await this.appointmentRepository.save(schedule);
    await this.cacheInvalidationService.invalidateSchedulesCache();

    return { message: 'Agendamento atualizado com sucesso.' };
  }

  async remove(id: string, updateScheduleDto: UpdateAppointmentDto) {
    const schedule = await this.appointmentRepository.preload({
      id,
      status: updateScheduleDto.status,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao remover o agendamento.');

    await this.appointmentRepository.save(schedule);
    await this.cacheInvalidationService.invalidateSchedulesCache();

    return { message: 'Agendamento removido com sucesso.' };
  }
}
