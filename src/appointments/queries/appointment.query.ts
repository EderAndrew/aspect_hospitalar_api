import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';

export const appointmentsRelation: FindOptionsRelations<Appointment> = {
  patient: true,
  exam: true,
};

export const appointmentSelect: FindOptionsSelect<Appointment> = {
  id: true,
  start_time: true,
  end_time: true,
  status: true,
  patient: true,
  notes: true,
  doctor: true,
  exam: {
    name: true,
    specialty: true,
    description: true,
    preparetion: true,
    duration: true,
  },
};
