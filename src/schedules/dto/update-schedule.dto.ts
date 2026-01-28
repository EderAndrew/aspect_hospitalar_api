import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
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
