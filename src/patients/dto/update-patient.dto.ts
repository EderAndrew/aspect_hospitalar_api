import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsUUID()
  @IsOptional()
  responsible_id?: string;

  @IsUUID()
  @IsOptional()
  plan_id?: string;
}
