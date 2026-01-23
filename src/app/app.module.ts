import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { ExamsModule } from 'src/exams/exams.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [UserModule, ExamsModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
