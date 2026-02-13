import { IsOptional, IsUUID } from 'class-validator';

export class UpdateDoctorDto {
  @IsUUID()
  @IsOptional()
  specialty_id?: string;
}
