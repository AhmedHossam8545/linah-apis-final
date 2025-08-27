import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRodent_trapDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  trap_type: string;

  @IsString() @IsNotEmpty()
  block_id: string;
  id: string;

}