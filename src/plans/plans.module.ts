import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan } from './entities/plans.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), PatientsModule],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
