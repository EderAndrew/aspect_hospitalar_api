import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { RoomsService } from 'src/rooms/rooms.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roomService = app.get(RoomsService);

  await roomService.createRoom({
    name: '',
    sector: '',
  });

  console.log('Usuário criado com sucesso.');
  await app.close();
}

bootstrap();
