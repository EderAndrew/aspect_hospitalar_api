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
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/enums/user-role.enum';
import { randomNumberCode } from 'src/utils/randomnumberCode';

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
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.dataSource.transaction(async manager => {
      const userExists = await manager.findOne(User, {
        where: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }],
      });

      if (userExists) {
        return { message: 'Usuário já existe.' };
      }

      const hash = randomNumberCode();
      const hashedPassword = await this.hashingService.hash(hash);

      const user = manager.create(User, {
        name: createUserDto.name,
        cpf: createUserDto.cpf,
        phone: createUserDto.phone || '',
        email: createUserDto.email,
        password: hashedPassword,
        role: UserRole.PATIENT,
        status: true,
      });

      await manager.save(user);
      return { message: 'Usuário criado com sucesso!' };
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
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

  async refresh(req: Request) {
    const refreshToken = req.cookies?.refresh_token as string;
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
