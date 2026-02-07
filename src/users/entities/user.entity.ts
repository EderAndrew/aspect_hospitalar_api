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
import { UserRole } from '../enums/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Schedules } from 'src/schedules/entities/schedules.entity';
import { Plan } from 'src/plans/entities/plans.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Plan, plan => plan.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan?: Plan;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ length: 255, select: false })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ length: 255 })
  @IsOptional()
  avatar?: string;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ default: true })
  status: boolean;

  @Column({ length: 255, default: null })
  @IsOptional()
  phone?: string;

  @Column({ length: 11, unique: true })
  @IsNotEmpty()
  cpf: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Schedules, schedule => schedule.user)
  schedules: Schedules[];
}
