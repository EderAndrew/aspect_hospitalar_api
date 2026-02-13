import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { Specialty } from 'src/specialties/entities/specialty.entity';

export const specialtyRelations: FindOptionsRelations<Specialty> = {
  exams: true,
};

export const appointmentSelect: FindOptionsSelect<Specialty> = {
  id: true,
  name: true,
  exams: {
    id: true,
    name: true,
    specialty: true,
    description: true,
    preparetion: true,
    duration: true,
  },
};
