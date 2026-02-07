import { PartialType } from '@nestjs/mapped-types';
import { CreatePlansDto } from './create-plans.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlansDto extends PartialType(CreatePlansDto) {
  @IsOptional()
  @IsBoolean()
  readonly status: boolean;
}
