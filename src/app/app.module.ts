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
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { PlansModule } from 'src/plans/plans.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PatientsModule } from 'src/patients/patients.module';

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
    AppointmentsModule,
    AuthModule,
    PlansModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
