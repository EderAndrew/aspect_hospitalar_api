import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpecialtyDto } from './dto/create-specialty.dt';
import {
  appointmentSelect,
  specialtyRelations,
} from './queries/specialty.query';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  create(createSpecialtyDto: CreateSpecialtyDto) {
    try {
      return this.specialtyRepository.save(createSpecialtyDto);
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao cadastrar specialidade.');
    }
  }

  findAll() {
    return this.specialtyRepository.find({
      relations: specialtyRelations,
      select: appointmentSelect,
    });
  }

  findSpecialty(id: string) {
    return this.specialtyRepository.findOne({
      where: { id },
    });
  }
}
