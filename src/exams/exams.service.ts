import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto) {
    const exam = this.examRepository.create(createExamDto);

    await this.examRepository.save(exam);

    return { message: 'Exame criado com sucesso' };
  }

  async findAll() {
    const exams = await this.examRepository.find();

    if (exams.length === 0)
      throw new BadRequestException('Nenhum exame encontrado.');

    return exams;
  }

  async findExam(id: string) {
    const exam = await this.examRepository.findOne({
      where: {
        id,
      },
    });

    if (!exam) throw new NotFoundException('Exame não encontrado.');
    return exam;
  }

  async remove(id: string) {
    const exam = await this.examRepository.findOneBy({ id });

    if (!exam) throw new NotFoundException('Exame não encontrado');

    await this.examRepository.remove(exam);

    return { message: 'Exame removido com sucesso' };
  }
}
