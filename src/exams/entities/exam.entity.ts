import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ length: 255 })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  preparetion: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ManyToOne(() => Specialty, specialty => specialty.exams, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'specialty_id' })
  specialty?: Specialty;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Appointment, appointment => appointment.exam)
  appointments?: Appointment[];
}
