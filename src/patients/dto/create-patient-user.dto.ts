import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { UserRole } from 'src/users/enums/user-role.enum';

export class CreatePatienWithUsertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  birth_date: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsUUID()
  @IsOptional()
  responsible_id?: string;

  @IsUUID()
  @IsOptional()
  plan_id?: string;
}
