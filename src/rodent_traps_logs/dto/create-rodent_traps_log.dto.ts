import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRodent_traps_logDto {
  @IsString() @IsNotEmpty()
  trap_id: string;

  @IsString() @IsNotEmpty()
  setup_date: string;

  @IsString() @IsNotEmpty()
  trap_health: string;

  @IsString() @IsNotEmpty()
  notes: string;

  @IsOptional() @IsNumber()
  total?: number;

  @IsOptional() @IsNumber()
  food_percent?: number;
  id: string;

}