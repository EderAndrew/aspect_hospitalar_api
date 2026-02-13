import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { SpecialtiesModule } from 'src/specialties/specialties.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), SpecialtiesModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
