/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlansDto } from './dto/create-plans.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plans.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async create(createPlansDto: CreatePlansDto) {
    try {
      const plan = this.planRepository.create(createPlansDto);

      await this.planRepository.save(plan);

      return { message: 'Novo plano de Saúde criado com sucesso.' };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Plano já cadastrado');
      }

      throw new InternalServerErrorException('Erro ao criar plano');
    }
  }

  async findAll() {
    try {
      return await this.planRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar planos de saúde.');
    }
  }

  async findone(id: string) {
    try {
      const plan = await this.planRepository.findOne({
        where: {
          id,
        },
      });

      if (!plan) throw new NotFoundException('Exame não encontrado.');
      return plan;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar plano de saúde.');
    }
  }
}
