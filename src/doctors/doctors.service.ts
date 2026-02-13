import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
  ) {}
  async findDoctor(id: string): Promise<Doctor> {
    try {
      const doctor = await this.doctorsRepository.findOne({
        where: { id },
      });

      if (!doctor)
        throw new BadRequestException('Não foi identificado nenhum médico.');

      return doctor;
    } catch (error) {
      console.log(error);
      throw new Error('Method not implemented.');
    }
  }
}
