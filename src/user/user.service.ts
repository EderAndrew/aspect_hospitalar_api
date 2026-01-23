import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  //this route return all users
  findAll() {
    return 'Retorna todos os Usuários';
  }

  //this route return one user
  findOne() {
    return 'Retorna apenas um usuário';
  }
}
