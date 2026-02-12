import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePatientAppointmentDto {
  @IsOptional()
  @IsDateString()
  start_time?: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
