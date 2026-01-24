import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedules.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ExamsService } from 'src/exams/exams.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

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

    return schedule;
  }

  getSchedule(limit: any, offset: any) {
    return `Pegando os agendamentos: ${limit}, ${offset}`;
  }
}
