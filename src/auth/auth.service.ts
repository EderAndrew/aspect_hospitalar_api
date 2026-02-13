/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /*async signup(createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.dataSource.transaction(async manager => {
      const userExists = await manager.findOne(User, {
        where: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }],
      });

      if (userExists) {
        throw new ConflictException('Email ou CPF já cadastrado');
      }

      const hash = randomNumberCode();
      const hashedPassword = await this.hashingService.hash(hash);

      const user = manager.create(User, {
        name: createUserDto.name,
        cpf: createUserDto.cpf,
        phone: createUserDto.phone ?? undefined,
        email: createUserDto.email,
        avatar: createUserDto.avatar ?? undefined,
        password: hashedPassword,
        role: UserRole.PATIENT,
        status: true,
      });

      const newUser = await manager.save(user);

      if (!newUser) {
        throw new InternalServerErrorException('Erro ao criar usuário');
      }

      await this.emailService.sendEmail(
        createUserDto.email,
        'Senha de acesso Hospital Portal',
        `Segue senha para o seu primeiro acesso ao sistema Hospital Portal: ${hash}`,
      );

      return {
        message:
          'Usuário criado com sucesso. Acesse o email para verificar a senha do primeiro acesso.',
      };
    });
  }*/

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'hash_password'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.hash_password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const accessToken = await this.signJwtAsync(
      user.id,
      this.jwtConfiguration.jwtTtl,
    );

    const refreshToken = await this.signJwtAsync(
      user.id,
      this.jwtConfiguration.refresh_jwtTtl,
    );

    return { accessToken, refreshToken };
  }

  async refresh(req: Request, refreshTokenBody: string) {
    const refreshToken = refreshTokenBody || req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente.');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      // Ensure type safety for decoded payload
      interface JwtPayload {
        sub: string | number;
        [key: string]: unknown;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.jwtConfiguration.secret,
        },
      );

      const newAccessToken = await this.signJwtAsync(
        payload.sub as string,
        this.jwtConfiguration.jwtTtl,
      );

      const newRefreshToken = await this.signJwtAsync(
        payload.sub as string,
        this.jwtConfiguration.refresh_jwtTtl,
      );

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private async signJwtAsync(sub: string, expiresIn: number) {
    return await this.jwtService.signAsync(
      {
        sub,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
