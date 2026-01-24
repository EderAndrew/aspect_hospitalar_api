import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from './entities/schedules.entity';
import { UsersModule } from 'src/users/users.module';
import { ExamsModule } from 'src/exams/exams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules]), UsersModule, ExamsModule],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
