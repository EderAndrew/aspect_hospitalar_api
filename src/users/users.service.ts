/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { EmailService } from 'src/email/email.service';
import { userSelect } from './queries/user.query';
import { randomNumberCode } from 'src/utils/randomnumberCode';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, ...rest } = createUserDto;

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (exists) {
      throw new BadRequestException('Email já cadastrado.');
    }

    const hash = randomNumberCode();
    const hashedPassword = await this.hashingService.hash(hash);

    const user = {
      ...rest,
      email: normalizedEmail,
      hash_password: hashedPassword,
    };

    try {
      await this.userRepository.save(user);

      await this.emailService.sendEmail(
        createUserDto.email,
        'Senha de acesso Hospital Portal',
        `Segue senha para o seu primeiro acesso ao sistema Hospital Portal: ${hash}`,
      );
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar usuário');
    }

    return { message: 'Usuário criado com sucesso' };
  }

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
      select: userSelect,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Campos permitidos para qualquer usuário
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.photo !== undefined) user.photo = updateUserDto.photo;
    if (updateUserDto.photo_url !== undefined)
      user.photo_url = updateUserDto.photo_url;

    if (updateUserDto.hash_password) {
      user.hash_password = await this.hashingService.hash(
        updateUserDto.hash_password,
      );
    }

    // Campos sensíveis (somente ADMIN)
    if (user?.role === UserRole.ADMIN) {
      if (updateUserDto.role !== undefined) user.role = updateUserDto.role;
      if (updateUserDto.status !== undefined)
        user.status = updateUserDto.status;
    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    await this.userRepository.preload({
      id,
      status: false,
    });

    return { message: 'Usuário removido com sucesso.' };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }
}
