import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  examId: string;

  @IsNotEmpty()
  @IsString()
  patient: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  info?: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;
}
