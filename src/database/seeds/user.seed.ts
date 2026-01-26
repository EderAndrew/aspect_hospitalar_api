import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/enums/user-role.enum';
import { HashingService } from '../../auth/hashing/hashing.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UsersService);
  const hashing = app.get(HashingService);

  const existUser = await userService.findByEmail(
    process.env.SEED_EMAIL as string,
  );

  if (existUser) {
    console.log('Usuário já registrado.');
    return;
  }

  const hashedPassword = await hashing.hash(
    process.env.SEED_PASSWORD as string,
  );

  await userService.create({
    name: process.env.SEED_NAME as string,
    email: process.env.SEED_EMAIL as string,
    password: hashedPassword,
    role: process.env.SEED_ROLE as UserRole,
    avatar: process.env.SEED_AVATAR,
    status: Boolean(process.env.SEED_STATUS),
  });

  console.log('Usuário criado com sucesso.');
  await app.close();
}

bootstrap();
