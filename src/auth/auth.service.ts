/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EmailService } from 'src/email/email.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
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
    const user = await this.usersService.findByEmailForAuth(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.hash_password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    const accessToken = await this.signJwtAsync(
      user.id,
      user.role,
      'access',
      this.jwtConfiguration.jwtTtl,
    );

    const refreshToken = await this.signJwtAsync(
      user.id,
      user.role,
      'refresh',
      this.jwtConfiguration.refresh_jwtTtl,
    );

    return { accessToken, refreshToken };
  }

  async refresh(req: Request, refreshTokenBody: string) {
    const refreshToken = refreshTokenBody || req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente.');
    }

    interface JwtPayload {
      sub: string;
      role: UserRole;
      type?: 'access' | 'refresh';
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.jwtConfiguration.secret,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    // valida tipo do token
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token inválido.');
    }

    // valida usuário ainda existe e está ativo
    const user = await this.usersService.findOne(payload.sub);

    if (!user || !user.status) {
      throw new UnauthorizedException('Usuário inválido.');
    }

    // gera novos tokens
    const newAccessToken = await this.signJwtAsync(
      user.id,
      user.role,
      'access',
      this.jwtConfiguration.jwtTtl,
    );

    const newRefreshToken = await this.signJwtAsync(
      user.id,
      user.role,
      'refresh',
      this.jwtConfiguration.refresh_jwtTtl,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async signJwtAsync(
    sub: string,
    role: string,
    type: 'access' | 'refresh',
    expiresIn: number,
  ) {
    return await this.jwtService.signAsync(
      {
        sub,
        role,
        type,
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
