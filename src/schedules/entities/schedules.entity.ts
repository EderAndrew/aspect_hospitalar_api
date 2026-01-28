import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exam } from 'src/exams/entities/exam.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.schedules, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Exam, exam => exam.schedules, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  patient: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  time: string;

  @Column({ length: 255 })
  @IsString()
  @IsOptional()
  info?: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  finished: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
