import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { Schedules } from '../entities/appointment.entity';

export const scheduleRelations: FindOptionsRelations<Schedules> = {
  user: true,
  exam: true,
};

export const scheduleSelect: FindOptionsSelect<Schedules> = {
  id: true,
  date: true,
  time: true,
  status: true,
  patient: true,
  info: true,
  user: {
    id: true,
    name: true,
  },
  exam: {
    name: true,
    specialty: true,
    description: true,
    preparetion: true,
    duration: true,
  },
};
