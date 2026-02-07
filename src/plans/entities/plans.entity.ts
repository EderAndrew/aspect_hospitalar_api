import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlanType } from '../enums/plan-type.enum';
import { User } from 'src/users/entities/user.entity';

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
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => User, user => user.plan)
  users: User[];
}
