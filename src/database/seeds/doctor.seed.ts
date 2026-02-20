import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { DoctorsService } from 'src/doctors/doctors.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { DoctorsSeed } from '../doctors';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const doctorsService = app.get(DoctorsService);

  const exists = await doctorsService.totalDoctors();

  if (exists > 0) {
    console.log('Médicos já existem.');
    return;
  }

  for (const doc of DoctorsSeed) {
    await doctorsService.createDoctor({
      ...doc,
      role: UserRole.DOCTOR,
    });
  }

  console.log('Usuário criado com sucesso.');
  await app.close();
}

bootstrap();
