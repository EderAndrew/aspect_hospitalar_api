import { Body, Controller, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { STAFF } from 'src/auth/auth.constants';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientesService: PatientsService) {}

  @Roles(...STAFF)
  @Post('createPatient')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientesService.createPatient(createPatientDto);
  }
}
