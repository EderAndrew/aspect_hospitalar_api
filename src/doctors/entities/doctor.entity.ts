import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.doctor, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ length: 30 })
  crm: string;

  @ManyToMany(() => Specialty, specialty => specialty.doctors)
  @JoinTable({
    name: 'specialty_id',
  })
  specialties: Specialty[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments?: Appointment[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
