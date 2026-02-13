import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMIN_ONLY } from 'src/auth/auth.constants';
import { CreateSpecialtyDto } from './dto/create-specialty.dt';
import { Specialty } from './entities/specialty.entity';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(...ADMIN_ONLY)
  @Post('createSpecialty')
  create(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    return this.specialtiesService.create(createSpecialtyDto);
  }
}
