import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMIN_ONLY, STAFF } from 'src/auth/auth.constants';
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

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(...STAFF)
  @Get('allSpecialties')
  allSpecialties(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(...STAFF)
  @Get('specialty/:id')
  oneSpecialty(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Specialty | null> {
    return this.specialtiesService.findSpecialty(id);
  }
}
