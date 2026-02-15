import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMIN_ONLY, STAFF } from 'src/auth/auth.constants';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(...ADMIN_ONLY)
  @Post('createRoom')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Roles(...STAFF)
  @Get('findRooms')
  findAll() {
    return this.roomsService.findAllRoom();
  }

  @Roles(...STAFF)
  @Post('findOneRoom')
  findOneRoom(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.findRoom(id);
  }
}
