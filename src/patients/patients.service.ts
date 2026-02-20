import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatienWithUsertDto } from './dto/create-patient-user.dto';
import { DataSource } from 'typeorm/browser';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Gender } from './enums/gender.enum';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    private readonly dataSource: DataSource,
  ) {}

  async findPatient(id: string): Promise<Patient> {
    try {
      const patient = await this.patientsRepository.findOne({
        where: { id },
      });

      if (!patient) {
        throw new BadRequestException('Paciente não encontrado.');
      }
      return patient;
    } catch (error) {
      console.log(error);
      throw new Error('Method not implemented.');
    }
  }

  createPatientWithUser(
    createPatientDto: CreatePatienWithUsertDto,
  ): Promise<Patient> {
    try {
      return this.dataSource.transaction(async manager => {
        const existUser = await manager.findOne(User, {
          where: { email: createPatientDto.email },
        });

        if (existUser) {
          throw new ConflictException('Email já está em uso');
        }

        const existPatient = await manager.findOne(Patient, {
          where: { cpf: createPatientDto.cpf },
        });

        if (existPatient) {
          throw new ConflictException('CPF já cadastrado.');
        }

        const user = manager.create(User, {
          name: createPatientDto.name,
          email: createPatientDto.email,
          role: UserRole.PATIENT,
        });

        await manager.save(user);

        const patient = manager.create(Patient, {
          cpf: createPatientDto.cpf,
          phone: createPatientDto.phone,
          birth_date: createPatientDto.birth_date,
          gender: Gender[createPatientDto.gender as keyof typeof Gender],
          plan: { id: createPatientDto.plan_id },
          user,
        });

        return patient;
      });
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar um novo paciente');
    }
  }
}
