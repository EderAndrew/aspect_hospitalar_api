import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { Rooms } from '../rooms';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roomService = app.get(RoomsService);

  const exists = await roomService.totalRooms();

  if (exists > 0) {
    console.log('Salas já existem.');
    return;
  }

  for (const room of Rooms) {
    await roomService.createRoom(room);
  }

  console.log('Salas criadas com sucesso.');
  await app.close();
}

bootstrap();
