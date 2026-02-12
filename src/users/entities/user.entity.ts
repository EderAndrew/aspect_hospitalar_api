import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
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
import { Patient } from 'src/patients/entities/patient.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
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
  hash_password: string;

  @Column({ length: 255 })
  @IsOptional()
  photo?: string;

  @Column({ length: 255 })
  @IsOptional()
  photo_url?: string;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToOne(() => Patient, patient => patient.user)
  patient?: Patient;
}
