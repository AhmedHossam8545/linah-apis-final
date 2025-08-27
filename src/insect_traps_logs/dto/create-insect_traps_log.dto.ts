import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInsect_traps_logDto {
  @IsString() @IsNotEmpty()
  trap_id: string;

  @IsString() @IsNotEmpty()
  setup_date: string;

  @IsOptional() @IsString()
  health?: string;

  @IsString() @IsNotEmpty()
  notes: string;
  id: string;

}