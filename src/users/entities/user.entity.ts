import { UserRole } from '../enums/user-role.enum';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}
