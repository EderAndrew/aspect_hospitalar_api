import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  readonly patient_id: string;

  @IsUUID()
  @IsNotEmpty()
  readonly exam_id: string;

  @IsUUID()
  @IsNotEmpty()
  readonly doctor_id: string;

  @IsUUID()
  @IsNotEmpty()
  readonly room_id: string;

  @IsDateString()
  @IsNotEmpty()
  readonly start_time: string;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}
