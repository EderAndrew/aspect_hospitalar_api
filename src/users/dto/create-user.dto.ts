import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsNotEmpty()
  readonly cpf: string;
}
