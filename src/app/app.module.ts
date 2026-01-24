import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ExamsModule } from '../exams/exams.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'aspect-hospitalar',
      username: 'postgres',
      password: 'admin',
      autoLoadEntities: true, //It loads the entities without needing to specify them.
      synchronize: true, //Sincronizes with DB. Do not use in production
    }),
    UsersModule,
    ExamsModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
