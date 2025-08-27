import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWatering_logDto {
  @IsString() @IsNotEmpty()
  watering_program_id: string;

  @IsString() @IsNotEmpty()
  generator_start: string;

  @IsOptional() @IsString()
  generator_end?: string;

  @IsOptional() @IsNumber()
  watering_hours?: number;

  @IsOptional() @IsNumber()
  watering_meter_start?: number;

  @IsOptional() @IsNumber()
  watering_meter_end?: number;

  @IsOptional() @IsString()
  notes?: string;

  @IsString() @IsNotEmpty()
  date: string;
  id: string;

}