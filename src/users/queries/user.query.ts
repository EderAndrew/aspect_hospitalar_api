import { FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { User } from '../entities/user.entity';

export const userRelations: FindOptionsRelations<User> = {
  plan: true,
};

export const userSelect: FindOptionsSelect<User> = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  status: true,
  phone: true,
  plan: {
    name: true,
    type: true,
  },
};
