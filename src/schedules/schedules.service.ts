/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Schedules } from './entities/schedules.entity';
import { UsersService } from 'src/users/users.service';
import { ExamsService } from 'src/exams/exams.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { scheduleRelations, scheduleSelect } from './queries/schedule.query';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
    private readonly usersService: UsersService,
    private readonly examsService: ExamsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  //Helper simples para invalidar cache de schedules
  private async invalidateSchedulesCache(): Promise<void> {
    const store = this.cacheManager.stores as any;

    if (store?.keys) {
      const keys: string[] = store.keys('GET:/schedules*');

      await Promise.all(keys.map(key => this.cacheManager.del(key)));
    }
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const { userId, examId } = createScheduleDto;
    const user = await this.usersService.findOne(userId);
    const exam = await this.examsService.findOne(examId);

    const schedule = this.scheduleRepository.create({
      user,
      exam,
      patient: createScheduleDto.patient,
      date: createScheduleDto.date,
      time: createScheduleDto.time,
      status: createScheduleDto.status,
      info: createScheduleDto.info,
    });

    if (!schedule)
      throw new BadRequestException('Erro ao criar um novo agendamento.');

    await this.scheduleRepository.save(schedule);

    await this.invalidateSchedulesCache();

    return schedule;
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
    await this.invalidateSchedulesCache();

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
    await this.invalidateSchedulesCache();

    return { message: 'Agendamento removido com sucesso.' };
  }

  getSchedule(limit: any, offset: any) {
    return `Pegando os agendamentos: ${limit}, ${offset}`;
  }
}
