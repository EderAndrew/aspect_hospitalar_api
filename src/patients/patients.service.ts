import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
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
  createPatient(createPatientDto: CreatePatientDto) {
    console.log(createPatientDto);
    return 'Criar Pacientes';
  }
}
