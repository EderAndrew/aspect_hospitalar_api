/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ExamsModule } from '../exams/exams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import { AuthModule } from 'src/auth/auth.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { PlansModule } from 'src/plans/plans.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigurations: ConfigType<typeof appConfig>) => {
        return {
          type: appConfigurations.database.type,
          host: appConfigurations.database.host,
          port: appConfigurations.database.port,
          database: appConfigurations.database.database,
          username: appConfigurations.database.username,
          password: appConfigurations.database.password,
          autoLoadEntities: appConfigurations.database.autoloadEntities,
          synchronize: appConfigurations.database.synchronize,
        };
      },
    }),
    UsersModule,
    ExamsModule,
    SchedulesModule,
    AuthModule,
    PlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
