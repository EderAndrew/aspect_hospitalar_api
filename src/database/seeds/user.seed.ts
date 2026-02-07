import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/enums/user-role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UsersService);

  const existUser = await userService.findByEmail(
    process.env.SEED_EMAIL as string,
  );

  if (existUser) {
    console.log('Usuário já registrado.');
    return;
  }

  await userService.create({
    name: process.env.SEED_NAME as string,
    email: process.env.SEED_EMAIL as string,
    password: process.env.SEED_PASSWORD as string,
    role: process.env.SEED_ROLE as UserRole,
    status: Boolean(process.env.SEED_STATUS),
    avatar: process.env.SEED_AVATAR || '',
    phone: process.env.SEED_PHONE || '',
    cpf: process.env.SEED_CPF as string,
  });

  console.log('Usuário criado com sucesso.');
  await app.close();
}

bootstrap();
