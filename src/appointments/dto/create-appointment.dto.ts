import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  readonly userId: string;

  @IsUUID()
  readonly examId: string;

  @IsNotEmpty()
  @IsString()
  readonly patient: string;

  @IsNotEmpty()
  @IsDateString()
  readonly date: string;

  @IsNotEmpty()
  @IsString()
  readonly time: string;

  @IsOptional()
  @IsString()
  readonly info?: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;
}
