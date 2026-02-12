import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @ManyToMany(() => Doctor, doctor => doctor.specialties)
  doctors: Doctor[];

  @OneToMany(() => Exam, exam => exam.specialty)
  exams?: Exam[];
}
