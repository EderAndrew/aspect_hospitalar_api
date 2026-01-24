import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Schedules } from 'src/schedules/entities/schedules.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  @IsNotEmpty()
  @IsString()
  specialty: string;

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Schedules, schedule => schedule.user)
  schedules: Schedules[];
}
