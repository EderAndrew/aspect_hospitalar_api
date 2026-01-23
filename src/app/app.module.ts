import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { ExamsModule } from 'src/exams/exams.module';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  imports: [UsersModule, ExamsModule, SchedulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
