import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { Specialty } from 'src/specialties/entities/specialty.entity';

export const specialtyRelations: FindOptionsRelations<Specialty> = {
  exams: {
    specialty: true,
  },
};

export const appointmentSelect: FindOptionsSelect<Specialty> = {
  id: true,
  name: true,
  exams: {
    id: true,
    name: true,
    description: true,
    preparetion: true,
    duration: true,
    specialty: {
      id: true,
    },
  },
};
