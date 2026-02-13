import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import appConfig from './app.config';
import type { ConfigType } from '@nestjs/config';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  @Public()
  @Get('ping')
  ping() {
    return this.appService.pong();
  }
}
