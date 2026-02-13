/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { setAuthCookies } from './cookie.helper';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CookieInterceptor } from 'src/common/interceptors/cookie.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*@Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }*/

  @UseInterceptors(CookieInterceptor)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    return { accessToken, refreshToken };
  }

  @UseInterceptors(CookieInterceptor)
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshAnotherToken: string,
    @Req() req: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req,
      refreshAnotherToken,
    );

    return { accessToken, refreshToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      path: '/',
    });

    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return { success: true };
  }
}
