import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly specialty: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly preparetion: string;

  @IsNotEmpty()
  @IsString()
  readonly duration: string;
}
