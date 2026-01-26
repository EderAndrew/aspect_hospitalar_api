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
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    );

    const newUser = {
      ...createUserDto,
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

  async me(tokenPayload: TokenPayloadDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: tokenPayload.sub,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userData = {
      name: updateUserDto?.name,
      avatar: updateUserDto?.avatar,
      role: updateUserDto?.role,
      status: updateUserDto?.status,
    };

    if (updateUserDto?.password) {
      const hashedPassword = await this.hashingService.hash(
        updateUserDto.password,
      );

      userData['password'] = hashedPassword;
    }

    const user = await this.userRepository.preload({
      id,
      ...userData,
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
