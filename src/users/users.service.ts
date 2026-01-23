import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  //this route return all users
  @HttpCode(HttpStatus.OK)
  findAll() {
    return 'Retorna todos os Usuários';
  }

  //this route return one user
  findOne(id: string) {
    return `retorna um usuário ${id}`;
  }

  create(payload: CreateUserDto) {
    return `Criando um usuário: ${JSON.stringify(payload)}`;
  }

  update(id: string, payload: UpdateUserDto) {
    return `Atualizando um usuário: ${id}, ${JSON.stringify(payload)}`;
  }

  remove(id: string) {
    return `Removendo o usuário ${id}`;
  }
}
