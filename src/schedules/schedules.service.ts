import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedules.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ExamsService } from 'src/exams/exams.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { scheduleRelations, scheduleSelect } from './queries/schedule.query';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
    private readonly usersService: UsersService,
    private readonly examsService: ExamsService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const { userId, examId } = createScheduleDto;
    const user = await this.usersService.findOne(userId);
    const exam = await this.examsService.findOne(examId);

    const newSchedule = {
      user,
      exam,
      patient: createScheduleDto.patient,
      date: createScheduleDto.date,
      time: createScheduleDto.time,
      status: createScheduleDto.status,
      info: createScheduleDto.info,
    };

    const schedule = this.scheduleRepository.create(newSchedule);

    if (!schedule)
      throw new BadRequestException('Erro ao criar um novo agendamento.');

    await this.scheduleRepository.save(schedule);

    return {
      ...schedule,
      userId: { id: schedule.user.id },
      examId: { id: schedule.exam.id },
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const schedules = await this.scheduleRepository.find({
      take: limit,
      skip: offset,
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    return schedules;
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

  async findAllActives() {
    const schedules = await this.scheduleRepository.find({
      where: {
        status: true,
      },
      relations: scheduleRelations,
      select: scheduleSelect,
    });

    if (!schedules) throw new NotFoundException('Agendamentos não encontrados');

    return schedules;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.preload({
      id,
      ...updateScheduleDto,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao atualizar o agendamento.');

    await this.scheduleRepository.save(schedule);

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

    return { message: 'Agendamento removido com sucesso.' };
  }

  getSchedule(limit: any, offset: any) {
    return `Pegando os agendamentos: ${limit}, ${offset}`;
  }
}
