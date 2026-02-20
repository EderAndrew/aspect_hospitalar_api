import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm/browser';
import { User } from 'src/users/entities/user.entity';
import { CreateDoctorWithUserDto } from './dto/create-doctor.dto';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
    private readonly dataSource: DataSource,
  ) {}

  async createDoctor(doctorDto: CreateDoctorWithUserDto): Promise<Doctor> {
    try {
      return await this.dataSource.transaction(async manager => {
        const existUser = await manager.findOne(User, {
          where: { email: doctorDto.email },
        });

        if (existUser) {
          throw new ConflictException('Email já está em uso');
        }

        const existDoctor = await manager.findOne(Doctor, {
          where: { crm: doctorDto.crm },
        });

        if (existDoctor) {
          throw new ConflictException('CRM já cadastrado.');
        }

        const user = manager.create(User, {
          name: doctorDto.name,
          email: doctorDto.email,
          role: UserRole.DOCTOR,
        });

        await manager.save(user);

        const doc = manager.create(Doctor, {
          crm: doctorDto.crm,
          specialties: [{ id: doctorDto.specialty_id }],
          user,
        });

        await manager.save(doc);

        return doc;
      });
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar um novo médico.');
    }
  }

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

  async totalDoctors(): Promise<number> {
    try {
      const total = await this.doctorsRepository.count();

      return total;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar um médico.');
    }
  }
}
