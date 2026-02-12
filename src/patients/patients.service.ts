import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  createPatient(createPatientDto: CreatePatientDto) {
    console.log(createPatientDto);
    return 'Criar Pacientes';
  }
}
