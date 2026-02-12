import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlanType } from '../enums/plan-type.enum';
import { Patient } from 'src/patients/entities/patient.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(PlanType)
  @Column({ type: 'enum', enum: PlanType, default: PlanType.INDIVIDUAL })
  type: PlanType;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Patient, patient => patient.plan)
  patients?: Patient[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
}
