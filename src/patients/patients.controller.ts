import { Body, Controller, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientesService: PatientsService) {}

  @Post('createPatient')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientesService.createPatient(createPatientDto);
  }
}
