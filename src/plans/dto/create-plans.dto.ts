import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PlanType } from '../enums/plan-type.enum';

export class CreatePlansDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(PlanType)
  readonly type: PlanType;
}
