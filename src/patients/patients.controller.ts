import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { STAFF } from 'src/auth/auth.constants';

@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientesService: PatientsService) {}

  @Roles(...STAFF)
  @Post('createPatient')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientesService.createPatient(createPatientDto);
  }
}
