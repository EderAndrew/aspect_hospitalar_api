import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

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
