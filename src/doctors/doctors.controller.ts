import { Body, Controller, Post } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ADMIN_ONLY } from 'src/auth/auth.constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateDoctorWithUserDto } from './dto/create-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles(...ADMIN_ONLY)
  @Post('createDoctor')
  create(@Body() createDoctor: CreateDoctorWithUserDto) {
    return this.doctorsService.createDoctor(createDoctor);
  }
}
