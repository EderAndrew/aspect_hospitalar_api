import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserDto) {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    const newUser = {
      ...payload,
      password: hashedPassword,
    };

    const user = this.userRepository.create(newUser);

    if (!user) throw new BadRequestException('Erro ao criar um novo usuário');

    await this.userRepository.save(user);

    return { message: 'Usuário criado com sucesso' };
  }

  //this route return all users
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.userRepository.find();

    if (users.length === 0)
      throw new NotFoundException('Usuários não encontrados.');

    return users;
  }

  //this route return one user
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...payload,
    });

    if (!user) throw new BadRequestException('Erro ao atualizar o usuário.');

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    await this.userRepository.remove(user);

    return { message: 'Usuário removido com sucesso.' };
  }
}
