import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/enums/user-role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UsersService);

  await userService.create({
    name: process.env.SEED_NAME as string,
    email: process.env.SEED_EMAIL as string,
    role: UserRole[process.env.SEED_ROLE as keyof typeof UserRole],
    status: Boolean(process.env.SEED_STATUS),
  });

  console.log('Usuário criado com sucesso.');
  await app.close();
}

bootstrap();
