import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecialtyDt {
  @IsString()
  @IsNotEmpty()
  name: string;
}
