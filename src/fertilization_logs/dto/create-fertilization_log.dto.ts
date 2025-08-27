import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFertilization_logDto {
  @IsString() @IsNotEmpty()
  sector_id: string;

  @IsString() @IsNotEmpty()
  crop_id: string;

  @IsOptional() @IsNumber()
  total_fertilization_area?: number;

  @IsOptional() @IsNumber()
  total_crops?: number;

  @IsNumber() @IsNotEmpty()
  dose_used: number;

  @IsNumber() @IsNotEmpty()
  dose_not_used: number;

  @IsOptional() @IsString()
  reason?: string;

  @IsString() @IsNotEmpty()
  fertilization_program_id: string;

  @IsString() @IsNotEmpty()
  date: string;
  id: string;
}