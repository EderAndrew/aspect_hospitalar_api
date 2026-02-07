import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID()
  @IsOptional()
  readonly planId: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly role: UserRole;

  @IsBoolean()
  @IsOptional()
  readonly status: boolean;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}
