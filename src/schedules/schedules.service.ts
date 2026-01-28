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
import { PaginatedResponseDto } from './dto/paginated-response.dto';

const SCHEDULES_CACHE_PREFIX = 'schedules:list';
const SCHEDULES_ACTIVE_CACHE_PREFIX = 'schedules:active:list';

const SCHEDULES_TOTAL_CACHE_KEY = 'schedules:total';
const SCHEDULES_ACTIVE_TOTAL_CACHE_KEY = 'schedules:active:total';

const SCHEDULES_CACHE_TTL = 60_000; // 1 minuto

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

  private getPaginatedCacheKey(
    prefix: string,
    limit: number,
    offset: number,
  ): string {
    return `${prefix}:limit=${limit}:offset=${offset}`;
  }

  private async invalidateSchedulesCache(): Promise<void> {
    // Limpa apenas os totais
    // As listas serão recriadas automaticamente
    await Promise.all([
      this.cacheManager.del(SCHEDULES_TOTAL_CACHE_KEY),
      this.cacheManager.del(SCHEDULES_ACTIVE_TOTAL_CACHE_KEY),
    ]);
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
      info: createScheduleDto.info || '',
    });

    if (!schedule)
      throw new BadRequestException('Erro ao criar um novo agendamento.');

    await this.scheduleRepository.save(schedule);
    await this.invalidateSchedulesCache();

    return schedule;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Schedules>> {
    const { limit = 10, offset = 0 } = paginationDto;
    const listCacheKey = this.getPaginatedCacheKey(
      SCHEDULES_CACHE_PREFIX,
      limit,
      offset,
    );

    const cachedList = await this.cacheManager.get<Schedules[]>(listCacheKey);

    let total = await this.cacheManager.get<number>(SCHEDULES_TOTAL_CACHE_KEY);

    if (total === undefined || total === null) {
      total = await this.scheduleRepository.count();
      await this.cacheManager.set(
        SCHEDULES_TOTAL_CACHE_KEY,
        total,
        SCHEDULES_CACHE_TTL,
      );
    }
    if (cachedList) {
      return {
        items: cachedList,
        total,
      };
    }
    const items: Schedules[] = await this.scheduleRepository.find({
      take: limit,
      skip: offset,
      relations: scheduleRelations,
      select: scheduleSelect,
    });
    await this.cacheManager.set(listCacheKey, items, SCHEDULES_CACHE_TTL);
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
    const listCacheKey = this.getPaginatedCacheKey(
      SCHEDULES_ACTIVE_CACHE_PREFIX,
      limit,
      offset,
    );

    const cachedList = await this.cacheManager.get<Schedules[]>(listCacheKey);

    let total = await this.cacheManager.get<number>(
      SCHEDULES_ACTIVE_TOTAL_CACHE_KEY,
    );

    if (total === undefined || total === null) {
      total = await this.scheduleRepository.count({
        where: { status: true },
      });

      await this.cacheManager.set(
        SCHEDULES_ACTIVE_TOTAL_CACHE_KEY,
        total,
        SCHEDULES_CACHE_TTL,
      );
    }

    if (cachedList) {
      return { items: cachedList, total };
    }

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
    await this.cacheManager.set(listCacheKey, items, SCHEDULES_CACHE_TTL);

    return { items, total };
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
}
