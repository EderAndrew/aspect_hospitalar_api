import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { Plan } from 'src/plans/entities/plans.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.patient, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ unique: true })
  @IsNotEmpty()
  cpf: string;

  @Column({ length: 20 })
  @IsNotEmpty()
  phone: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @IsEnum(Gender)
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ length: 200 })
  @IsNotEmpty()
  emergency_contact: string;

  @ManyToOne(() => Patient, patient => patient.dependents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'responsible_id' })
  responsible?: Patient;

  @OneToMany(() => Patient, patient => patient.responsible)
  dependents?: Patient[];

  @ManyToOne(() => Plan, plan => plan.patients, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'plan_id' })
  plan?: Plan;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments?: Appointment[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
