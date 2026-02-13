import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreatePatientDto {
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
