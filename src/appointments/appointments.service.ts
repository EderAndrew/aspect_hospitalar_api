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
    private readonly scheduleRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly examsService: ExamsService,
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { userId, examId } = createAppointmentDto;
    const user = await this.usersService.findOne(userId);
    const exam = await this.examsService.findOne(examId);

    const schedule = this.scheduleRepository.create({
      user,
      exam,
      patient: createScheduleDto.patient,
      date: createScheduleDto.date,
      time: createScheduleDto.time,
      status: createScheduleDto.status,
      info: createScheduleDto.info || '',
    });

    if (!schedule)
      throw new BadRequestException('Erro ao criar um novo agendamento.');

    await this.scheduleRepository.save(schedule);
    // Invalida o cache de schedules para que as próximas requisições GET retornem dados atualizados
    await this.cacheInvalidationService.invalidateSchedulesCache();

    return schedule;
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
