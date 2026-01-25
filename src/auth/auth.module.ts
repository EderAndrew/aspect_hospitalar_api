import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BCryptService } from './hashing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BCryptService,
    },
    AuthService,
  ],
  exports: [HashingService, JwtModule, ConfigModule],
  controllers: [AuthController],
})
export class AuthModule {}
