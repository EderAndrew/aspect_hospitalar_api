import { PartialType } from '@nestjs/mapped-types';

import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsDateString()
  readonly date?: string;

  @IsOptional()
  @IsString()
  readonly time?: string;

  @IsOptional()
  @IsString()
  readonly info?: string;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly finished?: boolean;
}
