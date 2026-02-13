import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { User } from '../entities/user.entity';

export const userRelations: FindOptionsRelations<User> = {
  doctor: true,
};

export const userSelect: FindOptionsSelect<User> = {
  id: true,
  name: true,
  email: true,
  photo: true,
  photo_url: true,
  role: true,
  status: true,
};
