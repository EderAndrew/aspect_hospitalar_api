import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsUUID()
  @IsNotEmpty()
  specialty_id: string;
}
