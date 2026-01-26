import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

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
