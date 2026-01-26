import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { setAuthCookies } from './cookie.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    setAuthCookies(res, accessToken, refreshToken);

    return { success: true };
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { newAccessToken, newRefreshToken } =
      await this.authService.refresh(req);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return { success: true };
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
