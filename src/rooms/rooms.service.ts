import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      return this.roomsRepository.save(createRoomDto);
    } catch (error) {
      console.log(error);
      throw new Error('Problema para criar uma nova sala.');
    }
  }

  async findAllRoom(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async totalRooms() {
    try {
      const exists = await this.roomsRepository.count();

      return exists;
    } catch (error) {
      console.log(error);
      throw new Error('Problema para criar uma nova sala.');
    }
  }

  async findRoom(id: string): Promise<Room> {
    try {
      const room = await this.roomsRepository.findOne({
        where: { id },
      });

      if (!room) throw new BadRequestException('Sala não encontrada.');

      return room;
    } catch (error) {
      console.log(error);
      throw new Error('Erro.');
    }
  }
}
