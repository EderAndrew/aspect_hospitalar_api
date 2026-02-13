import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './entities/specialty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty]), DoctorsModule],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
})
export class SpecialtiesModule {}
