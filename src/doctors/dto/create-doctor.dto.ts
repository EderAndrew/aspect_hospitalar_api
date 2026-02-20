import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class CreateDoctorWithUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsUUID()
  @IsNotEmpty()
  specialty_id: string;
}
