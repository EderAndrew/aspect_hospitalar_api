import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { PlanType } from '../enums/plan-type.enum';

export class CreatePlansDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;

  @IsNotEmpty()
  @IsEnum(PlanType)
  readonly type: PlanType;
}
