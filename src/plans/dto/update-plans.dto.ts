import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlansDto {
  @IsOptional()
  @IsBoolean()
  readonly status: boolean;
}
